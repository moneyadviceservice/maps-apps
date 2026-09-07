import { defineConfig } from 'cypress';

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
    setupNodeEvents() {
      //Add events here
    },
  },
});
