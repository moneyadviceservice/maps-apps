import { DebtAdviceLocatorPage } from '@pages/debt-advice-locator.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  debtAdviceLocatorPage: DebtAdviceLocatorPage;
}

export const test = base.extend<CustomFixtures>({
  debtAdviceLocatorPage: async ({ page }, provideFixture) => {
    await provideFixture(new DebtAdviceLocatorPage(page));
  },
});
