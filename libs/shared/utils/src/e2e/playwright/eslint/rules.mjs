const SINGLE_QUOTES = {
  quotes: [
    'error',
    'single',
    { avoidEscape: true, allowTemplateLiterals: true },
  ],
};

const MAX_STATEMENTS = {
  'max-statements': [
    'error',
    15,
    {
      ignoreTopLevelFunctions: true,
    },
  ],
};

const NO_FLOATING_PROMISES = {
  '@typescript-eslint/no-floating-promises': 'error',
};

const ENFORCE_CORRECT_IMPORT_STANDARDS = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@playwright/test',
          message:
            "Please import any playwright components from '@lib/test.lib.ts' instead, as this is the extended fixture including the page object model.\n" +
            'If the file is already test.lib.ts, then import from @maps-react/playwright/fixtures/default.fixtures instead.',
        },
      ],
      patterns: [
        {
          group: ['src/*', './src/*', '../src/*'],
          message:
            'Do not import files directly from "src". ' +
            'Use the TypeScript path alias defined in tsconfig.json instead. ' +
            'For example, change import foobar from "./src/lib/file.lib.ts" ' +
            'to import foobar from "@lib/file.lib.ts".\n\n' +
            'For more information, see: https://mapswiki.atlassian.net/wiki/x/CYD6Qw',
        },
        {
          group: [
            '*./components/*',
            '*./support/*',
            '*./fixtures/*',
            '*./mocks/*',
            '*./helpers/*',
            '*./tests/*',
            '*./lib/*',
            '*./data/*',
            '*./pages/*',
            '*./utils/*',
            '*./util/*',
          ],
          message:
            'Do not import files using a relative path. ' +
            'Use the TypeScript path alias defined in tsconfig.json instead. ' +
            'For example, change import foobar from "./data/users.ts" ' +
            'to import foobar from "@data/users.ts".\n\n' +
            "If th path alias doesn't exist, then add it.\n" +
            'For more information, see: https://mapswiki.atlassian.net/wiki/x/CYD6Qw',
        },
      ],
    },
  ],
};

const ENFORCE_NAMING_CONVENTIONS = {
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
};

const ENFORCE_USING_ENV_VARIABLES_FROM_LIB = {
  'no-restricted-properties': [
    'error',
    {
      object: 'process',
      property: 'env',
      message: "Use '@lib/env.lib.ts' instead.",
    },
  ],
};

const ENFORCE_PAGE_OBJECT_MODEL = {
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
      property,
      message: `Direct use of page.${property} is not allowed in test specs. Use the Page Object Model instead. See https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/805371918/ for guidance.`,
    })),
    {
      object: 'process',
      property: 'env',
      message: "Use '@lib/env.lib.ts' instead.",
    },
  ],
};

const NON_ALPHANUMERIC_TEST_IDS = {
  'no-restricted-syntax': [
    'warn',
    {
      selector:
        "CallExpression[callee.property.name='getByTestId'] > Literal:first-child[value=/[^a-zA-Z0-9_-]/]",
      message:
        "A 'data-testid' should only contain letters, numbers, underscores (_), and dashes (-), make sure you're not using a locator by accident.",
    },
  ],
};

const NON_SPECIFIC_ASSERTION_FUNCTIONS_FOR_ANALYTICS = {
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'FunctionDeclaration > Identifier[name=/verify/i][name=/data/i]',
      message:
        "It looks like you're trying to validate the data layer, do not use functions that do assertions, " +
        'instead use the extended expect functionality specifically designed for the data layer. \n\n' +
        'For more information, see: https://mapswiki.atlassian.net/wiki/x/SwDzQw',
    },
  ],
};

const NO_ACCESSING_ADOBE_DATA_LAYER_DIRECTLY = {
  'no-restricted-properties': [
    'error',
    {
      property: 'adobeDataLayer',
      message:
        "It looks like you're trying to validate the data layer, do not use functions that do assertions, " +
        'instead use the extended expect functionality specifically designed for the data layer. \n\n' +
        'For more information, see: https://mapswiki.atlassian.net/wiki/x/SwDzQw',
    },
  ],
};

const flatConfigRecommended = [
  // Enforce basic standards.
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      ...SINGLE_QUOTES,
      ...NO_FLOATING_PROMISES,
      ...ENFORCE_NAMING_CONVENTIONS,
      ...NON_ALPHANUMERIC_TEST_IDS,
      ...ENFORCE_CORRECT_IMPORT_STANDARDS,
      ...NON_SPECIFIC_ASSERTION_FUNCTIONS_FOR_ANALYTICS,
      ...NO_ACCESSING_ADOBE_DATA_LAYER_DIRECTLY,
    },
  },

  // Enforce max statements in framework code, not tests.
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/*.spec.ts'],
    rules: {
      ...MAX_STATEMENTS,
    },
  },

  // Enforce environment variable standards in all files except config.
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/*.config.ts', '**/*.config.js', '**/env.lib.ts'],
    rules: {
      ...ENFORCE_USING_ENV_VARIABLES_FROM_LIB,
    },
  },

  // Enforce the page object model in test files.
  {
    files: ['**/*.spec.ts', '**/*.spec.js'],
    rules: {
      ...ENFORCE_PAGE_OBJECT_MODEL,
    },
  },
];

export const rules = {
  SINGLE_QUOTES,
  MAX_STATEMENTS,
  NO_FLOATING_PROMISES,
  ENFORCE_IMPORTING_CUSTOM_FIXTURE: ENFORCE_CORRECT_IMPORT_STANDARDS,
  ENFORCE_NAMING_CONVENTIONS,
  ENFORCE_USING_ENV_VARIABLES_FROM_LIB,
  ENFORCE_PAGE_OBJECT_MODEL,
  NON_ALPHANUMERIC_TEST_IDS,
};

export const configs = {
  ignores: [{ ignores: ['**/dist', '**/out-tsc', '**/eslint.config.js'] }],
  'flat/recommended': flatConfigRecommended,
};
