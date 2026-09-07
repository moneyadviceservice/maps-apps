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
        project: 'apps/e2e/retirement-budget-planner-e2e/tsconfig.json',
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
];
