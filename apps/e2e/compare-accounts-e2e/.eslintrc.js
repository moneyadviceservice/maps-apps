/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['plugin:playwright/recommended', '../../../.eslintrc.json'],
  ignorePatterns: ['!**/*', '**/*.eslintrc.js'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'apps/e2e/compare-accounts-e2e/tsconfig.json',
  },
  /**
   * The following rules are general best practices.
   *
   * max-statements
   * @see https://eslint.org/docs/latest/rules/max-statements
   * This rule enforces a maximum number of statements allowed in function blocks.
   * Functions should have a seperation of concern, avoid using high level functions like parseData()
   * Prefer breaking them down into smaller functions, i.e.:
   *
   *  // Large function
   *  getParseAndSendData() ❌
   *
   *  // Smaller functions ✅
   *  const data = fetchData()
   *  const cleanData = cleanData(data)
   *  const stringData = stringifyData(cleanData)
   *  sendData(stringData)
   *
   * @typescript-eslint/no-floating-promises
   * @see https://typescript-eslint.io/rules/no-floating-promises/
   * A "floating" Promise is one that is created without any code set up to handle any errors it might throw.
   * Floating Promises can cause several issues, such as improperly sequenced operations, ignored Promise rejections, and more.
   *
   * no-restricted-imports
   * @see https://eslint.org/docs/latest/rules/no-restricted-imports
   *
   * "@playwright/test" - There is an extended test fixture in the lib folder, this contains all the functionality of playwright test and more.
   * It's enforced that @lib/test.lib.ts is imported instead to avoid inconsistency in tests.
   *
   * "path" & "fs" - If path or fs is imported without using node:path and node:fs, SonarQube will flag these and advise you fix it.
   * This rule just catches those issues earlier.
   */
  overrides: [
    {
      files: ['*.ts', '*.js'],
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
          /**
           * Variables that are functions should be camel case, i.e.:
           *
           * const myFunc = () => null ✅
           */
          {
            selector: 'variable',
            types: ['function'],
            format: ['camelCase'],
          },
          /**
           * Variables should be camelCase, i.e.:
           *
           * const name = 'Hello' ✅
           * var index = 1 ✅
           */
          {
            selector: 'variable',
            modifiers: ['const'],
            types: ['string', 'number'],
            format: ['camelCase'],
          },
          /**
           * Classes should be PascalCase, i.e.:
           *
           * class LoginPage { ✅
           *    ...
           * }
           */
          {
            selector: 'class',
            format: ['PascalCase'],
          },
          /**
           * Class methods should be camelCase, i.e.
           *
           * class LoginPage {
           *    myMethod {} ✅
           * }
           */
          {
            selector: 'classMethod',
            format: ['camelCase'],
          },
        ],
      },
    },
    /**
     * The following rules are special rules to align developers/tests with the standarised practices, such as importing process envs a certain way.
     *
     * no-restricted-properties
     * @see https://eslint.org/docs/latest/rules/no-restricted-properties
     * Certain properties on objects may be disallowed in a codebase. This is useful for deprecating an API or restricting usage of a module’s methods.
     * For example, you may want to disallow using process.env and tell people to use a specific wrapper instead.
     *
     * "process.env" - It's enforced that you use a specific environment variable importing file, this validates the schema of the env object at launch.
     * This can catch issues earlier and give better error logging, it also adds type safety to environment variables use too.
     */
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
    /**
     * The following rules are to align everybody with our Playwright Best Practices document in Confluence.
     * @see https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/805371918
     */
    {
      /**
       * no-restricted-properties
       * @see https://eslint.org/docs/latest/rules/no-restricted-properties
       *
       * Ban the use of locator methods in test files, all actions should be done by importing a page and executing a parameterised method.
       * see the playwright best practices document in confluence for more information: https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/805371918
       */
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
          // Re-added as it's overriding rules for .spec.ts
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
