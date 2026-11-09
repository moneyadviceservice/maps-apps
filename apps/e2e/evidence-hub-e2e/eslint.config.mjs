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
    files: ['**/*.ts', '**/*.js'],
    rules: {
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
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Do not use process.env; import ENV from src/lib/env.lib.ts instead.',
        },
      ],
    },
    ignores: ['**/*.config.ts', '**/*.config.js', '**/env.lib.ts'],
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Assertions are encapsulated in page object methods.
      'playwright/expect-expect': 'off',
    },
  },
];
