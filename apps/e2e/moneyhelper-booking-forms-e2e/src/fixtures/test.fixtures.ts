import {
  AgeExceptionsPage,
  DefinedContributionPage,
  Over50Page,
  PensionProviderPage,
  SafeguardingLandingPage,
  UKPensionPage,
} from '@mhbf-e2e/pages/Eligibility';

import { test as base } from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

export * from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  ageExceptionsPage: AgeExceptionsPage;
  cookieControl: void;
  definedContributionPage: DefinedContributionPage;
  over50Page: Over50Page;
  pensionProviderPage: PensionProviderPage;
  safeguardingLandingPage: SafeguardingLandingPage;
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
  pensionProviderPage: async ({ page }, use) => {
    await use(new PensionProviderPage(page));
  },
  ukPensionsPage: async ({ page }, use) => {
    await use(new UKPensionPage(page));
  },
  safeguardingLandingPage: async ({ page }, use) => {
    await use(new SafeguardingLandingPage(page));
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
