import {
  AgeExceptionsPage,
  DefinedContributionPage,
  Over50Page,
  UKPensionPage,
} from '@mhbf-e2e/pages/Eligibility';

import { test as base } from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

export * from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  ageExceptionsPage: AgeExceptionsPage;
  cookieControl: void;
  definedContributionPage: DefinedContributionPage;
  over50Page: Over50Page;
  ukPensionsPage: UKPensionPage;
}

export const test = base.extend<CustomFixtures>({
  ageExceptionsPage: async ({ page }, use) => {
    await use(new AgeExceptionsPage(page));
  },
  definedContributionPage: async ({ page }, use) => {
    await use(new DefinedContributionPage(page));
  },
  over50Page: async ({ page }, use) => {
    await use(new Over50Page(page));
  },
  ukPensionsPage: async ({ page }, use) => {
    await use(new UKPensionPage(page));
  },

  /**
   * Even if you don't import this fixture, it will still run.
   * This ensures the cookie are always set without using it in a test.
   */
  cookieControl: [
    async ({ setCookieControl }, use) => {
      await setCookieControl();
      await use();
    },
    { auto: true },
  ],
});
