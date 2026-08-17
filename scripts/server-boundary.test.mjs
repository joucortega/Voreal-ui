import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createScanner, LanguageVariant, SyntaxKind } from "typescript/unstable/ast";

const serverFiles = [
  "src/patterns/directory/search/directory-search-form.tsx",
  "src/patterns/directory/search/directory-search-state.ts",
  "src/patterns/directory/search/directory-search.types.ts",
];

const nextServerFiles = [
  "src/next/patterns/directory/directory-business-card.tsx",
  "src/next/patterns/directory/directory-layout.tsx",
  "src/next/patterns/directory/directory-media.tsx",
  "src/next/patterns/directory/directory-pagination.tsx",
  "src/next/patterns/directory/directory-search-form.tsx",
  "src/next/patterns/directory/directory-states.tsx",
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

test("keeps Voreal Next directory search server-safe and isolated", async () => {
  for (const file of nextServerFiles) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /^\s*["']use client["']/mu, file);
    assert.doesNotMatch(source, /@radix-ui/u, file);
    assert.deepEqual(findHookIdentifiers(source), [], file);
    assert.doesNotMatch(source, /src\/(?:components|patterns|primitives)|\.\.\/\.\.\/\.\.\/(?:components|patterns|primitives)/u, file);
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
