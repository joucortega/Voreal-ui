import type { Meta, StoryObj } from "@storybook/react-vite";
import "../styles/index.css";

type TokenPreviewProps = {
  density: "comfortable" | "compact";
  theme: "mercado-nocturno" | "neutral" | "red-latina";
};

function TokenPreview({ density, theme }: TokenPreviewProps) {
  const colors = ["canvas", "surface", "surface-muted", "text", "action", "accent", "success"];

  return (
    <div className="vr-root" data-vr-root="" data-vr-density={density} data-vr-theme={theme}>
      <div style={{ display: "grid", gap: "var(--vr-space-4)", padding: "var(--vr-space-6)" }}>
        <h1>Voreal UI tokens</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: "var(--vr-space-3)" }}>
          {colors.map((color) => (
            <div
              key={color}
              style={{
                minHeight: "6rem",
                padding: "var(--vr-space-3)",
                color: color === "text" ? "var(--vr-canvas)" : "var(--vr-text)",
                background: `var(--vr-${color})`,
                border: "1px solid var(--vr-border)",
                borderRadius: "var(--vr-radius-card)",
              }}
            >
              --vr-{color}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  component: TokenPreview,
  args: {
    density: "comfortable",
    theme: "red-latina",
  },
  argTypes: {
    density: { control: "inline-radio", options: ["comfortable", "compact"] },
    theme: { control: "inline-radio", options: ["neutral", "red-latina", "mercado-nocturno"] },
  },
} satisfies Meta<typeof TokenPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RedLatina: Story = {};

export const Neutral: Story = {
  args: { theme: "neutral" },
};

export const MercadoNocturno: Story = {
  args: { theme: "mercado-nocturno" },
};

export const AdminDensity: Story = {
  args: { density: "compact" },
};
