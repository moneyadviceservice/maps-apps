import * as path from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';

import { ENV } from './src/lib/env.lib';

const commonTimeout = 10_000;
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${ENV.PROJECT_NAME}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),
  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: 2,
  use: {
    baseURL: ENV.BASE_URL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: `netlify dev --filter ${ENV.PROJECT_NAME}`,
    url: ENV.BASE_URL,
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  expect: {
    timeout: commonTimeout,
  },
});
