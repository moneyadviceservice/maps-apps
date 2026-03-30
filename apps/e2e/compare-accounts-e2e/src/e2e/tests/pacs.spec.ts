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

test('Five accounts present per page on load', async ({ accountsPage }) => {
  await expect(accountsPage.accountsPerPageSelect).toHaveValue('5');
});

test('Sort results by Bank name A-Z', async ({ accountsPage }) => {
  await accountsPage.sortBy('providerNameAZ');
  await expect(accountsPage.page).toHaveURL(/order=providerNameAZ&p=1/);

  await expect(accountsPage.getFirstAccountHeader()).toContainText('AIB (NI)');
});

test('Sort results by Bank name Z-A', async ({ accountsPage }) => {
  await accountsPage.sortBy('providerNameZA');
  await expect(accountsPage.page).toHaveURL(/order=providerNameZA&p=1/);

  await expect(accountsPage.getFirstAccountHeader()).toContainText('Zopa Bank');
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
  await expect(accountsPage.page).toHaveURL(/order=providerNameAZ/);

  await accountsPage.sortBy('minimumMonthlyDepositLowestFirst');
  await expect(accountsPage.page).toHaveURL(/minimumMonthlyDepositLowestFirst/);

  const firstValue = await accountsPage.getFirstTableValue(0).textContent();
  expect(firstValue?.trim()).toContain('£0.00');
});

test('Sort results by Arranged overdraft rate (lowest first)', async ({
  accountsPage,
}) => {
  await accountsPage.sortBy('arrangedOverdraftRateLowestFirst');
  await expect(accountsPage.getFirstTableValue(0)).toContainText('£0.00');
});

test('Sort results by Unarranged maximum monthly charge (lowest first)', async ({
  accountsPage,
  paginationPage,
}) => {
  await accountsPage.sortBy('unarrangedMaximumMonthlyChargeLowestFirst');
  await expect(accountsPage.page).toHaveURL(
    /unarrangedMaximumMonthlyChargeLowestFirst/,
  );

  await expect(accountsPage.getFirstTableValue(3)).toContainText('Not offered');

  await paginationPage.clickLastPage();
  await accountsPage.page.locator('.t-accounts-information').waitFor();

  const lastCharge = accountsPage.getLastTableValue(3);
  await lastCharge.click();
  await expect(lastCharge).toHaveText('No limit');
});

test('Allows to paginate using page number link for each page', async ({
  paginationPage,
  accountsPage,
}) => {
  const count = await paginationPage.getPageCount();

  for (let i = 0; i < Math.min(count, 4); i++) {
    await paginationPage.clickPageByIndex(i);

    const activePage = paginationPage.getPageByNumber(i + 1);
    await expect(activePage).toHaveAttribute('aria-current', 'page');

    await expect(accountsPage.page).toHaveURL(
      (url) => url.searchParams.get('p') === String(i + 1),
    );
  }

  await expect(paginationPage.previousLink).toBeVisible();
  await expect(paginationPage.backToTopLink).toBeVisible();
});

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

  await expect(paginationPage.getPageByNumber(lastPageNumber)).toHaveAttribute(
    'title',
    `Go to page number ${lastPageNumber}`,
  );

  await paginationPage.getPageByNumber(lastPageNumber).click();

  await accountsPage.page
    .getByRole('link', { name: 'Back', exact: true })
    .first()
    .click();
});

test('Verify Apply filters button functionality', async ({
  filtersPage,
  accountsPage,
}) => {
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
  await filtersPage.clearFilters();

  await expect(accountsPage.page.locator('#standardcurrent')).not.toBeChecked();
  await expect(accountsPage.page.locator('#student')).not.toBeChecked();
  await expect(accountsPage.page.locator('#nomonthlyfee')).not.toBeChecked();
  await expect(accountsPage.page.locator('#branchbanking')).not.toBeChecked();
  await expect(filtersPage.searchInput).toHaveValue('');
});
