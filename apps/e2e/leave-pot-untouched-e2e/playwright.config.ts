import { defineConfig } from 'lib/test.lib';
import * as path from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4322';
const commonTimeout = 30000;
const projectName = process.env.PROJECT_NAME || 'leave-pot-untouched';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './src/tests' }),

  reporter: [
    [
      'html',
      {
        outputFolder: reportDir,
        open: 'on-failure',
      },
    ],
    ['list'],
  ],

  retries: 1,

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
