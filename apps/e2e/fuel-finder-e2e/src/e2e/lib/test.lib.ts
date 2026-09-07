/* eslint-disable no-restricted-imports */

// ✅ Proper re-export (Sonar S7763)
export {
  defineConfig,
  expect,
  type Locator,
  type Page,
} from '@playwright/test';

import {
  test as base,
  type Page, // ✅ FIX: import Page type
  type Route, // ✅ FIX: type for route
} from '@playwright/test';

import { PaginationPage } from '../pages/PaginationPage';
import { PostcodePage } from '../pages/PostcodePage';
import { ResultsFilterPage } from '../pages/ResultsFilterPage';
import { ResultsPage } from '../pages/ResultsPage';

/**
 * Extended Playwright Page with additional helper utilities.
 */
export type ExtendedPage = Page & {
  gotoWithCookies: (lang?: 'en' | 'cy') => Promise<void>;
  disableCookieConsent: () => Promise<void>;
};

/**
 * Custom Playwright fixtures used across tests.
 */
type Fixtures = {
  extendedPage: ExtendedPage;
  homePage: PostcodePage;
  resultsFilterPage: ResultsFilterPage;
  paginationPage: PaginationPage;
  resultsPage: ResultsPage;
};

/**
 * Extended Playwright test instance
 */
export const test = base.extend<Fixtures>({
  /**
   * Enhanced Page fixture
   */
  extendedPage: async (
    { page }: { page: Page },
    done: (value: ExtendedPage) => Promise<void>, // ✅ FIX: type for done
  ) => {
    await page.route('**/c/v**', async (route: Route) => {
      // ✅ FIX: type for route
      try {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: '',
        });
      } catch {
        await route.continue();
      }
    });

    const extended: ExtendedPage = Object.assign(page, {
      async gotoWithCookies(lang: 'en' | 'cy' = 'en') {
        await page.goto(lang === 'en' ? '/en' : '/cy', {
          waitUntil: 'domcontentloaded',
        });

        await this.disableCookieConsent();
      },

      async disableCookieConsent() {
        try {
          await page.evaluate(() => {
            document.querySelector('#ccc-overlay')?.remove();
            document.querySelector('#ccc-notify')?.remove();
            document.querySelector('#ccc')?.remove();
          });
        } catch {
          // ignore
        }
      },
    });

    await done(extended);
  },

  /**
   * Postcode Page Object
   */
  homePage: async (
    { extendedPage },
    done: (value: PostcodePage) => Promise<void>,
  ) => {
    await done(new PostcodePage(extendedPage));
  },

  /**
   * Results Filter Page Object
   */
  resultsFilterPage: async (
    { extendedPage },
    done: (value: ResultsFilterPage) => Promise<void>,
  ) => {
    await done(new ResultsFilterPage(extendedPage));
  },

  /**
   * Pagination Page Object
   */
  paginationPage: async (
    { extendedPage },
    done: (value: PaginationPage) => Promise<void>,
  ) => {
    await done(new PaginationPage(extendedPage));
  },

  /**
   * Results Page Object
   */
  resultsPage: async (
    { extendedPage },
    done: (value: ResultsPage) => Promise<void>,
  ) => {
    await done(new ResultsPage(extendedPage));
  },
});
