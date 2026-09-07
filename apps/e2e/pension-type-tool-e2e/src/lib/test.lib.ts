/* eslint-disable no-restricted-imports */

import { CheckYourAnswersComponent } from '@pages/components/checkYourAnswers.component';
import { CommonComponent } from '@pages/components/commonComponent.component';
import { ResultsComponent } from '@pages/components/results.component';
import { test as base } from '@playwright/test';

export * from '@playwright/test';

interface CustomFixtures {
  commonComponent: CommonComponent;
  checkYourAnswersComponent: CheckYourAnswersComponent;
  resultsComponent: ResultsComponent;
  setCookieControl: () => Promise<void>;
}

export const test = base.extend<CustomFixtures>({
  commonComponent: async ({ page }, provideFixture) => {
    await provideFixture(new CommonComponent(page));
  },
  checkYourAnswersComponent: async ({ page }, provideFixture) => {
    await provideFixture(new CheckYourAnswersComponent(page));
  },
  resultsComponent: async ({ page }, provideFixture) => {
    await provideFixture(new ResultsComponent(page));
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
