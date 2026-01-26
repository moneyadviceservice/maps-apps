import { expect, test } from '@playwright/test';
const basePath = '/en';

test.beforeEach(async ({ page }) => {
  await page.goto(basePath);
  //Set cookie control (if you're accepting cookies manually)
  await page
    .locator('button', { hasText: 'Accept all cookies' })
    .click()
    .catch(() => {
      console.log('Cookie banner not found');
    });
  // Set breakpoint/view
  await page.setViewportSize({ width: 1440, height: 900 }); // Desktop breakpoint
});

test('Five accounts present per page on load', async ({ page }) => {
  const select = page.locator('#accountsPerPage');
  await expect(select).toHaveValue('5');
});

test('Sort results by Bank name A-Z', async ({ page }) => {
  await page.selectOption('select#order', 'providerNameAZ');
  await expect(page).toHaveURL(/order=providerNameAZ&p=1/);
  const firstAccount = page
    .locator('div[data-testid="selected-accounts"]')
    .first();
  await expect(firstAccount.locator('h3')).toContainText('AIB (NI)');
});

test('Sort results by Bank name Z-A', async ({ page }) => {
  await page.selectOption('select#order', 'providerNameZA');
  await expect(page).toHaveURL(/order=providerNameZA&p=1/);
  const firstAccount = page
    .locator('div[data-testid="selected-accounts"]')
    .first();
  await expect(firstAccount.locator('h3')).toContainText('Zopa Bank');
});

test('Sort results by Monthly account fee(lowest first)', async ({ page }) => {
  await page.selectOption('select#order', 'monthlyAccountFeeLowestFirst');
  const firstFee = page.locator(
    'div[data-testid="selected-accounts"] >> nth=0 >> [data-testid="table-data-value-0"]',
  );
  await expect(firstFee).toContainText('£0.00');
});

test('Sort results by Minimum monthly deposit (lowest first)', async ({
  page,
}) => {
  // Select different option first, then select target option
  // This is because default option is set to 'minimumMonthlyDepositLowestFirst'
  await page.selectOption('select#order', 'providerNameAZ');
  await page.waitForURL(/order=providerNameAZ/);
  await page.selectOption('select#order', 'minimumMonthlyDepositLowestFirst');
  await page.waitForURL(/order=minimumMonthlyDepositLowestFirst/);

  // Locate the first account value
  const firstValueLocator = page.locator(
    'div[data-testid="selected-accounts"] >> nth=0 >> [data-testid="table-data-value-0"]',
  );
  await firstValueLocator.waitFor({ state: 'visible' });

  const firstValue = await firstValueLocator.textContent();
  expect(firstValue?.trim()).toContain('£0.00');
});

test('Sort results by Arranged overdraft rate (lowest first)', async ({
  page,
}) => {
  // Select "Arranged overdraft rate (lowest first)" from the dropdown
  await page.selectOption('select#order', 'arrangedOverdraftRateLowestFirst');

  // Locate the first account value
  const valueLocator = page
    .locator('div[data-testid="selected-accounts"]')
    .nth(0)
    .locator('[data-testid="table-data-value-0"]');

  // Assert it contains "£0.00"
  await expect(valueLocator).toContainText('£0.00');
});

test('Sort results by Unarranged maximum monthly charge (lowest first)', async ({
  page,
}) => {
  await page.selectOption(
    'select#order',
    'unarrangedMaximumMonthlyChargeLowestFirst',
  );
  await expect(page).toHaveURL(/unarrangedMaximumMonthlyChargeLowestFirst/);
  const firstCharge = page
    .locator('[data-testid="table-data-value-3"]')
    .first();
  await expect(firstCharge).toContainText('Not offered');

  await page.locator('[id^="page-"]').last().click();
  await page.locator('.t-accounts-information').waitFor();
  const lastCharge = page.locator('[data-testid="table-data-value-3"]').last();
  await lastCharge.click();
  await expect(lastCharge).toHaveText('No limit');
});

test('Allows to paginate using page number link for each page', async ({
  page,
}) => {
  const pageLocators = page.locator('[id^="page-"]');
  const count = await pageLocators.count();

  for (let i = 0; i < Math.min(count, 4); i++) {
    const currentPage = pageLocators.nth(i);
    await currentPage.click();

    // Wait until the clicked page becomes active
    const activePageId = `page-${i + 1}`;
    const activePage = page.locator(`#${activePageId}`);
    await expect(activePage).toHaveAttribute('aria-current', 'page');

    // Verify the URL reflects the current page
    await expect(page).toHaveURL(new RegExp(`\\?p=${i + 1}`));
  }

  // Confirm pagination controls are visible
  await expect(page.locator('a.t-previous')).toBeVisible();
  await expect(page.locator('a.order-4')).toBeVisible();
});

test('Display 20 accounts per page', async ({ page }) => {
  // Select "20" from the dropdown
  await page.locator('#accountsPerPage').waitFor({ state: 'attached' });
  await page.selectOption('#accountsPerPage', '20');

  // Wait for network or DOM update if necessary
  await page.waitForLoadState();

  await expect(
    page.locator(
      'div.hidden.lg\\:flex.items-center.justify-center.lg\\:justify-start',
    ),
  ).toContainText('1 - 20');
});

test('Verify last page link & Back and Back to top links functionality', async ({
  page,
}) => {
  // Get ID of the last pagination link
  const lastPageId = await page
    .locator('a[id^="page-"]')
    .last()
    .getAttribute('id');
  const lastPageNumber = lastPageId?.replace('page-', '');

  // Validate the title attribute for the last page link
  await expect(page.locator(`#page-${lastPageNumber}`)).toHaveAttribute(
    'title',
    `Go to page number ${lastPageNumber}`,
  );

  // Click the last page link
  await page.locator(`#page-${lastPageNumber}`).click();

  // Click the correct "Back" link (filtered to exact match and first occurrence)
  await page.getByRole('link', { name: 'Back', exact: true }).first().click();
});

test('Verify Apply filters button functionality', async ({ page }) => {
  await page
    .locator('p.self-center.ml-4', { hasText: 'Standard current' })
    .click();
  await page.locator('p.self-center.ml-4', { hasText: 'Student' }).click();
  // Fill in the search field
  const searchInput = page.locator('input[type="search"]');
  await searchInput.waitFor({ state: 'visible' });
  await searchInput.fill('Santander');
  // Click the "Apply filters" button
  const applyButton = page.getByRole('button', { name: 'Apply filters' });
  await applyButton.waitFor({ state: 'visible' });
  await applyButton.click();

  await page.waitForLoadState();

  await expect(page).toHaveURL(/standardcurrent=on/);
  await expect(page).toHaveURL(/student=on/);
  await expect(page).toHaveURL(/q=Santander/);

  await expect(
    page.locator('div[data-testid="selected-accounts"]').first(),
  ).toContainText('Santander');
});

test('Verify Clear all link functionality', async ({ page }) => {
  await page.getByRole('link', { name: 'Clear all' }).click();
  await expect(page.locator('#standardcurrent')).not.toBeChecked();
  await expect(page.locator('#student')).not.toBeChecked();
  await expect(page.locator('#nomonthlyfee')).not.toBeChecked();
  await expect(page.locator('#branchbanking')).not.toBeChecked();
  await expect(page.locator('input[type="search"]')).toHaveValue('');
});
