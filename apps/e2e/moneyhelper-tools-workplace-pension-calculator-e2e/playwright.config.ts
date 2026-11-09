import { defineConfig } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import { generateConfig } from '@maps-react/playwright/default-config';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4300';
const projectName = process.env.PROJECT_NAME || 'tools-index';
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

  /**
   * The application under test in this framework does not match the folder name.
   */
  webServer: {
    command: `npx nx run moneyhelper-tools:serve`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },

  expect: {
    timeout: defaults.timeouts.medium,
  },
});
