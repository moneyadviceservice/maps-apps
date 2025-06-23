import { defineConfig } from 'cypress';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  userAgent: 'Mozilla/5.0/Cypress/MaPS',
  pageLoadTimeout: 120000,
  responseTimeout: 240000,
  defaultCommandTimeout: 120000,
  retries: 3,
  e2e: {
    specPattern: 'src/e2e/*.ts',
    supportFile: 'src/support/e2e.ts',
    setupNodeEvents(on) {
      on(
        'before:browser:launch',
        (browser = Cypress.browser, launchOptions) => {
          prepareAudit(launchOptions);
        },
      );

      on('task', {
        lighthouse: lighthouse(),
      });
    },
  },
});
