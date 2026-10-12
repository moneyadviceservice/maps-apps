import { App } from '@pages/app.page';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';
export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  app: App;
}

export const test = base.extend<CustomFixtures>({
  app: async ({ page }, provideFixture) => {
    await provideFixture(new App(page));
  },
});
