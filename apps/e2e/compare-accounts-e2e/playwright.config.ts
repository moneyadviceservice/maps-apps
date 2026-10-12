import { defineConfig, devices } from '@lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import { generateConfig } from '@maps-react/playwright/default-config';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4337';
const projectName = process.env.PROJECT_NAME || 'compare-accounts';
const defaults = generateConfig(projectName);

export default defineConfig({
  timeout: defaults.timeouts.long,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: defaults.config.reporter,
  retries: defaults.config.retries,

  use: {
    baseURL,
    actionTimeout: defaults.timeouts.medium,
    navigationTimeout: defaults.timeouts.medium,
  },

  webServer: {
    command: `npx nx run ${projectName}:serve`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },

  /**
   * Since this application has responsive design, test on both desktop and mobile.
   */
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 15 Pro'],
        viewport: { width: 402, height: 874 },
      },
      grepInvert: /@ignoreMobile/,
    },
  ],

  expect: {
    timeout: defaults.timeouts.medium,
  },
});
