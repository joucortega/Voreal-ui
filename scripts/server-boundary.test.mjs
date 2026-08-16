import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverFiles = [
  "src/patterns/directory/search/directory-search-form.tsx",
  "src/patterns/directory/search/directory-search-state.ts",
  "src/patterns/directory/search/directory-search.types.ts",
];

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
