import importPlugin from 'eslint-plugin-import';
import playwrightPlugin from 'eslint-plugin-playwright';

import baseConfig from '../../../eslint.config.mjs';
import { configs as mapsPlaywrightConfig } from '../../../libs/shared/utils/src/e2e/playwright/eslint/rules.mjs';
import { getLanguageOptions } from '../../../libs/shared/utils/src/e2e/playwright/eslint/utils.mjs';

export default [
  // 1. Language and parser options
  getLanguageOptions(import.meta.url),

  // 2. Global Ignores & Base ESLint Config
  ...baseConfig,
  ...mapsPlaywrightConfig['ignores'],

  // 3. Custom E2E Standards & Playwright Recommended Rules
  ...mapsPlaywrightConfig['flat/recommended'],

  // 4. Playwright Plugin Rules
  playwrightPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './apps/e2e/moneyhelper-booking-forms-e2e/tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  },
];
