import playwrightPlugin from 'eslint-plugin-playwright';

import baseConfig from '../../../eslint.config.mjs';
import { configs as mapsPlaywrightConfig } from '../../../libs/shared/utils/src/e2e/playwright/eslint/rules.mjs';
import { getLanguageOptions } from '../../../libs/shared/utils/src/e2e/playwright/eslint/utils.mjs';

export default [
  getLanguageOptions(import.meta.url),

  { ignores: ['**/*.cy.ts'] },

  ...baseConfig,
  ...mapsPlaywrightConfig['ignores'],

  // 4. Maps Custom E2E Standards
  ...mapsPlaywrightConfig['flat/recommended'],

  // 5. Playwright Plugin Rules
  playwrightPlugin.configs['flat/recommended'],
];
