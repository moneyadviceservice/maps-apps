import { defineConfig } from 'src/lib/test.lib';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';

import { generateConfig } from '@maps-react/playwright/default-config';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4314';
const projectName = process.env.PROJECT_NAME || 'learning-pathway';
const defaults = generateConfig(projectName);

export default defineConfig({
  timeout: defaults.timeouts.long,
  ...nxE2EPreset(__filename, { testDir: './' }),

  reporter: defaults.config.reporter,
  retries: defaults.config.retries,
  workers: 1,

  use: {
    baseURL,
    userAgent: 'mapsapps',
    javaScriptEnabled: true,
    actionTimeout: defaults.timeouts.medium,
    navigationTimeout: defaults.timeouts.medium,
    video: 'on',
    viewport:
      process.env.MOBILE === 'true'
        ? { width: 375, height: 844 }
        : { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 300,
    },
  },

  // Only start webServer if BASE_URL is not explicitly set (i.e., running locally)
  ...(process.env['BASE_URL']
    ? {}
    : {
        webServer: {
          command: `npx nx run ${projectName}:serve`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          cwd: workspaceRoot,
          stdout: 'pipe',
          stderr: 'pipe',
        },
      }),

  expect: {
    timeout: defaults.timeouts.medium,
  },
});
