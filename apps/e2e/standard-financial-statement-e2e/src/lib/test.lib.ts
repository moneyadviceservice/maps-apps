/* eslint-disable no-restricted-imports */
export {
  defineConfig,
  expect,
  type Locator,
  type Page,
} from '@playwright/test';

import { type Page, test as base } from '@playwright/test';

import { ApplyToUsePage } from '../pages/apply-to-use.page';
import { HomePage } from '../pages/home.page';

import { mockCookieConsentRoute } from './cookie-consent.mock';

export type ExtendedPage = Page & {
  gotoHome: () => Promise<void>;
};

type Fixtures = {
  extendedPage: ExtendedPage;
  homePage: HomePage;
  applyToUsePage: ApplyToUsePage;
};

export const test = base.extend<Fixtures>({
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
