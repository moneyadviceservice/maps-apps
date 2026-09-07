import { defineConfig } from 'src/lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import { generateConfig } from '@maps-react/playwright/default-config';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4350';
const projectName = process.env.PROJECT_NAME || 'money-adviser-network';
const defaults = generateConfig(projectName);

export default defineConfig({
  timeout: defaults.timeouts.long,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: defaults.config.reporter,
  retries: defaults.config.retries,

  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: defaults.timeouts.medium,
    navigationTimeout: defaults.timeouts.medium,
  },

  globalSetup: require.resolve('./src/global-setup'),
  globalTeardown: require.resolve('./src/global-teardown'),

  webServer: {
    command: `npx nx run ${projectName}:serve`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    stdout: 'pipe',
    env: {
      NETLIFY_RATE_LIMIT: '150',
    },
  },

  expect: {
    timeout: defaults.timeouts.medium,
  },
});
