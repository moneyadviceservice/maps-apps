import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { resolve } from 'node:path';
import { defineConfig } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

dotenv.config({ path: resolve(__dirname, '.env.local') });

const targetEnvironments = ['local', 'dev', 'test', 'preprod', 'prod'] as const;
type TargetEnvironment = (typeof targetEnvironments)[number];

const selectedEnvironment = process.env['TARGET_ENV'] || 'local';
if (!targetEnvironments.includes(selectedEnvironment as TargetEnvironment)) {
  throw new Error(
    `Invalid TARGET_ENV "${selectedEnvironment}". Choose one of: ${targetEnvironments.join(
      ', ',
    )}.`,
  );
}

const targetEnvironment = selectedEnvironment as TargetEnvironment;
const environmentBaseURLs: Record<TargetEnvironment, string | undefined> = {
  local: process.env['LOCAL_BASE_URL'] || 'http://localhost:4315',
  dev:
    process.env['DEV_BASE_URL'] ||
    'https://develop--workplace-pension-calculator.netlify.app',
  test: process.env['TEST_BASE_URL'],
  preprod: process.env['PREPROD_BASE_URL'],
  prod:
    process.env['PROD_BASE_URL'] ||
    'https://workplace-pension-calculator.moneyhelper.org.uk',
};

const baseURL =
  process.env['BASE_URL'] || environmentBaseURLs[targetEnvironment];
if (!baseURL) {
  throw new Error(
    `No base URL configured for TARGET_ENV="${targetEnvironment}". Set ${targetEnvironment.toUpperCase()}_BASE_URL in the environment or .env.local.`,
  );
}

const baseURLHost = new URL(baseURL).hostname;
const isLocalBaseURL = ['localhost', '127.0.0.1'].includes(baseURLHost);
const commonTimeout = 100_000;
const projectName = process.env.PROJECT_NAME || 'workplace-pension-calculator';
const reportDir = path.join(
  workspaceRoot,
  `apps/e2e/${projectName}-e2e/playwright-report`,
);

export default defineConfig({
  timeout: commonTimeout,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: process.env.CI ? [['html', { outputFolder: reportDir }]] : 'list',
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },

  webServer: isLocalBaseURL
    ? {
        command: `npx nx run ${projectName}:serve`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        cwd: workspaceRoot,
      }
    : undefined,

  expect: {
    timeout: commonTimeout,
  },
});
