import * as path from 'node:path';
import { ENV, envConfig } from '@mhbf-e2e/lib/env.lib';
import { defineConfig, devices } from '@mhbf-e2e/lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

const isCI = envConfig.isCI;
const netlifyPort = ENV.NETLIFY_PORT || 8888;
const baseURL = envConfig.baseURL;
const commonTimeout = 180_000;
const projectName = ENV.PROJECT_NAME || 'moneyhelper-booking-forms';

const appE2EDir = path.join(workspaceRoot, `apps/e2e/${projectName}-e2e`);
const reportDir = path.join(appE2EDir, 'playwright-report');

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),

  // Store reports in a per-app location
  reporter: isCI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: isCI ? 2 : 0,

  /* Shared settings for all the projects below */
  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
  },

  webServer: {
    command: isCI
      ? `netlify dev --filter ${projectName} --port=${netlifyPort}`
      : `npx dotenv -e ${appE2EDir}/.env.local -e apps/${projectName}/.env.local -- netlify dev --filter ${projectName} --port=${netlifyPort}`,
    url: baseURL,
    timeout: 300_000,
    reuseExistingServer: !isCI,
    cwd: workspaceRoot,
    // Pipe output to console locally for easier debugging, but use default (inherit) in CI to avoid cluttering logs
    stdout: isCI ? undefined : 'pipe',
    stderr: 'pipe',
  },

  globalSetup: path.resolve(__dirname, './src/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, './src/global-teardown.ts'),

  expect: {
    timeout: isCI ? commonTimeout : 5000,
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      grepInvert: /@api/,
    },
  ],
});
