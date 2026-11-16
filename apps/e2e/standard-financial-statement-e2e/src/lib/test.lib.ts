import {
  type Page,
  test as base,
} from '@maps-react/playwright/fixtures/default.fixtures';

import { ApplyToUsePage } from '../pages/apply-to-use.page';
import { HomePage } from '../pages/home.page';
import { mockCookieConsentRoute } from './cookie-consent.mock';

export * from '@maps-react/playwright/fixtures/default.fixtures';

export type ExtendedPage = Page & {
  gotoHome: () => Promise<void>;
};

type CustomFixtures = {
  extendedPage: ExtendedPage;
  homePage: HomePage;
  applyToUsePage: ApplyToUsePage;
};

export const test = base.extend<CustomFixtures>({
  extendedPage: async ({ page }, provide) => {
    await mockCookieConsentRoute(page);

    const extended: ExtendedPage = Object.assign(page, {
      async gotoHome() {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
      },
    });

    await provide(extended);
  },

  homePage: async ({ extendedPage }, provide) => {
    await provide(new HomePage(extendedPage));
  },

  applyToUsePage: async ({ extendedPage }, provide) => {
    await provide(new ApplyToUsePage(extendedPage));
  },
});
