import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import { generateConfig } from '@maps-react/playwright/default-config';

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
  local: process.env['LOCAL_BASE_URL'] || 'http://localhost:4303',
  dev:
    process.env['DEV_BASE_URL'] ||
    'https://develop--pension-type-tool.netlify.app',
  test: process.env['TEST_BASE_URL'],
  preprod: process.env['PREPROD_BASE_URL'],
  prod:
    process.env['PROD_BASE_URL'] ||
    'https://pension-type-tool.moneyhelper.org.uk',
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
const projectName = process.env.PROJECT_NAME || 'pension-type-tool';
const defaults = generateConfig(projectName);

export default defineConfig({
  timeout: defaults.timeouts.medium,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: defaults.config.reporter,
  retries: defaults.config.retries,

  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: defaults.timeouts.medium,
    navigationTimeout: defaults.timeouts.medium,
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
    timeout: defaults.timeouts.medium,
  },
});
