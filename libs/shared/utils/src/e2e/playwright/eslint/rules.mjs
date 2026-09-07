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

const ENFORCE_IMPORTING_CUSTOM_FIXTURE = {
  'no-restricted-imports': [
    'error',
    {
      name: '@playwright/test',
      message:
        "Please import any playwright components from '@lib/test.lib.ts' instead, as this is the extended fixture including the page object model.",
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

const flatConfigRecommended = [
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/test.lib.ts'],
    rules: {
      ...ENFORCE_IMPORTING_CUSTOM_FIXTURE,
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      ...SINGLE_QUOTES,
      ...NO_FLOATING_PROMISES,
      ...ENFORCE_NAMING_CONVENTIONS,
      ...NON_ALPHANUMERIC_TEST_IDS,
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/*.spec.ts'], // Max statements for all code expect tests, as they can be lengthy.
    rules: {
      ...MAX_STATEMENTS,
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['**/*.config.ts', '**/*.config.js', '**/env.lib.ts'],
    rules: {
      ...ENFORCE_USING_ENV_VARIABLES_FROM_LIB,
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.js'],
    rules: {
      ...ENFORCE_IMPORTING_CUSTOM_FIXTURE,
      ...ENFORCE_PAGE_OBJECT_MODEL,
    },
  },
];

export const rules = {
  SINGLE_QUOTES,
  MAX_STATEMENTS,
  NO_FLOATING_PROMISES,
  ENFORCE_IMPORTING_CUSTOM_FIXTURE,
  ENFORCE_NAMING_CONVENTIONS,
  ENFORCE_USING_ENV_VARIABLES_FROM_LIB,
  ENFORCE_PAGE_OBJECT_MODEL,
  NON_ALPHANUMERIC_TEST_IDS,
};

export const configs = {
  ignores: [{ ignores: ['**/dist', '**/out-tsc', '**/eslint.config.js'] }],
  'flat/recommended': flatConfigRecommended,
};
