import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVoreal } from "../testing/render-voreal";
// JSDOM does not evaluate cascade-layer imports, so the unit contract loads
// the theme source directly. Browser and build gates exercise index.css.
import "../themes/red-latina.css";

it("exposes Red Latina semantic colors", () => {
  renderVoreal(<span>Texto</span>, { theme: "red-latina" });

  const root = screen.getByTestId("voreal-root");
  const styles = getComputedStyle(root);

  expect(styles.getPropertyValue("--vr-canvas").trim()).toBe("#fff9ef");
  expect(styles.getPropertyValue("--vr-text").trim()).toBe("#071b46");
  expect(styles.getPropertyValue("--vr-action").trim()).toBe("#c83b20");
});
