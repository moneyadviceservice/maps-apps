/**
 * PACS UI Functional Tests
 *
 * This suite covers sorting, pagination, filtering, and UI behaviour for the
 * Compare Accounts journey.
 *
 * Notes:
 * - Fully migrated to the strict Page Object Model (POM) structure.
 * - No direct usage of `page.locator` or `@playwright/test` imports.
 * - All selectors and interactions are encapsulated in AccountsPage,
 *   FiltersPage, and PaginationPage.
 * - Fixtures are injected via @lib/test.lib to comply with ESLint restrictions.
 */

import { expect, test } from '@lib/test.lib';

test.describe('Compare Accounts', () => {
  test.beforeEach(async ({ accountsPage, setCookieControl }) => {
    await setCookieControl();
    await accountsPage.goto();
  });

  test('Five accounts present per page on load', async ({ accountsPage }) => {
    await expect(accountsPage.accountsPerPageSelect).toHaveValue('5');
  });

  test('Sort results by Bank name A-Z', async ({ accountsPage }) => {
    await accountsPage.sortBy('providerNameAZ');
    await expect(accountsPage.page).toHaveURL(/order=providerNameAZ&p=1/);

    await expect(accountsPage.getFirstAccountHeader()).toContainText(
      'AIB (NI)',
    );
  });

  test('Sort results by Bank name Z-A', async ({ accountsPage }) => {
    await accountsPage.sortBy('providerNameZA');
    await expect(accountsPage.page).toHaveURL(/order=providerNameZA&p=1/);

    await expect(accountsPage.getFirstAccountHeader()).toContainText(
      'Zopa Bank',
    );
  });

  test('Sort results by Monthly account fee(lowest first)', async ({
    accountsPage,
  }) => {
    await accountsPage.sortBy('monthlyAccountFeeLowestFirst');
    await expect(accountsPage.getFirstTableValue(0)).toContainText('£0.00');
  });

  test('Sort results by Minimum monthly deposit (lowest first)', async ({
    accountsPage,
  }) => {
    await accountsPage.sortBy('providerNameAZ');
    await accountsPage.sortBy('minimumMonthlyDepositLowestFirst');

    // Column 1 = Minimum monthly deposit (0 = monthly fee)
    await expect(accountsPage.getFirstTableValue(1)).toContainText('£0.00');
  });

  test('Sort results by Arranged overdraft rate (lowest first)', async ({
    accountsPage,
  }) => {
    await accountsPage.sortBy('arrangedOverdraftRateLowestFirst');
    // Column 2 = Arranged overdraft rate (positive APRs sort before "Not offered")
    await expect(accountsPage.getFirstTableValue(2)).toContainText('%');
  });

  test('Sort results by Unarranged maximum monthly charge (lowest first)', async ({
    accountsPage,
    paginationPage,
  }) => {
    await accountsPage.sortBy('unarrangedMaximumMonthlyChargeLowestFirst');

    // Column 3 = Unarranged max monthly charge ("Not offered" / £0 sorts first)
    await expect(accountsPage.getFirstTableValue(3)).toContainText(
      'Not offered',
    );

    await paginationPage.clickLastPage();

    // Infinity/null caps render as "No limit" and sort last when present in the
    // feed. Some environments only have capped products, so the highest £ charge
    // is last instead. Zero/"Not offered" must not sort last.
    const lastValue = accountsPage.getLastTableValue(3);
    await expect(lastValue).toHaveText(/^(No limit|£\d+\.\d{2})$/);
    await expect(lastValue).not.toHaveText('Not offered');
  });

  // Not mobile viable.
  test(
    'Allows to paginate using page number link for each page',
    { tag: '@ignoreMobile' },
    async ({ paginationPage, accountsPage }) => {
      const count = await paginationPage.getPageCount();

      for (let i = 1; i < Math.min(count, 4); i++) {
        const activePage = paginationPage.getPageByNumber(i);
        await expect(activePage).toHaveAttribute('aria-current', 'page');

        await paginationPage.clickPageByIndex(i);

        await expect(accountsPage.page).toHaveURL(
          (url) => url.searchParams.get('p') === String(i + 1),
        );
      }

      await expect(paginationPage.previousLink).toBeVisible();
      await expect(paginationPage.backToTopLink).toBeVisible();
    },
  );

  test('Display 20 accounts per page', async ({ accountsPage }) => {
    await accountsPage.accountsPerPageSelect.waitFor({ state: 'attached' });
    await accountsPage.accountsPerPageSelect.selectOption('20');

    await accountsPage.page.waitForLoadState();

    await expect(accountsPage.resultsRange).toContainText('1 - 20');
  });

  test('Verify last page link & Back and Back to top links functionality', async ({
    paginationPage,
    accountsPage,
  }) => {
    const lastPageId = await paginationPage.pageLinks.last().getAttribute('id');
    const lastPageNumber = Number(lastPageId?.replace('page-', ''));

    await expect(
      paginationPage.getPageByNumber(lastPageNumber),
    ).toHaveAttribute('title', `Go to page number ${lastPageNumber}`);

    await paginationPage.getPageByNumber(lastPageNumber).click();
    await accountsPage.backButton.click();
  });

  test('Verify Apply filters button functionality', async ({
    filtersPage,
    accountsPage,
  }) => {
    await filtersPage.openFiltersOnMobile();
    await filtersPage.toggleStandardCurrent();
    await filtersPage.toggleStudent();

    await filtersPage.search('Santander');
    await filtersPage.applyFilters();

    await accountsPage.page.waitForLoadState();

    await expect(accountsPage.page).toHaveURL(/standardcurrent=on/);
    await expect(accountsPage.page).toHaveURL(/student=on/);
    await expect(accountsPage.page).toHaveURL(/q=Santander/);

    await expect(accountsPage.selectedAccounts.first()).toContainText(
      'Santander',
    );
  });

  test('Verify Clear all link functionality', async ({
    filtersPage,
    accountsPage,
  }) => {
    await accountsPage.goto(
      '?q=&standardcurrent=on&nomonthlyfee=on&branchbanking=on&accountsPerPage=5',
    );
    await filtersPage.openFiltersOnMobile();

    await expect(accountsPage.stdCurrentOption).toBeChecked();
    await expect(accountsPage.noMonthlyFeeOption).toBeChecked();
    await expect(accountsPage.branchBankingOption).toBeChecked();

    const stdCurrentFilter =
      accountsPage.getFilterContainerByText('Standard current');
    const monthlyFeeFilter =
      accountsPage.getFilterContainerByText('No monthly fee');
    const branchBankingFilter =
      accountsPage.getFilterContainerByText('Branch banking');

    await expect(stdCurrentFilter).toBeVisible();
    await expect(monthlyFeeFilter).toBeVisible();
    await expect(branchBankingFilter).toBeVisible();

    await filtersPage.clearFilters();

    await expect(stdCurrentFilter).toBeHidden();
    await expect(monthlyFeeFilter).toBeHidden();
    await expect(branchBankingFilter).toBeHidden();

    await expect(filtersPage.searchInput).toHaveValue('');
  });
});
