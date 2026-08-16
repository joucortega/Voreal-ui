import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { evaluateBudget, measureCss, readCssSource } from "./check-css-budget.mjs";

const searchOwnedSelector = /\.vr-directory-(?:search|suggestions)(?:[\w-]*)/;

async function listCssFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listCssFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
  }
  return files;
}

function runNode(...args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ code, stderr }));
  });
}

function findSearchCssOwnershipLeaks(cssSources) {
  return cssSources.flatMap(({ file, source }) => searchOwnedSelector.test(source) ? [file] : []);
}

test("reads one CSS file for a feature-level budget", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-css-"));
  const file = path.join(root, "feature.css");
  await writeFile(file, ".feature{display:grid}", "utf8");
  assert.equal(await readCssSource(file), ".feature{display:grid}");
});

test("joins CSS files from a directory in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-css-"));
  await writeFile(path.join(root, "b.css"), ".b{}", "utf8");
  await writeFile(path.join(root, "a.css"), ".a{}", "utf8");
  assert.equal(await readCssSource(root), ".a{}\n.b{}");
});

test("rejects filesystem inputs that are neither files nor directories", async () => {
  await assert.rejects(readCssSource("/dev/null"), /La entrada CSS debe ser un archivo o directorio: \/dev\/null\./);
});

test("CLI preserves unsupported-input diagnostics", async () => {
  const result = await runNode("scripts/check-css-budget.mjs", "/dev/null");
  assert.equal(result.code, 1);
  assert.match(result.stderr, /La entrada CSS debe ser un archivo o directorio: \/dev\/null\./);
  assert.doesNotMatch(result.stderr, /No se encontró CSS compilado/);
});

test("CLI treats an empty CSS file as missing compiled CSS", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-css-"));
  const file = path.join(root, "empty.css");
  await writeFile(file, "", "utf8");

  const result = await runNode("scripts/check-css-budget.mjs", file);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /No se encontró CSS compilado en/);
});

test("reports every search-owned selector leaked across CSS files", () => {
  assert.deepEqual(findSearchCssOwnershipLeaks([
    { file: "first.css", source: ".vr-directory-search__leak{}" },
    { file: "second.css", source: ".vr-directory-suggestions__leak{}" },
  ]), ["first.css", "second.css"]);
});

test("feature budget includes search-owned form styles and rejects their growth", async () => {
  const source = await readCssSource("src/patterns/directory/search/directory-search.css");
  const allCssFiles = await listCssFiles("src");
  const outsideFeatureSource = allCssFiles.filter((file) => file !== "src/patterns/directory/search/directory-search.css");
  const ownershipLeaks = findSearchCssOwnershipLeaks(await Promise.all(outsideFeatureSource.map(async (file) => ({ file, source: await readFile(file, "utf8") }))));
  const growth = Array.from({ length: 500 }, (_, index) => `--vr-search-regression-${index}:value-${index.toString(36)}-${"x".repeat(index % 31)};`).join("");

  assert.match(source, /\.vr-directory-search\s*\{/);
  assert.deepEqual(ownershipLeaks, []);
  assert.equal(evaluateBudget({ ...measureCss(`${source}\n.vr-directory-search__regression{${growth}}`), budgetBytes: 3072 }).ok, false);
});
