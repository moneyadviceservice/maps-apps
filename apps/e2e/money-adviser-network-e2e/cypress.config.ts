import { defineConfig } from 'cypress';

import { e2eNodeEvents } from './cypress/support/setupNodeEvents';

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  pageLoadTimeout: 120000,
  responseTimeout: 240000,
  defaultCommandTimeout: 120000,
  retries: 3,
  e2e: {
    specPattern: 'src/e2e/*.ts',
    supportFile: 'src/support/e2e.ts',
    baseUrl: 'http://localhost:4301',
    env: {
      APPOINTMENTS_API: 'http://localhost:9000/',
    },
    setupNodeEvents: e2eNodeEvents,
    experimentalInteractiveRunEvents: true,
  },
});
