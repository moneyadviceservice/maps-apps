import { AccountsPage } from '@pages/AccountsPage';
import { AnalyticsPage } from '@pages/AnalyticsPage';
import { FiltersPage } from '@pages/FiltersPage';
import { PaginationPage } from '@pages/PaginationPage';

import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  accountsPage: AccountsPage;
  filtersPage: FiltersPage;
  paginationPage: PaginationPage;
  analyticsPage: AnalyticsPage;
  isMobile: boolean | undefined;
}

export const test = base.extend<CustomFixtures>({
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
  analyticsPage: async ({ page }, use) => {
    await use(new AnalyticsPage(page));
  },
  filtersPage: async ({ page }, use, testInfo) => {
    await use(new FiltersPage(page, testInfo));
  },
  paginationPage: async ({ page }, use, testInfo) => {
    await use(new PaginationPage(page, testInfo));
  },
  isMobile: async ({}, use, testInfo) => {
    await use(!!testInfo.project.use.isMobile);
  },
});
