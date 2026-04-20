import * as path from 'path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';

const baseURL = process.env['BASE_URL'] || 'http://localhost:8888';
const commonTimeout = 10_000;
const projectName = process.env.PROJECT_NAME || 'standard-financial-statement';
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

  webServer: {
    command: `netlify dev --filter ${projectName}`,
    url: baseURL,
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  expect: {
    timeout: commonTimeout,
  },
});
