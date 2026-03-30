/**
 * @test ADO User Story #42395: Salary Calculator – Single Salary E2E Automation
 *
 * This suite validates the end‑to‑end functionality of the Single Salary Calculator.
 * It covers the following functionalities:
 *
 * • Various salary frequencies: Annual, Monthly, Weekly, Daily, Hourly
 * • Tax codes for both regions: England/NI/Wales and Scotland
 * • “Do you live in Scotland” toggle behaviour
 * • Optional “Extra Information” section:
 *      – Monthly pension contributions
 *      – Student loan repayment plans
 *      – State Pension Age
 *      – Blind Person’s Allowance
 * • Calculation and verification of estimated take‑home pay
 *
 * These tests ensure the calculator behaves correctly across all supported
 * input combinations defined in the test data set.
 */

import { expect, test } from '@playwright/test';
import { ENV } from '../data/environmentVariables';
import { testCases } from '../data/salCalcTestInputs';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';
import { applyBlindPerson } from '../utils/blindPersonUtils';
import { applyFrequencyDetails } from '../utils/frequencyUtils';
import { applyPension } from '../utils/pensionUtils';
import { applyStatePension } from '../utils/statePensionUtils';
import { applyStudentLoanPlans } from '../utils/studentLoanUtils';

const httpPassword = ENV.HTTP_PASSWORD;

test.describe('Salary Calculator E2E - Single Calculation', () => {
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

  for (const data of testCases) {
    test(`Calculate for £${data.grossIncome} (${data.frequency}) with tax code ${data.taxCode}`, async ({
      page,
    }) => {
      const calculator = new SalaryCalculatorPage(page);

      // Entering gross salary
      await calculator.enterGrossIncome(data.grossIncome);
      //Entering salary frequency
      await calculator.selectIncomeFrequency(data.frequency);

      // Handling number of days when user selects Weekly frequency
      // Handling number of hours
      await applyFrequencyDetails(
        calculator,
        data.frequency,
        data.daysPerWeek,
        data.hoursPerWeek,
      );

      //Select Scotland checkbox
      await calculator.toggleScotlandCheckbox(data.scotland);

      //Enter Tax code
      await calculator.enterTaxCode(data.taxCode);

      //For expanding 'Add more information' section
      await calculator.expandSummaryBlock();

      //Handling 'Monthly pension contributions'
      await applyPension(calculator, data.pensionPercent, data.pensionFixed);

      // Student loan plans
      await applyStudentLoanPlans(calculator, data.studentLoanPlans);

      // For 'State Pension Age'
      await applyStatePension(calculator, data.statePension);

      //For 'Blind person's allowance'
      await applyBlindPerson(calculator, data.blindPerson);

      // For calculate
      await calculator.clickCalculate();

      // Verify results
      await expect(
        calculator.verifyBreakdownSections(data.expectedBreakdown),
      ).resolves.not.toThrow();
    });
  }
});
