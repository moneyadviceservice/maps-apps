import { defineConfig } from 'cypress';

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    specPattern: 'src/e2e/*.ts',
    supportFile: 'src/support/e2e.ts',
    setupNodeEvents() {
      // Add events here
    },
  },
});
