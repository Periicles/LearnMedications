import { defineConfig, devices } from "@playwright/test";
import { BASE_URL, E2E_PORT, loadTestEnv, storageFile } from "./e2e/support/env";

loadTestEnv();

/**
 * iPhone and iPad profiles use WebKit, like Safari. Set E2E_MOBILE_ENGINE=chromium on machines
 * where WebKit system libraries are missing: sizes, touch and user agent are still emulated.
 */
const useChromium = process.env.E2E_MOBILE_ENGINE === "chromium";
const DEVICE_NAMES = [
  "iPhone 12 Mini",
  "iPhone 16",
  "iPhone 16 Pro",
  "iPad Pro 11",
  "Desktop Chrome",
  "Desktop Firefox",
  "Desktop Safari",
];

function deviceOptions(deviceName: string) {
  const device = devices[deviceName];
  const isApple = device.defaultBrowserType === "webkit";
  return isApple && useChromium ? { ...device, defaultBrowserType: "chromium" as const } : device;
}

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.results",
  fullyParallel: false,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: { baseURL: BASE_URL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: `npm run build && npm run start -- --port ${E2E_PORT}`,
    url: BASE_URL,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "setup", testMatch: /users\.setup\.ts/, teardown: "cleanup" },
    { name: "cleanup", testMatch: /users\.teardown\.ts/ },
    ...DEVICE_NAMES.map((deviceName) => ({
      name: deviceName,
      dependencies: ["setup"],
      testMatch: /.*\.spec\.ts/,
      use: { ...deviceOptions(deviceName), storageState: storageFile(deviceName) },
    })),
  ],
});
