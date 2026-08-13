import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          css: true,
          restoreMocks: true,
        },
      },
      {
        extends: true,
        test: {
          name: "a11y",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          css: true,
          restoreMocks: true,
        },
      },
    ],
  },
});
