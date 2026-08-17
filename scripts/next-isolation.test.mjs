import assert from "node:assert/strict";
import { parse } from "@babel/parser";
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { findCssImports } from "./audit-next-css.mjs";

const nextExtensions = [".ts", ".tsx", ".css"];
const resolutionExtensions = [".ts", ".tsx", ".css", ".js", ".jsx", ".mjs", ".cjs"];
const forbiddenPathSegment = /(^|\/)(?:components|patterns|primitives|styles|themes|tokens)(?:\/|$)/;

async function listNextSourceFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listNextSourceFiles(entryPath));
    else if (entry.isFile() && nextExtensions.includes(path.extname(entry.name))) files.push(entryPath);
  }
  return files.sort();
}

function scriptImports(source) {
  const tree = parse(source, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx", "decorators-legacy", "importAttributes"],
  });
  const imports = [];
  function add(node) {
    if (node?.type !== "StringLiteral") return;
    imports.push({ specifier: node.value, line: node.loc.start.line, column: node.loc.start.column + 1 });
  }

  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration" || node.type === "ExportAllDeclaration") {
      add(node.source);
    } else if (node.type === "ImportExpression") {
      add(node.source);
    } else if (node.type === "CallExpression") {
      if (node.callee?.type === "Import" || (node.callee?.type === "Identifier" && node.callee.name === "require")) add(node.arguments?.[0]);
    } else if (node.type === "TSImportType") {
      add(node.argument);
    } else if (node.type === "TSExternalModuleReference") {
      add(node.expression);
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === "loc" || key === "tokens" || key === "comments") continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object" && typeof value.type === "string") visit(value);
    }
  }
  visit(tree.program);
  return imports;
}

function cssImports(source) {
  return findCssImports(source).map(({ index, specifier }) => {
    const before = source.slice(0, index);
    const lines = before.split("\n");
    return { specifier, line: lines.length, column: lines.at(-1).length + 1 };
  });
}

async function resolveCandidate(base) {
  const candidates = [base];
  if (!path.extname(base)) {
    candidates.push(...resolutionExtensions.map((extension) => `${base}${extension}`));
    candidates.push(...resolutionExtensions.map((extension) => path.join(base, `index${extension}`)));
  }

  for (const candidate of candidates) {
    try {
      const candidateStat = await stat(candidate);
      if (candidateStat.isFile()) return { found: true, path: await realpath(candidate) };
    } catch {
      // Try the next Node/CSS resolution candidate.
    }
  }
  return { found: false, path: base };
}

async function findTsConfig(start) {
  let directory = path.resolve(start);
  while (true) {
    const candidate = path.join(directory, "tsconfig.json");
    try {
      const parsed = JSON.parse(await readFile(candidate, "utf8"));
      const baseUrl = path.resolve(directory, parsed.compilerOptions?.baseUrl ?? ".");
      return { baseUrl, paths: parsed.compilerOptions?.paths ?? {} };
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const parent = path.dirname(directory);
    if (parent === directory) return { baseUrl: directory, paths: {} };
    directory = parent;
  }
}

function aliasCapture(pattern, specifier) {
  const wildcard = pattern.indexOf("*");
  if (wildcard < 0) return pattern === specifier ? "" : undefined;
  const prefix = pattern.slice(0, wildcard);
  const suffix = pattern.slice(wildcard + 1);
  if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) return undefined;
  return specifier.slice(prefix.length, specifier.length - suffix.length);
}

async function resolveImport(importer, specifier, config) {
  if (specifier.startsWith(".") || path.isAbsolute(specifier)) {
    return { ...await resolveCandidate(path.resolve(path.dirname(importer), specifier)), alias: false };
  }
  const aliases = Object.entries(config.paths).flatMap(([pattern, targets]) => {
    const capture = aliasCapture(pattern, specifier);
    if (capture === undefined) return [];
    const wildcard = pattern.indexOf("*");
    return [{
      capture,
      exact: wildcard < 0,
      prefixLength: wildcard < 0 ? pattern.length : wildcard,
      suffixLength: wildcard < 0 ? 0 : pattern.length - wildcard - 1,
      targets,
    }];
  }).sort((left, right) => (
    Number(right.exact) - Number(left.exact)
    || right.prefixLength - left.prefixLength
    || right.suffixLength - left.suffixLength
  ));

  const alias = aliases[0];
  if (alias) {
    let fallback;
    for (const target of alias.targets) {
      const resolution = await resolveCandidate(path.resolve(config.baseUrl, target.replaceAll("*", alias.capture)));
      if (resolution.found) return { ...resolution, alias: true };
      fallback ??= resolution;
    }
    return { ...(fallback ?? { found: false, path: specifier }), alias: true };
  }
  return null;
}

