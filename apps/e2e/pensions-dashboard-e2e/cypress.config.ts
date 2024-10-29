import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  pageLoadTimeout: 120000,
  responseTimeout: 120000,
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'src' }),
    baseUrl: 'http://localhost:4200',
  },
});
