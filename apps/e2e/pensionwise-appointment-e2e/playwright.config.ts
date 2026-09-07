import * as path from 'node:path';
import { defineConfig } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4250';
const commonTimeout = process.env.CI ? 100_000 : 12_000;
const projectName = process.env.PROJECT_NAME || 'pensionwise-appointment';
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
    // Use nx serve so Next runs with webpack (nx.json webpack: true).
    // Plain `next dev` uses Turbopack and cannot resolve the @maps-public alias.
    command: `npx nx run ${projectName}:serve`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    timeout: 120000,
  },

  expect: {
    timeout: commonTimeout,
  },
});