function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export async function findNextSourceIsolationViolations(nextRoot) {
  const rootPath = nextRoot instanceof URL ? fileURLToPath(nextRoot) : nextRoot;
  const absoluteNextRoot = await realpath(path.resolve(rootPath));
  const config = await findTsConfig(absoluteNextRoot);
  const files = await listNextSourceFiles(absoluteNextRoot);
  const violations = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const imports = file.endsWith(".css") ? cssImports(source) : scriptImports(source);
    for (const item of imports) {
      const normalizedSpecifier = item.specifier.replaceAll("\\", "/");
      const cssLocal = file.endsWith(".css") && (item.specifier.startsWith(".") || path.isAbsolute(item.specifier));
      const resolved = await resolveImport(file, item.specifier, config);
      const guarded = cssLocal || resolved?.alias || forbiddenPathSegment.test(normalizedSpecifier);
      if (!guarded) continue;
      if (!resolved?.found || !isWithin(absoluteNextRoot, resolved.path)) {
        violations.push({
          id: "legacy-import",
          file: path.relative(process.cwd(), file),
          line: item.line,
          column: item.column,
          specifier: item.specifier,
          resolved: resolved?.path ?? item.specifier,
        });
      }
    }
  }
  return violations;
}

test("exposes Voreal Next only through opt-in subpaths", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.equal(pkg.exports["."], "./src/index.ts");
  assert.equal(pkg.exports["./styles.css"], "./src/styles/index.css");
  assert.equal(pkg.exports["./next"], "./src/next/index.ts");
  assert.equal(pkg.exports["./next/styles.css"], "./src/next/styles.css");
  assert.equal(pkg.exports["./next/components/*"], "./src/next/components/*/index.ts");
  assert.equal(pkg.exports["./next/patterns/directory"], "./src/next/patterns/directory/index.ts");
});

test("keeps all current Voreal Next source imports inside its isolated boundary", async () => {
  const nextRoot = new URL("../src/next", import.meta.url);
  const violations = await findNextSourceIsolationViolations(nextRoot);
  assert.deepEqual(violations, []);
});

test("recursively permits internal Next imports and rejects resolved legacy imports", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-next-isolation-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const nextRoot = path.join(root, "src", "next");
  await mkdir(path.join(nextRoot, "patterns", "directory"), { recursive: true });
  await mkdir(path.join(nextRoot, "components", "actions"), { recursive: true });
  await mkdir(path.join(root, "src", "components", "button"), { recursive: true });
  await writeFile(path.join(nextRoot, "components", "actions", "index.ts"), "export const action = true;\n");
  await writeFile(path.join(root, "src", "components", "button", "index.ts"), "export const legacy = true;\n");
  await writeFile(
    path.join(root, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@*": ["src/legacy/*"],
          "@next/*": ["src/next/*"],
          "@next/*/actions": ["src/next/components/actions/index.ts"],
          "@exact": ["src/next/components/actions/index.ts"],
          "@legacy/*": ["src/*"],
        },
      },
    }),
  );
  await writeFile(
    path.join(nextRoot, "patterns", "directory", "fixture.tsx"),
    `
// import "../../../components/comment-only";
const documentation = "../../../components/string-only";
const jsx = <p>import("../../../components/jsx-text")</p>;
const api = { import() {}, require() {} };
api.import("../../../components/method-import");
api.require("../../../components/method-require");
import { action } from "../../components/actions";
export { legacy } from "../../../components/button";
import external from "vendor/components/external";
import { action as aliasedAction } from "@next/components/actions";
import { action as exactAction } from "@exact";
export { legacy as aliasedLegacy } from "@legacy/components/button";
void import("../../../components/dynamic");
void require("../../../components/required");
import Bad = require("../../../components/import-equals");
void action;
void aliasedAction;
void exactAction;
void Bad;
void external;
void jsx;
`,
  );

  const violations = await findNextSourceIsolationViolations(nextRoot);
  assert.equal(violations.length, 6);
  assert.equal(violations[0].id, "legacy-import");
  assert.equal(violations[0].specifier, "../../../components/button");
  assert.match(violations[0].resolved, /src\/components\/button\/index\.ts$/);
  assert.equal(violations[1].specifier, "vendor/components/external");
  assert.equal(violations[2].specifier, "@legacy/components/button");
  assert.equal(violations[3].specifier, "../../../components/dynamic");
  assert.equal(violations[4].specifier, "../../../components/required");
  assert.equal(violations[5].specifier, "../../../components/import-equals");
});

test("scans CSS imports and follows real paths when deciding the boundary", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-next-realpath-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const nextRoot = path.join(root, "src", "next");
  await mkdir(path.join(nextRoot, "styles"), { recursive: true });
  await mkdir(path.join(root, "src", "styles"), { recursive: true });
  await writeFile(path.join(root, "src", "styles", "legacy.css"), ".vr-old {}\n");
  await writeFile(path.join(root, "src", "styles", "legacy-two.css"), ".vr-old {}\n");
  await writeFile(path.join(nextRoot, "styles", "internal.css"), ".vrn-safe {}\n");
  await writeFile(
    path.join(nextRoot, "styles", "fixture.css"),
    `/* @import "../../styles/comment.css"; */
.vrn-copy::after { content: '@import "../../styles/string.css";'; }
@import url("./internal.css");
@import url("../../styles/legacy.css");
@import url(../../styles/legacy-two.css);
`,
  );

  const violations = await findNextSourceIsolationViolations(nextRoot);
  assert.equal(violations.length, 2);
  assert.equal(violations[0].specifier, "../../styles/legacy.css");
  assert.equal(violations[1].specifier, "../../styles/legacy-two.css");
});
