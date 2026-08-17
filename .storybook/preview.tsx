import type { Preview } from "@storybook/react-vite";
import { VorealNextRoot } from "../src/next/root";
import { VorealRoot } from "../src/primitives/voreal-root/voreal-root";
import "../src/next/styles.css";
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
    (Story, context) => {
      if (context.title.startsWith("Next/")) {
        return (
          <VorealNextRoot style={{ minHeight: "100vh" }}>
            <Story />
          </VorealNextRoot>
        );
      }

      return (
        <VorealRoot
          style={{
            minHeight: "100vh",
            padding: context.title.startsWith("Patterns/") ? 0 : "clamp(1rem, 4vw, 2rem)",
          }}
          theme={context.globals.theme ?? "red-latina"}
        >
          <Story />
        </VorealRoot>
      );
    },
  ],
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    layout: "fullscreen",
  },
};

export default preview;
