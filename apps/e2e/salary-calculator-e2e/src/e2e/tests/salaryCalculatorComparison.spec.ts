import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { comparisonTestCases } from '../data/salCalcComparisonInputs';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';
import { applyBlindPerson } from '../utils/blindPersonUtils';
import { applyFrequencyDetails } from '../utils/frequencyUtils';
import { applyPension } from '../utils/pensionUtils';
import { applyStatePension } from '../utils/statePensionUtils';
import { applyStudentLoanPlans } from '../utils/studentLoanUtils';

const httpPassword = ENV.HTTP_PASSWORD;

test.describe('Salary Calculator Comparison E2E', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await SalaryCalculatorPage.disableCookieConsent(page);
    await page.goto('/');

    // Handle password-protected environments (Netlify or dev)
    if (
      baseURL &&
      (baseURL.includes('netlify.app') ||
        baseURL.includes('moneyhelper.org.uk'))
    ) {
      await netlifyPasswordPage.enterPassword(page, httpPassword);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const data of comparisonTestCases) {
    test(`${data.description}`, async ({ page }) => {
      const calculator = new SalaryCalculatorPage(page);

      // Select "Compare two salaries" mode
      await calculator.selectCalculationMode('joint');

      // Fill in Salary 1 details
      await calculator.enterGrossIncome(data.salary1.grossIncome, 1);
      await calculator.selectIncomeFrequency(data.salary1.frequency, 1);

      // Handle number of days for daily frequency, hours for hourly frequency for Salary 1
      await applyFrequencyDetails(
        calculator,
        data.salary1.frequency,
        data.salary1.daysPerWeek,
        data.salary1.hoursPerWeek,
        1,
      );

      // Select Scotland checkbox for salary 1
      await calculator.toggleScotlandCheckbox(data.salary1.scotland, 1);

      // Enter tax code for salary 1
      await calculator.enterTaxCode(data.salary1.taxCode, 1);

      // Fill in Salary 2 details
      await calculator.enterGrossIncome(data.salary2.grossIncome, 2);
      await calculator.selectIncomeFrequency(data.salary2.frequency, 2);

      // Handle number of days for daily frequency, hours for hourly frequency for Salary 2
      await applyFrequencyDetails(
        calculator,
        data.salary2.frequency,
        data.salary2.daysPerWeek,
        data.salary2.hoursPerWeek,
        2,
      );

      // Select Scotland checkbox for salary 2
      await calculator.toggleScotlandCheckbox(data.salary2.scotland, 2);

      // Enter tax code for salary 2
      await calculator.enterTaxCode(data.salary2.taxCode, 2);

      // Expand 'Add more information' sections for both salaries
      await calculator.expandSummaryBlock(1);
      await calculator.expandSummaryBlock(2);

      // Handle pension contributions for salary 1
      await applyPension(
        calculator,
        data.salary1.pensionPercent,
        data.salary1.pensionFixed,
        1,
      );

      // Handle pension contributions for salary 2
      await applyPension(
        calculator,
        data.salary2.pensionPercent,
        data.salary2.pensionFixed,
        2,
      );

      // Student loan plans for salary 1
      await applyStudentLoanPlans(calculator, data.salary1.studentLoanPlans, 1);

      // Student loan plans for salary 2
      await applyStudentLoanPlans(calculator, data.salary2.studentLoanPlans, 2);

      // State Pension Age for salary 1
      await applyStatePension(calculator, data.salary1.statePension, 1);

      // State Pension Age for salary 2
      await applyStatePension(calculator, data.salary2.statePension, 2);

      // Blind person's allowance for salary 1
      await applyBlindPerson(calculator, data.salary1.blindPerson, 1);

      // Blind person's allowance for salary 2
      await applyBlindPerson(calculator, data.salary2.blindPerson, 2);

      // Click Calculate (joint mode uses different button selector)
      await calculator.clickCalculate('joint');

      // Verifying comparison results table(Verifying monthly take home pay of Salary 1 & Salary 2)
      await expect(
        calculator.verifyComparisonTable(data.expectedComparison),
      ).resolves.toBeUndefined();
    });
  }
});
