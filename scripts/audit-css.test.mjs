import assert from "node:assert/strict";
import test from "node:test";
import { findViolations, isPaletteAllowlisted } from "./audit-css.mjs";
import { evaluateBudget, measureCss } from "./check-css-budget.mjs";

test("detects collision-prone CSS and arbitrary brand colors", () => {
  const source = ".legacy { color: #c83b20 !important; z-index: 999; }\n<div className=\"bg-[#fff9ef]\" />";
  const ids = findViolations(source).map((violation) => violation.id);

  assert.deepEqual(ids, ["raw-brand-color", "important", "arbitrary-color", "raw-z-index"]);
});

test("allows raw palette values only in token and theme files", () => {
  assert.equal(isPaletteAllowlisted("src/themes/red-latina.css"), true);
  assert.equal(isPaletteAllowlisted("src/tokens/tokens.test.tsx"), true);
  assert.equal(isPaletteAllowlisted("src/components/card.css"), false);
});

test("measures UTF-8 and gzip bytes against an explicit budget", () => {
  const measurement = measureCss(".vr-card { color: var(--vr-text); }\n".repeat(100));
  assert.ok(measurement.rawBytes > measurement.gzipBytes);
  assert.equal(evaluateBudget({ ...measurement, budgetBytes: measurement.gzipBytes }).ok, true);
  assert.equal(evaluateBudget({ ...measurement, budgetBytes: measurement.gzipBytes - 1 }).ok, false);
});
