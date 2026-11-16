import { config } from 'dotenv';

import { defineConfig } from '@maps-react/playwright/fixtures/default.fixtures';
import * as testmuConfig from '@maps-react/playwright/testmu/config';

import defaultConfig from './playwright.config';

config({ path: '.env.local' });

export default defineConfig({
  ...defaultConfig,

  // Tests take a little longer in TestMu
  timeout: 250_000,

  use: {
    ...defaultConfig.use,

    baseURL: process.env.BASE_URL,
    viewport: { width: 1440, height: 900 },

    // TestMu sometimes needs a delay between steps for stability.
    launchOptions: {
      slowMo: 1500,
    },
  },

  workers: testmuConfig.PARALLEL_RUNNERS,
  retries: 1,

  // Use all 14 target devices.
  projects: testmuConfig.ALL_DEVICES,

  // Don't run the webserver.
  webServer: undefined,
});
