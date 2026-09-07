/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['plugin:playwright/recommended', '../../../.eslintrc.json'],
  ignorePatterns: ['!**/*', '**/*.eslintrc.js'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'apps/e2e/fuel-finder-e2e/tsconfig.json',
  },

  overrides: [
    {
      files: ['*.ts', '*.js'],
      rules: {
        // 🔥 FIX: Disable Next.js rule for this E2E project
        '@next/next/no-html-link-for-pages': 'off',

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

    {
      files: ['*.ts', '*.js'],
      excludedFiles: ['**/*.config.ts', '**/*.config.js'],
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
            message: `Direct use of page.${property} is not allowed in test specs. Use the Page Object Model instead.`,
          })),
          {
            object: 'process',
            property: 'env',
            message: "Use '@lib/env.lib.ts' instead.",
          },
        ],
      },
    },
  ],
};
