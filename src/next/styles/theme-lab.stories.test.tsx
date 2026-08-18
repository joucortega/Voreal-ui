import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { VorealNextRoot } from "../root";
import "./tokens.css";
import meta, * as themeLabStories from "./theme-lab.stories";

type ExpectedContrastPair = {
  id: string;
  foreground: `--vrn-color-${string}`;
  background: `--vrn-color-${string}`;
  kind: "text" | "non-text-boundary";
  minimumContrast: 4.5 | 3;
};

const expectedSemanticTokens = [
  "--vrn-color-canvas",
  "--vrn-color-surface",
  "--vrn-color-surface-muted",
  "--vrn-color-surface-raised",
  "--vrn-color-ink",
  "--vrn-color-text-muted",
  "--vrn-color-text-subtle",
  "--vrn-color-border",
  "--vrn-color-border-strong",
  "--vrn-color-action",
  "--vrn-color-action-hover",
  "--vrn-color-action-active",
  "--vrn-color-action-soft",
  "--vrn-color-on-action",
  "--vrn-color-focus",
  "--vrn-color-success",
  "--vrn-color-success-soft",
  "--vrn-color-warning",
  "--vrn-color-warning-soft",
  "--vrn-color-danger",
  "--vrn-color-danger-soft",
  "--vrn-color-info",
  "--vrn-color-info-soft",
] as const;

const expectedContrastPairs: readonly ExpectedContrastPair[] = [
  { id: "ink-on-canvas", foreground: "--vrn-color-ink", background: "--vrn-color-canvas", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-surface", foreground: "--vrn-color-ink", background: "--vrn-color-surface", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-surface-muted", foreground: "--vrn-color-ink", background: "--vrn-color-surface-muted", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-action-soft", foreground: "--vrn-color-ink", background: "--vrn-color-action-soft", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-success-soft", foreground: "--vrn-color-ink", background: "--vrn-color-success-soft", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-warning-soft", foreground: "--vrn-color-ink", background: "--vrn-color-warning-soft", kind: "text", minimumContrast: 4.5 },
  { id: "ink-on-danger-soft", foreground: "--vrn-color-ink", background: "--vrn-color-danger-soft", kind: "text", minimumContrast: 4.5 },
  { id: "text-muted-on-canvas", foreground: "--vrn-color-text-muted", background: "--vrn-color-canvas", kind: "text", minimumContrast: 4.5 },
  { id: "text-muted-on-surface", foreground: "--vrn-color-text-muted", background: "--vrn-color-surface", kind: "text", minimumContrast: 4.5 },
  { id: "text-muted-on-surface-muted", foreground: "--vrn-color-text-muted", background: "--vrn-color-surface-muted", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-canvas", foreground: "--vrn-color-action", background: "--vrn-color-canvas", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-surface", foreground: "--vrn-color-action", background: "--vrn-color-surface", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-surface-muted", foreground: "--vrn-color-action", background: "--vrn-color-surface-muted", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-action-soft", foreground: "--vrn-color-action", background: "--vrn-color-action-soft", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-success-soft", foreground: "--vrn-color-action", background: "--vrn-color-success-soft", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-warning-soft", foreground: "--vrn-color-action", background: "--vrn-color-warning-soft", kind: "text", minimumContrast: 4.5 },
  { id: "action-on-danger-soft", foreground: "--vrn-color-action", background: "--vrn-color-danger-soft", kind: "text", minimumContrast: 4.5 },
  { id: "action-hover-on-action-soft", foreground: "--vrn-color-action-hover", background: "--vrn-color-action-soft", kind: "text", minimumContrast: 4.5 },
  { id: "on-action-on-action", foreground: "--vrn-color-on-action", background: "--vrn-color-action", kind: "text", minimumContrast: 4.5 },
  { id: "on-action-on-action-hover", foreground: "--vrn-color-on-action", background: "--vrn-color-action-hover", kind: "text", minimumContrast: 4.5 },
  { id: "success-on-success-soft", foreground: "--vrn-color-success", background: "--vrn-color-success-soft", kind: "text", minimumContrast: 4.5 },
  { id: "warning-on-warning-soft", foreground: "--vrn-color-warning", background: "--vrn-color-warning-soft", kind: "text", minimumContrast: 4.5 },
  { id: "warning-on-canvas", foreground: "--vrn-color-warning", background: "--vrn-color-canvas", kind: "text", minimumContrast: 4.5 },
  { id: "warning-on-surface", foreground: "--vrn-color-warning", background: "--vrn-color-surface", kind: "text", minimumContrast: 4.5 },
  { id: "danger-on-danger-soft", foreground: "--vrn-color-danger", background: "--vrn-color-danger-soft", kind: "text", minimumContrast: 4.5 },
  { id: "danger-on-canvas", foreground: "--vrn-color-danger", background: "--vrn-color-canvas", kind: "text", minimumContrast: 4.5 },
  { id: "danger-on-surface", foreground: "--vrn-color-danger", background: "--vrn-color-surface", kind: "text", minimumContrast: 4.5 },
  { id: "focus-on-canvas", foreground: "--vrn-color-focus", background: "--vrn-color-canvas", kind: "non-text-boundary", minimumContrast: 3 },
  { id: "focus-on-surface", foreground: "--vrn-color-focus", background: "--vrn-color-surface", kind: "non-text-boundary", minimumContrast: 3 },
  { id: "text-subtle-on-surface", foreground: "--vrn-color-text-subtle", background: "--vrn-color-surface", kind: "non-text-boundary", minimumContrast: 3 },
] as const;

const { Default, RedLatinaExample } = themeLabStories;

function colorChannels(color: string): readonly [number, number, number] {
  const value = color.trim();
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/iu)?.[1];
  if (hex) {
    const normalized = hex.length === 3 ? [...hex].map((channel) => channel.repeat(2)).join("") : hex;
    return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16)) as unknown as readonly [number, number, number];
  }

  const rgb = value.match(/^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/iu);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  throw new Error(`Expected an opaque hex or rgb color, received ${color}`);
}

