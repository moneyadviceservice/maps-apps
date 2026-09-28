import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: [
      'dist/**',
      '**/public',
      '**/build',
      'coverage/**',
      'node_modules/**',
      '**/.next/**/*',
      '**/**.json',
      '**/*.d.ts',
      '**/playwright-report/**/*',
      '**/.netlify/**/*',
    ],
  },
  ...nx.configs['flat/base'],
  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react'],
            ['^next'],
            ['^\\w', '^@?\\w'],
            ['^@maps-react'],
            [
              '^\\.?$',
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '../../../../../../tailwind-colors',
            '../../../../../../tailwind-typography',
            '../../tailwind-workspace-preset.js',
            '../../../tailwind-workspace-preset.js',
            '../../libs/shared/csp-policy/src/withCSPHeaders',
            '../../libs/shared/utils/src/withAemUserAgent/withAemUserAgent',
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   plugins: {
  //     // This mapping is what fixes the "Could not find plugin" error
  //     '@typescript-eslint': tsPlugin,
  //   },
  //   languageOptions: {
  //     parser: tsParser,
  //   },
  //   rules: {
  //     '@typescript-eslint/no-unused-vars': [
  //       'warn',
  //       {
  //         vars: 'all',
  //         args: 'after-used',
  //         ignoreRestSiblings: true,
  //       },
  //     ],
  //   },
  // },
  {
    files: ['**/*.json'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
