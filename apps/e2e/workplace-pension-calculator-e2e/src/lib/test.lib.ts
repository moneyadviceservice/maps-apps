/* eslint-disable no-restricted-imports */
import { YourContributionsComponent } from '@pages/components/YourContributions.component';
import { YourDetailsComponent } from '@pages/components/YourDetails.component';
import { YourResultsComponent } from '@pages/components/YourResults.component';
import { StartCalculatorPage } from '@pages/StartCalculatorPage';
import { test as base } from '@playwright/test';

export * from '@playwright/test';

interface CustomFixtures {
  startCalculatorPage: StartCalculatorPage;
  yourDetailsComponent: YourDetailsComponent;
  yourContributionsComponent: YourContributionsComponent;
  yourResultsComponent: YourResultsComponent;
  setCookieControl: () => Promise<void>;
}

export const test = base.extend<CustomFixtures>({
  startCalculatorPage: async ({ page }, provideFixture) => {
    await provideFixture(new StartCalculatorPage(page));
  },
  yourDetailsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourDetailsComponent(page));
  },
  yourContributionsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourContributionsComponent(page));
  },
  yourResultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new YourResultsComponent(page));
  },
  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;

    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);

    await provideFixture(async () => {
      await context.addCookies([
        {
          name: 'CookieControl',
          value: JSON.stringify({
            necessaryCookies: [],
            optionalCookies: {
              analytics: 'revoked',
              marketing: 'revoked',
            },
            statement: {},
            consentDate: 0,
            consentExpiry: 0,
            interactedWith: true,
            user: 'anonymous',
          }),
          domain: hostname,
          path: '/',
        },
      ]);
    });
  },
});
