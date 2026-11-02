/**
 * AC1 - An emergency tax code (any code ending in W1, M1 or X) on a single
 *       salary calculation shows the "You are likely paying more tax than you
 *       need to" callout with the results for en & cy.
 * AC2 - The callout(emergency tax code & K prefix tax code) is not shown when comparing two salaries for en & cy.
 *
 * AC3 - A tax code with a K prefix (e.g. K7000, K6500) on a single salary
 *       calculation shows the "Your tax code has triggered a 50% tax cap"
 *       callout with the results for en & cy.
 */

import { expect, test } from '@playwright/test';

import { TAX_CODE_CALLOUTS } from '../data/salCalcTestInputs';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';

const languages = [
  { code: 'en', path: '/en' },
  { code: 'cy', path: '/cy' },
] as const;

languages.forEach(({ code, path }) => {
  test.describe(`${code.toUpperCase()} - Salary Calculator Tax Code Callouts`, () => {
    test.beforeEach(async ({ page }) => {
      await SalaryCalculatorPage.disableCookieConsent(page);
      await page.goto(path);
      await page.setViewportSize({ width: 1440, height: 900 });
    });

    test('AC1 - shows emergency tax code callout', async ({ page }) => {
      const calculator = new SalaryCalculatorPage(page);

      await calculator.calculateSalary('35000', '1257L W1');

      await expect(page.getByTestId('results-section')).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.emergency.heading[code],
        }),
      ).toBeVisible();
    });

    test('AC2 - does not show tax code callouts when comparing two salaries', async ({
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
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.emergency.heading[code],
        }),
      ).toHaveCount(0);

      await expect(
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.kCode.heading[code],
        }),
      ).toHaveCount(0);
    });

    // US # 60342 (Salary calculator: Add Callout when income tax over 50%)
    test('AC3 - shows the callout for a tax code with a K prefix', async ({
      page,
    }) => {
      const calculator = new SalaryCalculatorPage(page);

      await calculator.calculateSalary('79000', 'K7000');

      await expect(page.getByTestId('results-section')).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.kCode.heading[code],
        }),
      ).toBeVisible();
    });
  });
});
