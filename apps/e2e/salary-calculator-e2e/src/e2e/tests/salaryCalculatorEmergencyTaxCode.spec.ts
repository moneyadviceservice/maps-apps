/**
 * AC1 - An emergency tax code (any code ending in W1, M1 or X) on a single
 *       salary calculation shows the "You are likely paying more tax than you
 *       need to" callout with the results.
 * AC2 - The callout is not shown when comparing two salaries.
 *
 * The remaining AC2 cases (no tax code, non-emergency tax code) are covered by
 * unit tests in apps/salary-calculator.
 */

import { expect, test } from '@playwright/test';

import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';

const calloutHeading = 'You are likely paying more tax than you need to';

test.describe('Salary Calculator E2E - Emergency tax code guidance', () => {
  test.beforeEach(async ({ page }) => {
    await SalaryCalculatorPage.disableCookieConsent(page);
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('AC1 - shows the callout for an emergency tax code', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.enterGrossIncome('35000');
    await calculator.enterTaxCode('1257L W1');
    await calculator.clickCalculate();

    await expect(page.getByTestId('results-section')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: calloutHeading }),
    ).toBeVisible();
  });

  test('AC2 - does not show the callout when comparing two salaries', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');

    await calculator.enterGrossIncome('35000', 1);
    await calculator.enterTaxCode('1257L W1', 1);

    await calculator.enterGrossIncome('40000', 2);
    await calculator.enterTaxCode('1257L M1', 2);

    await calculator.clickCalculate('joint');

    await expect(page.locator('#results-comparison')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: calloutHeading }),
    ).toHaveCount(0);
  });
});
