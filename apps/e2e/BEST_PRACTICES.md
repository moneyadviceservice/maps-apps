# Playwright End-to-End Best Practices and Project Structure

This document is a work in progress.

This document should outline some checks and standards for frameworks going forward, when an end to end test framework is 'audited', these are the checks that will be done, some of these are ESLint rules or will eventually be ESLint rules.

## Project Structure

- Does the folder structure follow the intended structure (It can be in a /src or in the root directory)

  - `/lib` Library files that support the entire framework, do not use this for test utilities.
  - `/tests` Test files only, do not include utilities to support testing in here.
  - `/pages` The page object model, one file per page object.
  - `/pages/components` **(optional)** Supporting components to reduce duplication within the page object model.
  - `/data` **(optional)** Test data such as json files, pdfs, pngs or TS files that export data.
  - `/utils` **(optional)** Utilty functions to support testing, the suggestion is to use a static class, i.e. DateUtils.getParsesdDate()
  - `/mocks` **(optional)** Any supporting mock servers that run on test execution.

- Does the folder structure avoid having an `/e2e` folder, folders name e2e come from the Cypress way of working and are redundant in Playwright.
- Are the folders set up as TS paths in the `tsconfig.json` and does it include the `@maps-react/playwright/*` reference??

  ```json
  // Example
  {
    "extends": "../../../tsconfig.playwright.base.json",
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@lib/*": ["src/lib/*"],
        "@pages/*": ["src/pages/*"],
        "@maps-react/playwright/*": [
          "../../../libs/shared/utils/src/e2e/playwright/*"
        ]
      }
    },
    "include": ["**/*.ts", "eslint.config.mjs", "**/*.js"]
  }
  ```

## Appropriate files

- Is there a `test.lib` in the `/lib` folder that sets up the page object model.
- Is there a `env.lib` in the `/lib` folder that imports, validates and re-exports the environment variables.
- Does the `test.lib` file import from the default fixtures found in `@maps-apps/playwright/fixtures/default.fixture`

## Assertions

- Are assertions done inside of the test, no `expect()` functions should be found out side of test files, if more complex assertions are needed, then extend the expect functionality, see the jest documentation.

  ```ts
  // ❌ Wrong, what elements is it asserting?
  test('my app does the right thing', async ({ homePage, bankAccount }) => {
    await homePage.goto();
    await homePage.verifyElements();

    await homePage.freePhoneCta.click();
    await bankAccount.validateAlerts();
  });

  // ✅ Correct, clearly shows what's being tested.
  test('my app does the right thing', async ({ homePage, bankAccount }) => {
    await homePage.goto();

    await expect(homePage.header).toHaveText('Welcome to my App!');
    await expect(homePage.body).toHaveText(
      'You are the 1,000,000th user! click here for your free iPhone',
    );

    await homePage.freePhoneCta.click();
    await expect(bankAccount.alerts).toHaveText('Alert! Unauthorised access!');
  });
  ```

## Imports

- Are tests using fixtures to import page, as oppose to using new classess

  ```ts
  // ❌ Wrong, do not create new classes, add them to the @lib/test.lib
  test('my app does the right thing', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goto();
    await homePage.loginButton.click();

    await loginPage.fillCredentials('admin', 'wrong_password_123');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  // ✅ Correct, a general rule is that you shouldn't really need to use the page fixture directly.
  test('my app does the right thing', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await homePage.loginButton.click();

    await loginPage.fillCredentials('admin', 'wrong_password_123');
    await expect(loginPage.errorMessage).toBeVisible();
  });
  ```

- Are the files importing `@lib/test.lib` as oppose to `@playwright/test` (this should be an eslint rule)
- Are the files importing via the correct TS config paths, i.e.:

  ```ts
  // ❌ Wrong
  import foobar from '../pages/home.page';

  // ✅ Correct
  import foobar from '@pages/home.page';
  ```

## Naming Conventions and Linting

-
- Is the up the date ESLint file being used which imports from the shared playwright utility folder.
- Are file names following the correct naming convention of `kebab-case.type.ts`
  - Do not use camelCase or PascalCase for files.
  - Examples:
    - `home.page.ts` not `home-page.ts`
    - `date.utils.ts` not `dateUtils.ts`
    - `login.page.ts` not `LoginPage.ts`
