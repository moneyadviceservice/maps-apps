import { AdjustableIncomePage } from '@pages/AdjustableIncomePage';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  adjustableIncomePage: AdjustableIncomePage;
}

export const test = base.extend<CustomFixtures>({
  adjustableIncomePage: async ({ page }, use) => {
    await use(new AdjustableIncomePage(page));
  },
});
