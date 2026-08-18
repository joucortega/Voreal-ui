import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createScanner, LanguageVariant, SyntaxKind } from "typescript/unstable/ast";

const serverFiles = [
  "src/patterns/directory/search/directory-search-form.tsx",
  "src/patterns/directory/search/directory-search-state.ts",
  "src/patterns/directory/search/directory-search.types.ts",
];

const nextServerFiles = [
  "src/next/adapters.ts",
  "src/next/root.tsx",
  "src/next/foundations/layout.tsx",
  "src/next/foundations/typography.tsx",
  "src/next/components/actions/actions.tsx",
  "src/next/components/content/content.tsx",
  "src/next/components/feedback/feedback.tsx",
  "src/next/components/forms/forms.tsx",
  "src/next/components/navigation/navigation.tsx",
  "src/next/components/status/status.tsx",
  "src/next/patterns/directory/directory-business-card.tsx",
  "src/next/patterns/directory/directory-layout.tsx",
  "src/next/patterns/directory/directory-media.tsx",
  "src/next/patterns/directory/directory-pagination.tsx",
  "src/next/patterns/directory/directory-search-form.tsx",
  "src/next/patterns/directory/directory-states.tsx",
  "scripts/fixtures/next-stepper-rsc.tsx",
];

const nextClientFiles = [
  "src/next/components/forms/form-controls.client.tsx",
  "src/next/components/navigation/navigation.client.tsx",
  "src/next/components/overlays/dialog-drawer.client.tsx",
];

const hookIdentifierPattern = /^use[A-Z]/u;

function findHookIdentifiers(source) {
  const scanner = createScanner(true, LanguageVariant.Standard, source);
  const hooks = new Set();

  while (scanner.scan() !== SyntaxKind.EndOfFile) {
    if (scanner.isIdentifier() && hookIdentifierPattern.test(scanner.getTokenValue())) {
      hooks.add(scanner.getTokenValue());
    }
  }

  return [...hooks].sort();
}

test("keeps public directory search server modules free of client dependencies", async () => {
  for (const file of serverFiles) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /^\s*["']use client["']/mu, file);
    assert.doesNotMatch(source, /@radix-ui|use-directory-suggestions|directory-search-suggestions/u, file);
    assert.doesNotMatch(source, /components\/form/u, file);
  }
});

test("imports the directory search submit button without the mixed button barrel", async () => {
  const source = await readFile("src/patterns/directory/search/directory-search-form.tsx", "utf8");
  assert.match(source, /from ["']\.\.\/\.\.\/\.\.\/components\/button\/button["']/u);
  assert.doesNotMatch(source, /from ["']\.\.\/\.\.\/\.\.\/components\/button["']/u);
});

test("keeps Voreal Next server-safe modules free of client dependencies", async () => {
  for (const file of nextServerFiles) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /^\s*["']use client["']/mu, file);
    assert.doesNotMatch(source, /@radix-ui/u, file);
    assert.deepEqual(findHookIdentifiers(source), [], file);
    assert.doesNotMatch(source, /src\/(?:components|patterns|primitives)|\.\.\/\.\.\/\.\.\/(?:components|patterns|primitives)/u, file);
  }
});

test("marks each interactive Voreal Next core module as client-only", async () => {
  for (const file of nextClientFiles) {
    const source = await readFile(file, "utf8");
    assert.match(source, /^\s*["']use client["'];/u, file);
  }
});

test("typechecks a static NextStepper consumer without a client module", () => {
  const result = spawnSync(
    "./node_modules/.bin/tsc",
    ["-p", "scripts/fixtures/tsconfig.next-stepper-rsc.json", "--pretty", "false"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test("bundles the public static NextStepper import without client or Radix code", async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "voreal-next-stepper-"));
  const outputFile = join(temporaryDirectory, "consumer.mjs");
  const metafile = join(temporaryDirectory, "meta.json");

  try {
    const result = spawnSync(
      "./node_modules/.bin/esbuild",
      [
        "scripts/fixtures/next-stepper-rsc.tsx",
        "--bundle",
        "--platform=node",
        "--format=esm",
        "--external:react",
        "--external:react/*",
        `--outfile=${outputFile}`,
        `--metafile=${metafile}`,
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);

    const metadata = JSON.parse(await readFile(metafile, "utf8"));
    const bundledInputs = Object.values(metadata.outputs)
      .flatMap((output) => Object.entries(output.inputs ?? {}))
      .filter(([, contribution]) => contribution.bytesInOutput > 0)
      .map(([input]) => input);

    assert.equal(bundledInputs.some((input) => input.endsWith("navigation.client.tsx")), false);
    assert.equal(bundledInputs.some((input) => input.includes("@radix-ui/react-tabs")), false);
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});

test("recognizes every hook-shaped code identifier without treating prose as code", () => {
  const unsafeSource = `
    import { useTransition } from "react";
    import { useFormStatus } from "react-dom";
    import { useDirectoryState } from "./use-directory-state";
    const useAño = () => undefined;
    const useÁrea = () => undefined;
    const useA𐐀 = () => undefined;
    const [pending] = useTransition();
  `;
  const harmlessSource = `
    // useMemo is mentioned in a review note.
    const explanation = "useContext and useActionState are not executed here";
  `;

  assert.deepEqual(findHookIdentifiers(unsafeSource), [
    "useAño",
    "useÁrea",
    "useA𐐀",
    "useDirectoryState",
    "useFormStatus",
    "useTransition",
  ]);
  assert.deepEqual(findHookIdentifiers(harmlessSource), []);
});
