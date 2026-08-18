import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactElement } from "react";
import { NextButton } from "../components/actions";
import { NextField, NextInput, NextSelect } from "../components/forms";
import { NextBadge } from "../components/status";
import { NextGrid, NextHeading, NextSection, NextStack, NextSurface, NextText } from "../foundations";

type ThemeStyle = CSSProperties & Record<`--vrn-${string}`, string>;

const redLatinaTheme: ThemeStyle = {
  "--vrn-color-action": "#b9371e",
  "--vrn-color-action-hover": "#a92f19",
  "--vrn-color-border": "#dfd1bd",
  "--vrn-color-border-strong": "#b9a88e",
  "--vrn-color-canvas": "#fff9ef",
  "--vrn-color-danger": "#a92f19",
  "--vrn-color-danger-soft": "#f9ded5",
  "--vrn-color-focus": "#0b57d0",
  "--vrn-color-info": "#b9371e",
  "--vrn-color-info-soft": "#f9ded5",
  "--vrn-color-ink": "#071b46",
  "--vrn-color-on-action": "#fff",
  "--vrn-color-success": "#217a38",
  "--vrn-color-success-soft": "#ddf8e5",
  "--vrn-color-surface": "#fff",
  "--vrn-color-surface-muted": "#f5ecdf",
  "--vrn-color-surface-raised": "#fff",
  "--vrn-color-text-muted": "#56617a",
  "--vrn-color-text-subtle": "#7f7668",
  "--vrn-color-warning": "#8a5200",
  "--vrn-color-warning-soft": "#fff0c7",
  "--vrn-color-action-active": "#8f2614",
  "--vrn-color-action-soft": "#f9ded5",
};

const tokenGroups = [
  {
    id: "surface-text",
    heading: "Superficies y texto",
    tokens: [
      "--vrn-color-canvas",
      "--vrn-color-surface",
      "--vrn-color-surface-muted",
      "--vrn-color-surface-raised",
      "--vrn-color-ink",
      "--vrn-color-text-muted",
      "--vrn-color-text-subtle",
      "--vrn-color-border",
      "--vrn-color-border-strong",
    ],
  },
  {
    id: "action",
    heading: "Acción",
    tokens: [
      "--vrn-color-action",
      "--vrn-color-action-hover",
      "--vrn-color-action-active",
      "--vrn-color-action-soft",
      "--vrn-color-on-action",
      "--vrn-color-focus",
    ],
  },
  {
    id: "status",
    heading: "Estados",
    tokens: [
      "--vrn-color-success",
      "--vrn-color-success-soft",
      "--vrn-color-warning",
      "--vrn-color-warning-soft",
      "--vrn-color-danger",
      "--vrn-color-danger-soft",
      "--vrn-color-info",
      "--vrn-color-info-soft",
    ],
  },
] as const;

export type ThemeLabContrastPair = {
  id: string;
  foreground: `--vrn-color-${string}`;
  background: `--vrn-color-${string}`;
  kind: "text" | "non-text-boundary";
  minimumContrast: 4.5 | 3;
};

export const themeLabContrastPairs = [
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
] as const satisfies readonly ThemeLabContrastPair[];

const pageStyle: CSSProperties = {
  background: "var(--vrn-color-canvas)",
  minHeight: "100vh",
  paddingBlock: "var(--vrn-space-6)",
};

const fluidGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))",
};

function TokenSample({ token }: { token: string }): ReactElement {
  return (
    <div
      data-vrn-token={token}
      style={{
        alignItems: "center",
        display: "grid",
        gap: "var(--vrn-space-2)",
        gridTemplateColumns: "2.5rem minmax(0, 1fr)",
        minWidth: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: `var(${token})`,
          border: "1px solid var(--vrn-color-border-strong)",
          borderRadius: "var(--vrn-radius-control)",
          height: "2.5rem",
        }}
      />
      <code style={{ fontSize: "var(--vrn-font-size-xs)", overflowWrap: "anywhere" }}>{token}</code>
    </div>
  );
}

