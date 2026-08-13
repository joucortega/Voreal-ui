import type { Preview } from "@storybook/react-vite";
import { VorealRoot } from "../src/primitives/voreal-root/voreal-root";
import "../src/styles/index.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <VorealRoot style={{ minHeight: "100vh", padding: "2rem" }} theme="red-latina">
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
