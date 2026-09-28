import { test as base } from '@playwright/test';

import { AccountsPage } from '../pages/AccountsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { FiltersPage } from '../pages/FiltersPage';
import { PaginationPage } from '../pages/PaginationPage';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  accountsPage: AccountsPage;
  filtersPage: FiltersPage;
  paginationPage: PaginationPage;
  analyticsPage: AnalyticsPage;
}

export const test = base.extend<CustomFixtures>({
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
