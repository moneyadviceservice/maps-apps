import * as path from 'node:path';
import { defineConfig } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4305';
const commonTimeout = 25_000;
const projectName = process.env.PROJECT_NAME || 'take-whole-pot';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,

  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },

  webServer: {
    command: `npx nx run ${projectName}:serve`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },

  expect: {
    timeout: commonTimeout,
  },
});
