import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { auditNextCss, findNextCssViolations } from "./audit-next-css.mjs";

test("accepts isolated selectors, variables, layer tokens, and scoped reset selectors", () => {
  const source = `
.vrn-button { color: var(--vrn-color-ink); z-index: var(--vrn-layer-raised); }
[data-voreal-ui="next"] button,
[data-vrn-portal] :where(input, select, a, h2, *) { font: inherit; }
.vrn-card > a,
button.vrn-button { color: inherit; }
@media (min-width: 48rem) { .vrn-card { display: grid; } }
`;

  assert.deepEqual(findNextCssViolations(source, "button.css"), []);
});

test("reports legacy names, important declarations, and numeric z-index with positions", () => {
  const source = `/* harmless .vr-old { z-index: 99 !important; } */
.vr-button { color: var(--vr-color-ink) !important; }
.vrn-dialog { z-index: 999; }
`;
  const violations = findNextCssViolations(source, "bad.css");

  assert.deepEqual(violations.map(({ id }) => id), [
    "legacy-class",
    "legacy-variable",
    "important",
    "raw-z-index",
  ]);
  assert.deepEqual(
    violations.map(({ file, line, column }) => ({ file, line, column })),
    [
      { file: "bad.css", line: 2, column: 1 },
      { file: "bad.css", line: 2, column: 25 },
      { file: "bad.css", line: 2, column: 41 },
      { file: "bad.css", line: 3, column: 15 },
    ],
  );
});

test("rejects unscoped global and bare element selectors, including nested at-rules", () => {
  const source = `
:root { --vrn-x: 1; }
body .vrn-shell { margin: 0; }
.host button, input:hover, :is(select, a), h1, * { color: red; }
@supports (display: grid) { @media (width > 20rem) { button { display: grid; } } }
`;
  const violations = findNextCssViolations(source, "globals.css");

  assert.equal(violations.length, 9);
  assert.ok(violations.every(({ id }) => id === "global-selector"));
  assert.deepEqual(violations.map(({ match }) => match), [
    ":root",
    "body",
    "button",
    "input",
    "select",
    "a",
    "h1",
    "*",
    "button",
  ]);
});

test("does not inspect comments, strings, attribute values, or at-rule conditions as selectors", () => {
  const source = `
/* button { z-index: 999 !important; color: var(--vr-old); } */
.vrn-copy::before { content: "button { z-index: 999 !important; .vr-old }"; }
.vrn-copy[data-kind=button] { content: ':root'; }
@supports selector(:has(*)) { .vrn-copy { display: block; } }
`;

  assert.deepEqual(findNextCssViolations(source, "safe.css"), []);
});

test("does not let a scoped sibling branch hide a global selector", () => {
  const violations = findNextCssViolations(":is(.vrn-button, button) { color: inherit; }", "branches.css");
  assert.deepEqual(violations.map(({ id, match }) => ({ id, match })), [
    { id: "global-selector", match: "button" },
  ]);
  assert.deepEqual(findNextCssViolations('[data-voreal-ui="next"] :is(button, a) {}', "branches.css"), []);
});

test("parses type-selector pseudos, functional pseudos, lists, and nesting", () => {
  const unsafe = `
button:hover, html:lang(es), :is(.vrn-button, input:focus) { color: inherit; }
.host { & select:hover { color: inherit; } }
:where(.vrn-a, .host) { button { color: inherit; } }
button:where(.vrn-a, .host) { color: inherit; }
`;
  assert.deepEqual(findNextCssViolations(unsafe, "selectors.css").map(({ match }) => match), [
    "button",
    "html",
    "input",
    "select",
    "button",
    "button",
  ]);

  const safe = `
:where(button).vrn-button { color: inherit; }
.vrn-shell { & button:hover, & :is(input, select) { color: inherit; } }
:where(.vrn-shell) { & button:hover { color: inherit; } }
:is(.vrn-a, .vrn-b) { input { color: inherit; } }
button:where(.vrn-a) { color: inherit; }
`;
  assert.deepEqual(findNextCssViolations(safe, "selectors.css"), []);
});

test("finds z-index declarations after nested rules and escaped properties", () => {
  const source = `.vrn-a {
  & .vrn-b { display: block; }
  z-index: 999;
  z\\2d index: calc(100);
}`;
  assert.deepEqual(findNextCssViolations(source, "nested-z.css").map(({ id, line }) => ({ id, line })), [
    { id: "raw-z-index", line: 3 },
    { id: "raw-z-index", line: 4 },
  ]);
});

test("normalizes CSS casing and escapes and only permits named z-index layers", () => {
  const source = `
.vr\\-legacy { color: red !IMPORTANT; }
.vrn-a { Z-INDEX: 1e3; }
.vrn-b { z-index: calc(100); }
.vrn-c { z-index: var(--vrn-space-2); }
.vrn-global { z-index: inherit; }
.vrn-escaped { z\\-index: 2 !\\49MPORTANT; }
.vrn-d { z-index: auto; }
.vrn-e { z-index: var(--vrn-layer-modal); }
`;
  assert.deepEqual(findNextCssViolations(source, "evasion.css").map(({ id }) => id), [
    "legacy-class",
    "important",
    "important",
    "raw-z-index",
    "raw-z-index",
    "raw-z-index",
    "raw-z-index",
    "raw-z-index",
  ]);

  assert.equal(findNextCssViolations("B\\75tton:hover { color: red; }", "escape.css")[0].id, "global-selector");
  assert.equal(findNextCssViolations(".vrn-x { color: var(--vr\\-legacy); }", "escape.css")[0].id, "legacy-variable");
});

