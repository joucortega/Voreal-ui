import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults, defineConfig } from "vitest/config";

const testExclude = [...configDefaults.exclude, "e2e/**"];

export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          exclude: testExclude,
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
          exclude: testExclude,
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          css: true,
          restoreMocks: true,
        },
      },
    ],
  },
});
