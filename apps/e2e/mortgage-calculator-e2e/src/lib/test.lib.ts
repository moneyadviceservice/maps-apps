import { BasePage } from '@pages/Base.page';
import { ErrorComponent } from '@pages/components/error.component';
import { TeaserCards } from '@pages/components/teaser-cards.component';
import { test as base } from '@playwright/test';

import { CalculatorInput } from '../pages/components/calculator-input.component';
import { ResultsComponent } from '../pages/components/results.component';

export * from '@playwright/test';

interface CustomFixtures {
  basePage: BasePage;
  calculatorInput: CalculatorInput;
  resultsComponent: ResultsComponent;
  errorComponent: ErrorComponent;
  teaserCards: TeaserCards;
  setCookieControl: () => Promise<void>;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  calculatorInput: async ({ page }, provideFixture) => {
    await provideFixture(new CalculatorInput(page));
  },
  resultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsComponent(page));
  },
  errorComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ErrorComponent(page));
  },
  teaserCards: async ({ page }, provideFixture) => {
    await provideFixture(new TeaserCards(page));
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
