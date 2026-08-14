import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVoreal } from "../testing/render-voreal";
// JSDOM does not evaluate cascade-layer imports, so the unit contract loads
// the theme source directly. Browser and build gates exercise index.css.
import "../themes/red-latina.css";
import "../themes/mercado-nocturno.css";

it("exposes Red Latina semantic colors", () => {
  renderVoreal(<span>Texto</span>, { theme: "red-latina" });

  const root = screen.getByTestId("voreal-root");
  const styles = getComputedStyle(root);

  expect(styles.getPropertyValue("--vr-canvas").trim()).toBe("#fff9ef");
  expect(styles.getPropertyValue("--vr-text").trim()).toBe("#071b46");
  expect(styles.getPropertyValue("--vr-action").trim()).toBe("#c83b20");
});

it("exposes the Mercado Nocturno semantic palette", () => {
  renderVoreal(<span>Texto</span>, { theme: "mercado-nocturno" });

  const styles = getComputedStyle(screen.getByTestId("voreal-root"));
  expect(styles.getPropertyValue("--vr-canvas").trim()).toBe("#07152e");
  expect(styles.getPropertyValue("--vr-text").trim()).toBe("#fff6e8");
  expect(styles.getPropertyValue("--vr-action").trim()).toBe("#ff8066");
});
