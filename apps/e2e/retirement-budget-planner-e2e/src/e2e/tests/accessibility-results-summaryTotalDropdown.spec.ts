import { expect, test } from '@playwright/test';

import { pageHeading, summaryTotal } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 50538
 * @description Accessibility test for Summary Total Dropdown on Results page
 * Tests verify that the dropdown element has proper aria-label attribute for accessibility
 */
test.describe('Retirement Budget Planner - Summary Total Dropdown Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });

    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.income.amount,
      summaryTotal.inputValues.income.frequency,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      summaryTotal.inputValues.costs.amount,
      summaryTotal.inputValues.costs.formInputTestId,
    );
    await basePage.waitForPageHeading(page, pageHeading);
  });

  test('Summary Total dropdown has aria-label attribute', async ({ page }) => {
    const summaryDropdown = page.locator(
      'select[data-testid="t-summary-options"]',
    );

    await expect(summaryDropdown).toBeVisible();

    await expect(summaryDropdown).toHaveAttribute('aria-label', /.+/);

    const ariaLabel = await summaryDropdown.getAttribute('aria-label');
    expect(ariaLabel?.length).toBeGreaterThan(0);
  });
});
