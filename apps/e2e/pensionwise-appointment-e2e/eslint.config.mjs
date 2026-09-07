import playwrightPlugin from 'eslint-plugin-playwright';
import tsParser from '@typescript-eslint/parser';

// This should be the eslint in the root directory.
import baseConfig from '../../../eslint.config.mjs';

const projectName = 'pensionwise-appointment-e2e';

export default [
  // 1. Global Ignores
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/*.eslintrc.js',
      '**/eslint.config.js',
    ],
  },

  // 2. Base Shared Configuration
  ...baseConfig,

  // 3. Playwright Recommended Configuration
  playwrightPlugin.configs['flat/recommended'],

  // 4. Main Rules Configuration for TS and JS
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: `apps/e2e/${projectName}/tsconfig.json`,
      },
    },
    rules: {
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      'max-statements': [
        'error',
        15,
        {
          ignoreTopLevelFunctions: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      'no-restricted-imports': [
        'error',
        {
          name: '@playwright/test',
          message:
            "Please import any playwright components from '@lib/test.lib.ts' instead, as this is the extended fixture including the page object model.",
        },
        {
          name: 'path',
          message: "Please use 'node:path' instead.",
        },
        {
          name: 'fs',
          message: "Please use 'node:fs' instead.",
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['function'],
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['string', 'number'],
          format: ['camelCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'classMethod',
          format: ['camelCase'],
        },
      ],
    },
  },

  // 5. Restricting process.env (excluding configuration files)
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/*.config.ts', '**/*.config.js'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message: "Use '@lib/env.lib.ts' instead.",
        },
      ],
    },
  },

  // 6. Playwright Spec-Specific Rules
  {
    files: ['**/*.spec.*'],
    rules: {
      'no-restricted-properties': [
        'error',
        ...[
          'locator',
          'getByAltText',
          'getByLabel',
          'getByPlaceholder',
          'getByRole',
          'getByTestId',
          'getByText',
          'getByTitle',
        ].map((property) => ({
          object: 'page',
          property,
          message: `Direct use of page.${property} is not allowed in test specs. Use the Page Object Model instead. See https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/805371918/ for guidance.`,
        })),
        {
          object: 'process',
          property: 'env',
          message: "Use '@lib/env.lib.ts' instead.",
        },
      ],
    },
  },
];