function ThemeLab({ redLatina = false }: { redLatina?: boolean }): ReactElement {
  return (
    <main
      data-vrn-theme={redLatina ? "red-latina-example" : undefined}
      style={{ ...pageStyle, ...(redLatina ? redLatinaTheme : {}) }}
    >
      <div className="vrn-container">
        <NextStack gap="6">
          <header>
            <NextStack gap="2">
              <NextBadge tone={redLatina ? "danger" : "neutral"}>
                {redLatina ? "Ejemplo local: Red Latina" : "Tema predeterminado"}
              </NextBadge>
              <NextHeading as="h1" size="page">Theme Lab</NextHeading>
              <NextText tone="muted">
                Revisa la jerarquía, los límites y el contraste antes de adoptar un tema en producto.
              </NextText>
            </NextStack>
          </header>

          <NextGrid columns={3} style={fluidGridStyle}>
            {tokenGroups.map((group) => (
              <NextSection aria-labelledby={`theme-${group.id}`} key={group.id}>
                <NextSurface style={{ height: "100%" }}>
                  <NextStack gap="4">
                    <NextHeading as="h2" id={`theme-${group.id}`} size="card">{group.heading}</NextHeading>
                    {group.tokens.map((token) => <TokenSample key={token} token={token} />)}
                  </NextStack>
                </NextSurface>
              </NextSection>
            ))}
          </NextGrid>

          <NextSection aria-labelledby="theme-controls">
            <NextSurface>
              <NextStack gap="4">
                <NextHeading as="h2" id="theme-controls" size="card">Controles y foco</NextHeading>
                <NextText tone="muted">Usa Tab para revisar el anillo de foco sobre canvas y superficie.</NextText>
                <NextGrid columns={2} style={fluidGridStyle}>
                  <NextField htmlFor="theme-business-name" label="Nombre del negocio" hint="Prueba foco, borde y contenido extenso.">
                    <NextInput defaultValue="Centro Cultural y Mercado Comunitario de Baltimore" />
                  </NextField>
                  <NextField htmlFor="theme-category" label="Categoría">
                    <NextSelect defaultValue="services">
                      <option value="services">Servicios profesionales</option>
                      <option value="food">Alimentos y restaurantes</option>
                    </NextSelect>
                  </NextField>
                </NextGrid>
                <NextText>
                  Este es contenido deliberadamente largo para comprobar wrapping, ritmo vertical y legibilidad cuando una descripción ocupa varias líneas en ventanas estrechas o con texto ampliado.
                </NextText>
                <div><NextButton>Publicar negocio</NextButton></div>
              </NextStack>
            </NextSurface>
          </NextSection>

          <NextSection aria-labelledby="theme-contrast">
            <NextStack gap="3">
              <NextHeading as="h2" id="theme-contrast" size="card">Pares de contraste</NextHeading>
              <NextGrid columns={3} style={fluidGridStyle}>
                {themeLabContrastPairs.map((pair) => (
                  <div
                    data-vrn-contrast-pair={pair.id}
                    key={pair.id}
                    style={{
                      background: `var(${pair.background})`,
                      border: "1px solid var(--vrn-color-border)",
                      borderRadius: "var(--vrn-radius-card)",
                      color: `var(${pair.foreground})`,
                      minHeight: "4.5rem",
                      padding: "var(--vrn-space-3)",
                    }}
                  >
                    <strong>{pair.id}</strong>
                    <div style={{ fontSize: "var(--vrn-font-size-xs)", marginTop: "var(--vrn-space-1)" }}>
                      {pair.foreground} · {pair.background} · {pair.minimumContrast}:1
                    </div>
                  </div>
                ))}
              </NextGrid>
            </NextStack>
          </NextSection>
        </NextStack>
      </div>
    </main>
  );
}

const meta = {
  excludeStories: ["themeLabContrastPairs"],
  title: "Next/Foundations/Theme Lab",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ThemeLab />,
};

export const RedLatinaExample: Story = {
  name: "Red Latina example",
  render: () => <ThemeLab redLatina />,
};
