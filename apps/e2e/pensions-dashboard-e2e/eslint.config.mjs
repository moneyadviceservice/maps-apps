import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

import baseConfig from '../../../eslint.config.mjs';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  ...baseConfig,
  ...compat.extends('plugin:playwright/recommended'),
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: 'apps/e2e/pensions-dashboard-e2e/tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-restricted-imports': [
        'error',
        {
          name: '@playwright/test',
          message:
            "Please import any playwright components from '@maps/playwright' instead, we use an older version with a custom fixture so LambdaTest works without having to configure it.",
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
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            "Do not use process.env, please import any environment variables using `import ENV from '@env'` instead.",
        },
      ],
    },
    ignores: ['**/*.config.ts', '**/*.config.js'],
  },
];
