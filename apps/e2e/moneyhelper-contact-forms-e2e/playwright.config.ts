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
  reporter: isCI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,
  workers: isCI ? undefined : 1,

  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },

  webServer: {
    command: isCI
      ? `netlify dev --filter ${projectName} --port=${netlifyPort}`
      : `npx dotenv -e apps/e2e/${projectName}-e2e/.env.local -e apps/${projectName}/.env.local -- netlify dev --filter ${projectName} --port=${netlifyPort}`,
    url: baseURL,
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    // Pipe output to console locally for easier debugging, but use default (inherit) in CI to avoid cluttering logs
    stdout: isCI ? undefined : 'pipe',
  },

  globalSetup: require.resolve('./src/e2e/global-setup'),
  globalTeardown: require.resolve('./src/e2e/global-teardown'),

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
