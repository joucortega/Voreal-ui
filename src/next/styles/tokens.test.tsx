import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { VorealNextRoot } from "../root";
import "./tokens.css";

function relativeLuminance(hex: string): number {
  const normalized = hex.length === 4 ? `#${hex.slice(1).split("").map((channel) => channel.repeat(2)).join("")}` : hex;
  const channels = normalized.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (channels === undefined || channels.length !== 3) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`);
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

it("uses an opaque focus ring with at least 3:1 contrast on Next surfaces", () => {
  const { getByTestId } = render(<VorealNextRoot data-testid="next-root" />);
  const styles = getComputedStyle(getByTestId("next-root"));
  const focusRing = styles.getPropertyValue("--vrn-focus-ring").trim();
  const focusColor = styles.getPropertyValue("--vrn-color-focus").trim();

  expect(focusRing).toContain("var(--vrn-color-focus)");

  for (const surface of ["--vrn-color-canvas", "--vrn-color-surface"]) {
    expect(contrastRatio(focusColor, styles.getPropertyValue(surface).trim())).toBeGreaterThanOrEqual(3);
  }
});

it("uses a control boundary with at least 3:1 contrast against the surface", () => {
  const { getByTestId } = render(<VorealNextRoot data-testid="next-root" />);
  const styles = getComputedStyle(getByTestId("next-root"));
  const controlBoundary = styles.getPropertyValue("--vrn-color-text-subtle").trim();
  const surface = styles.getPropertyValue("--vrn-color-surface").trim();

  expect(contrastRatio(controlBoundary, surface)).toBeGreaterThanOrEqual(3);
});

it("keeps inherited labels and portal content in the Voreal sans family", () => {
  const { getByText } = render(
    <>
      <VorealNextRoot><label>Etiqueta del formulario</label></VorealNextRoot>
      <div data-vrn-portal=""><label>Etiqueta del portal</label></div>
    </>,
  );

  for (const label of [getByText("Etiqueta del formulario"), getByText("Etiqueta del portal")]) {
    expect(getComputedStyle(label).fontFamily).toContain("var(--vrn-font-sans)");
    expect(getComputedStyle(label).fontFamily).not.toContain("Times New Roman");
  }
});
