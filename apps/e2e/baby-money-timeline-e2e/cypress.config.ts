import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run baby-money-timeline:dev',
      },
      ciWebServerCommand: 'npx nx run baby-money-timeline:start',
      ciBaseUrl: 'http://localhost:3000',
    }),
    baseUrl: 'http://127.0.0.1:3000',
  },
});
