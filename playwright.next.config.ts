import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "next-directory-reference.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  outputDir: "test-results/next-directory",
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
  },
  webServer: {
    command: "python3 -m http.server 6006 --directory storybook-static",
    reuseExistingServer: true,
    url: "http://127.0.0.1:6006/iframe.html",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
