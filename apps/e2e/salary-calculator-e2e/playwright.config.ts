import * as path from 'path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';

import { ENV } from './src/e2e/data/environmentVariables';

const baseURL = ENV.BASE_URL;
const commonTimeout = 100_000;
const projectName = 'salary-calculator';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),
  // Store reports in a per-app location
  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },

  // Only start webServer if BASE_URL is not explicitly set (i.e., running locally)
  ...(process.env['BASE_URL']
    ? {}
    : {
        webServer: {
          command: `npx nx run ${projectName}:serve`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          cwd: workspaceRoot,
        },
      }),
  expect: {
    timeout: commonTimeout,
  },
});
