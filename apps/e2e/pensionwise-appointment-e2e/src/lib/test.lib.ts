import { BasePage } from '@pages/base.page';
import { LookupPage } from '@pages/lookup-form.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  basePage: BasePage;
  lookupForm: LookupPage;
}

export const test = base.extend<CustomFixtures>({
  basePage: async ({ page }, provideFixture) => {
    await provideFixture(new BasePage(page));
  },
  lookupForm: async ({ page }, provideFixture) => {
    await provideFixture(new LookupPage(page));
  },
});
