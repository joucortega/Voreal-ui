import assert from "node:assert/strict";
import test from "node:test";
import {
  isNativeControlAppearanceVisible,
  parseCssColorAlpha,
} from "../e2e/native-control-visibility.ts";

test("parses transparent alpha across legacy and modern computed CSS colors", () => {
  for (const color of [
    "transparent",
    "rgba(11, 31, 58, 0)",
    "rgb(11 31 58 / 0)",
    "hsl(210 50% 20% / 0%)",
    "color(srgb 0.1 0.2 0.3 / 0)",
    "#0b1f3a00",
    "#abc0",
  ]) {
    assert.equal(parseCssColorAlpha(color), 0, color);
  }

  assert.equal(parseCssColorAlpha("rgba(11, 31, 58, 0.5)"), 0.5);
  assert.equal(parseCssColorAlpha("rgb(11 31 58 / 25%)"), 0.25);
  assert.equal(parseCssColorAlpha("#0b1f3a80"), 128 / 255);
  assert.equal(parseCssColorAlpha("CanvasText"), 1);
  assert.equal(parseCssColorAlpha("rgb(11, 31, 58)"), 1);
});

test("rejects hidden, transparent, zero-opacity, and zero-geometry native appearances", () => {
  const visible = {
    box: { height: 44, width: 180 },
    hidden: false,
    style: { color: "rgb(11 31 58)", display: "block", opacity: "1", visibility: "visible" },
  };

  assert.equal(isNativeControlAppearanceVisible(visible), true);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, hidden: true }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, box: { height: 0, width: 180 } }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, style: { ...visible.style, display: "none" } }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, style: { ...visible.style, visibility: "hidden" } }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, style: { ...visible.style, opacity: "0" } }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, style: { ...visible.style, color: "rgba(0, 0, 0, 0)" } }), false);
  assert.equal(isNativeControlAppearanceVisible({ ...visible, style: { ...visible.style, color: "rgb(0 0 0 / 0%)" } }), false);
});
