import * as path from 'node:path';
import { ENV } from '@env';
import { defineConfig } from '@maps/playwright';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

const resolveE2EPath = (relativePath: string) =>
  path.join(workspaceRoot, `apps/e2e/${projectName}-e2e/${relativePath}`);

const commonTimeout = 100_000;
const baseURL = ENV.BASE_URL;

const projectName = process.env['PROJECT_NAME'] || 'pensions-dashboard';
const reportDir = resolveE2EPath('playwright-report');
const testDir = resolveE2EPath('src/e2e/regression-tests');

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir }),

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
