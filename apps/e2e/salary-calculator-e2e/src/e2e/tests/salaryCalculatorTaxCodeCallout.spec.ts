/**
 * AC1 - An emergency tax code (any code ending in W1, M1 or X) on a single
 *       salary calculation shows the related callout for en & cy.
 *
 * AC2 - Emergency tax code and K prefix tax code callouts are not shown
 *       when comparing two salaries for en & cy.
 *
 * AC3 - A tax code with a K prefix (e.g. K7000, K6500) on a single salary
 *       calculation shows the 50% tax cap callout for en & cy.
 *
 * * AC4 - A salary of £50,272 in England, Wales and Northern Ireland with
 *       pension contributions shows the Higher Rate Tax Relief callout
 *       for en & cy.
 *
 *  AC5 - A salary of £29,528 in Scotland with pension contributions shows
 *       the Higher Rate Tax Relief callout for en & cy.
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

    // US #59778 (Salary Calculator: Show higher rate tax relief callout for higher rate taxpayers in England, Wales and Northern Ireland)
    test('AC4 - shows higher rate tax relief callout for salary £50,272 with pension contributions', async ({
      page,
    }) => {
      const calculator = new SalaryCalculatorPage(page);

      await calculator.enterGrossIncome('50272');

      await calculator.expandSummaryBlock();
      await calculator.enterPensionPercent('5');

      await calculator.clickCalculate();

      await expect(page.getByTestId('results-section')).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.higherRateTaxRelief.heading[code],
        }),
      ).toBeVisible();
    });

    // US #59778 (Salary Calculator: Show higher rate tax relief callout for higher rate taxpayers in Scotland)
    test('AC5 - shows higher rate tax relief callout for higher rate taxpayers in Scotland', async ({
      page,
    }) => {
      const calculator = new SalaryCalculatorPage(page);

      await calculator.enterGrossIncome('29528');

      await calculator.toggleScotlandCheckbox(true);

      await calculator.expandSummaryBlock();
      await calculator.enterPensionPercent('5');

      await calculator.clickCalculate();

      await expect(page.getByTestId('results-section')).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: TAX_CODE_CALLOUTS.higherRateTaxRelief.heading[code],
        }),
      ).toBeVisible();
    });
  });
});