test("validates the single Voreal Next layer declaration and layered imports", () => {
  const valid = `
@layer vrn-reset, vrn-tokens, vrn-components, vrn-patterns, vrn-utilities;
@import "./styles/reset.css" layer(vrn-reset);
@import "./styles/tokens.css" layer(vrn-tokens);
`;
  assert.deepEqual(findNextCssViolations(valid, "src/next/styles.css"), []);

  const invalid = `
@layer vrn-tokens, vrn-reset, vrn-components, vrn-patterns, vrn-utilities;
@import "./styles/reset.css";
`;
  assert.deepEqual(
    findNextCssViolations(invalid, "src/next/styles.css").map(({ id }) => id),
    ["layer-order", "layer-order"],
  );
});

test("matches the minimum contract examples", () => {
  assert.deepEqual(findNextCssViolations(".vrn-button { color: var(--vrn-color-ink); }", "button.css"), []);
  assert.equal(findNextCssViolations(".vr-button {}", "bad.css")[0].id, "legacy-class");
  assert.equal(findNextCssViolations(":root { --vrn-x: 1; }", "bad.css")[0].id, "global-selector");
  assert.equal(findNextCssViolations("button { color: red; }", "bad.css")[0].id, "global-selector");
  assert.equal(findNextCssViolations(".vrn-dialog { z-index: 999; }", "bad.css")[0].id, "raw-z-index");
  assert.deepEqual(findNextCssViolations('[data-voreal-ui="next"] button { font: inherit; }', "reset.css"), []);
  assert.deepEqual(findNextCssViolations("[data-vrn-portal] button { font: inherit; }", "reset.css"), []);
});

test("rejects raw declaration colors outside the token inventory", () => {
  const source = `.vrn-button {
  color: #0f5bde;
  background: rgb(11 31 58 / 42%);
  border-color: hsl(214 87% 46%);
  content: "#not-a-color";
}`;

  assert.deepEqual(
    findNextCssViolations(source, "src/next/components/actions/actions.css").map(({ id, match }) => ({ id, match })),
    [
      { id: "raw-color", match: "#0f5bde" },
      { id: "raw-color", match: "rgb(11 31 58 / 42%)" },
      { id: "raw-color", match: "hsl(214 87% 46%)" },
    ],
  );
});

test("ignores hex-shaped unquoted URL fragments while rejecting declaration colors", () => {
  const source = `.vrn-icon { background: url(icon.svg#face); color: #0f5bde; }`;

  assert.deepEqual(
    findNextCssViolations(source, "src/next/components/actions/actions.css").map(({ id, match }) => ({ id, match })),
    [{ id: "raw-color", match: "#0f5bde" }],
  );
});

test("permits raw token values and ignores comments and strings", () => {
  const source = `/* #0f5bde rgb(11 31 58 / 42%) hsl(214 87% 46%) */
.vrn-copy::before { content: "#0f5bde rgb(11 31 58 / 42%) hsl(214 87% 46%)"; }
:where([data-voreal-ui="next"]) { --vrn-color-action: #0f5bde; --vrn-color-overlay-scrim: rgb(11 31 58 / 42%); }`;

  assert.deepEqual(findNextCssViolations(source, "src/next/styles/tokens.css"), []);
});

test("the filesystem audit rejects CSS omitted from the layered entry point", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-next-css-audit-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "styles"), { recursive: true });
  await writeFile(
    path.join(root, "styles.css"),
    '@layer vrn-reset, vrn-tokens, vrn-components, vrn-patterns, vrn-utilities;\n@import "./styles/reset.css" layer(vrn-reset);\n',
  );
  await writeFile(path.join(root, "styles", "reset.css"), '[data-voreal-ui="next"] * { box-sizing: border-box; }\n');
  await writeFile(path.join(root, "orphan.css"), ".vrn-orphan { display: block; }\n");

  const { findings } = await auditNextCss(root);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].id, "layer-order");
  assert.equal(findings[0].match, "not imported by src/next/styles.css");
});

test("the filesystem audit resolves quoted and unquoted url imports and blocks escapes", async (t) => {
  const project = await mkdtemp(path.join(tmpdir(), "voreal-next-css-url-"));
  t.after(() => rm(project, { recursive: true, force: true }));
  const root = path.join(project, "src", "next");
  await mkdir(path.join(root, "styles"), { recursive: true });
  await mkdir(path.join(project, "src", "legacy"), { recursive: true });
  await writeFile(path.join(root, "styles", "reset.css"), '[data-voreal-ui="next"] * {}\n');
  await writeFile(path.join(project, "src", "legacy", "escape.css"), ".vrn-external {}\n");
  await writeFile(
    path.join(root, "styles.css"),
    `@layer vrn-reset, vrn-tokens, vrn-components, vrn-patterns, vrn-utilities;
@import url("./styles/reset.css") layer(vrn-reset);
@import url(../legacy/escape.css) layer(vrn-components);
`,
  );

  const { findings } = await auditNextCss(root);
  assert.equal(findings.some(({ id, match }) => id === "layer-order" && match === "../legacy/escape.css"), true);
});
