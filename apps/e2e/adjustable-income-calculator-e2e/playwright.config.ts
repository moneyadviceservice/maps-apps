import * as path from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4321';
const commonTimeout = 100_000;
const projectName = process.env.PROJECT_NAME || 'adjustable-income-calculator';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './src/e2e/tests' }),
  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,
  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },
  webServer: {
    command: `npx nx run ${projectName}:serve --port=4321`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  expect: {
    timeout: commonTimeout,
  },
});
