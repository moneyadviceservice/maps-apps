import * as path from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';

const netlifyPort = process.env.NETLIFY_PORT || 8888;
const baseURL = process.env['BASE_URL'] ?? `http://localhost:${netlifyPort}`;
const commonTimeout = 180_000;
const projectName = process.env.PROJECT_NAME || 'moneyhelper-contact-forms';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);
const isCI = Boolean(process.env.CI);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),
  // Store reports in a per-app location
  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,
  // Use 1 worker locally for slower machines and to avoid potential issues with parallel tests, but allow multiple workers in CI for faster execution (update locally if you want to speed up and have the resources to run in parallel)
  workers: isCI ? undefined : 1,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },

  webServer: {
    // Use npx to ensure CLI is available, --offline for CI, and explicit port
    command: `npx netlify dev --filter ${projectName} --port=${netlifyPort}`,
    url: baseURL,
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },

  expect: {
    // Use a longer timeout for assertions in CI to account for potential slowness, but keep it short locally for faster feedback
    timeout: isCI ? commonTimeout : 5000,
  },

  projects: [
    /* Test against desktop browsers */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      grepInvert: /@api/,
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