function relativeLuminance(color: string): number {
  const [red, green, blue] = colorChannels(color).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function expectThemeContrast(theme: string, element: Element) {
  const styles = getComputedStyle(element);
  for (const pair of expectedContrastPairs) {
    const ratio = contrastRatio(
      styles.getPropertyValue(pair.foreground),
      styles.getPropertyValue(pair.background),
    );
    expect(ratio, `${theme}: ${pair.id}`).toBeGreaterThanOrEqual(pair.minimumContrast);
  }
}

function renderStory(story: { render?: unknown }) {
  const storyRender = story.render as (() => ReactNode) | undefined;
  if (!storyRender) throw new Error("Theme Lab stories must define an explicit render function.");
  return render(<VorealNextRoot>{storyRender()}</VorealNextRoot>);
}

describe("Voreal Next Theme Lab stories", () => {
  it("publishes the default token, control, focus, long-content, and contrast review contract", () => {
    const { container } = renderStory(Default);

    expect(meta.title).toBe("Next/Foundations/Theme Lab");
    expect(container.querySelector('[data-vrn-theme="red-latina-example"]')).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Superficies y texto" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Acción" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Estados" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Controles y foco" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pares de contraste" })).toBeInTheDocument();
    expect(screen.getByText(/contenido deliberadamente largo/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Nombre del negocio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publicar negocio" })).toBeInTheDocument();
    expect([...container.querySelectorAll("[data-vrn-token]")].map((element) => element.getAttribute("data-vrn-token")))
      .toEqual(expectedSemanticTokens);
    expect([...container.querySelectorAll("[data-vrn-contrast-pair]")].map((element) => element.getAttribute("data-vrn-contrast-pair")))
      .toEqual(expectedContrastPairs.map((pair) => pair.id));
  });

  it("exports the exact semantic contrast contract rendered by Theme Lab", () => {
    const contract = (themeLabStories as unknown as { themeLabContrastPairs?: readonly ExpectedContrastPair[] })
      .themeLabContrastPairs;

    expect(contract).toEqual(expectedContrastPairs);
  });

  it("meets the exact contrast contract in the default and local Red Latina themes", () => {
    const defaultStory = renderStory(Default);
    const defaultRoot = defaultStory.container.querySelector('[data-voreal-ui="next"]');
    expect(defaultRoot).toBeInTheDocument();
    expectThemeContrast("default", defaultRoot!);
    defaultStory.unmount();

    const redLatinaStory = renderStory(RedLatinaExample);
    const redLatinaExample = redLatinaStory.container.querySelector('[data-vrn-theme="red-latina-example"]');
    expect(redLatinaExample).toBeInTheDocument();
    expectThemeContrast("red-latina-example", redLatinaExample!);
  });

  it("keeps Red Latina as a story-local variable example", () => {
    const { container } = renderStory(RedLatinaExample);
    const example = container.querySelector<HTMLElement>('[data-vrn-theme="red-latina-example"]');

    expect(example).toBeInTheDocument();
    expect(example?.style.getPropertyValue("--vrn-color-action")).toBe("#b9371e");
    expect(example?.style.getPropertyValue("--vrn-color-surface")).toBe("#fff");
    expect(screen.getByText("Ejemplo local: Red Latina")).toBeInTheDocument();
  });
});
