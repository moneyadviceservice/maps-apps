/* eslint-disable no-restricted-imports */
import { type Locator, type Page, test as base } from '@playwright/test';

import { AccountsPage } from '../pages/AccountsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { FiltersPage } from '../pages/FiltersPage';
import { PaginationPage } from '../pages/PaginationPage';

export { defineConfig, expect } from '@playwright/test';

export type { Locator, Page };

export const test = base.extend<{
  accountsPage: AccountsPage;
  filtersPage: FiltersPage;
  paginationPage: PaginationPage;
  analyticsPage: AnalyticsPage;
}>({
  accountsPage: async ({ page }, use) => {
    const accountsPage = new AccountsPage(page);
    await accountsPage.goto();
    await use(accountsPage);
  },
  analyticsPage: async ({ page }, use) => {
    await use(new AnalyticsPage(page));
  },

  filtersPage: async ({ page }, use) => {
    const filtersPage = new FiltersPage(page);
    await use(filtersPage);
  },

  paginationPage: async ({ page }, use) => {
    const paginationPage = new PaginationPage(page);
    await use(paginationPage);
  },
});
