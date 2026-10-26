import { CalculatorPage } from '@pages/calculatorPage.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';
export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  app: CalculatorPage;
}

export const test = base.extend<CustomFixtures>({
  app: async ({ page }, provideFixture) => {
    await provideFixture(new CalculatorPage(page));
  },
});
