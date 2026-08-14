import type { Preview } from "@storybook/react-vite";
import { VorealRoot } from "../src/primitives/voreal-root/voreal-root";
import "../src/styles/index.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema visual de Voreal UI",
      toolbar: {
        icon: "paintbrush",
        items: [
          { title: "Red Latina", value: "red-latina" },
          { title: "Mercado Nocturno", value: "mercado-nocturno" },
          { title: "Neutral", value: "neutral" },
        ],
      },
    },
  },
  initialGlobals: { theme: "red-latina" },
  decorators: [
    (Story, context) => (
      <VorealRoot
        style={{
          minHeight: "100vh",
          padding: context.title.startsWith("Patterns/") ? 0 : "clamp(1rem, 4vw, 2rem)",
        }}
        theme={context.globals.theme ?? "red-latina"}
      >
        <Story />
      </VorealRoot>
    ),
  ],
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    layout: "fullscreen",
  },
};

export default preview;
