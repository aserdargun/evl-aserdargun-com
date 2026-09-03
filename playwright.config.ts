import { defineConfig } from "@playwright/test";

const externalBaseUrl = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:4178",
    browserName: "chromium",
    colorScheme: "dark",
    locale: "en-GB",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  ...(externalBaseUrl
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: "http://127.0.0.1:4178/en",
          reuseExistingServer: false,
          timeout: 30_000,
        },
      }),
});
