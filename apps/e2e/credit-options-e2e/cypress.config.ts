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
      // Add events here
    },
  },
});

/**
 import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run credit-options:dev',
      },
      ciWebServerCommand: 'npx nx run credit-options:start',
      ciBaseUrl: 'http://localhost:3000',
    }),
    baseUrl: 'http://127.0.0.1:3000',
  },
});
 **/
