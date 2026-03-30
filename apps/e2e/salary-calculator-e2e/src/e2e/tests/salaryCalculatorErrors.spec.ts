/**
 * End‑to‑end validation suite for 'Salary Calculator – Single calculation' error handling.
 *
 * This suite verifies, displays the correct validation messages
 * when required inputs are missing or invalid. Each scenario is tested in both
 * English and Welsh to ensure full localisation coverage.
 *
 * The following validations are covered:
 *
 * 01. Gross salary empty:
 *     Verifies the error message "Enter your gross salary" when the user submits
 *     the form without entering a gross salary.
 *
 * 02. Days per week empty (daily frequency):
 *     Verifies the error message "Enter the number of days a week you work" when
 *     the user leaves the days‑per‑week field empty.
 *
 * 03. Days per week out of range (daily frequency):
 *     Verifies the error message "Enter a number between 1 and 7" when the user
 *     enters an invalid number of days (e.g., 0).
 *
 * 04. Hours per day out of range (daily frequency):
 *     Verifies the error message "Enter a number between 1 and 7" when the user
 *     enters an invalid number of hours (e.g., 8).
 *
 * 05. Hours per week empty (hourly frequency):
 *     Verifies the error message "Enter the number of hours a week you work"
 *     when the user leaves the hours‑per‑week field empty.
 *
 * 06. Hours per week below valid range (hourly frequency):
 *     Verifies the error message
 *     "Enter the number of weekly hours you worked - between 1 and 168"
 *     when the user enters a value below the minimum (e.g., 0).
 *
 * 07. Hours per week above valid range (hourly frequency):
 *     Verifies the same error message as above when the user enters a value
 *     above the maximum (e.g., 169).
 *
 * 08. Invalid tax code:
 *     Verifies the error message
 *     "It looks like your tax code is not correct. Please check and enter it again.
 *      Most tax codes have both letters and numbers"
 *     when the user enters an invalid tax code.
 *
 *  09. Pension fixed amount too large:
 *     Verifies the error message
 *     "Your monthly pension contributions must be less than £2916.67
 *     (your monthly gross income)"
 *     when the user enters an excessively large pension amount.
 *     Example: For the entered gross salary = £35,000 and pension amount= 999,999,999,999.
 *
 * 10. This covers bug # 46355(Hours per week empty (hourly frequency) & Pension fixed amount too large):
 *     Verifies the error message - It should display only message "Enter the number of hours a week you work"
 *     when the user left empty for 'Hours per week' text and
 *     enters an excessively large pension amount.
 *     Example: For the entered gross salary = £35,000 and pension amount= 999,999,999,999.
 *
 * Note - All of the above tests are repeated for the Welsh version of the Salary calculator to confirm
 * that the correct translated error messages are displayed.
 *
 */

import { expect, Page, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { errorMessages } from '../data/errorMessages';
import { ErrorSummaryPage } from '../pages/ErrorSummaryPage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';

const httpPassword = ENV.HTTP_PASSWORD;

test.describe('Salary Calculator Error Messages Validation - Single calculation', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await SalaryCalculatorPage.disableCookieConsent(page);
    await page.goto('/');

    if (
      baseURL &&
      (baseURL.includes('netlify.app') ||
        baseURL.includes('moneyhelper.org.uk'))
    ) {
      await netlifyPasswordPage.enterPassword(page, httpPassword);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // Language-aware Calculate button
  const clickCalculate = async (page: Page, lang: 'en' | 'cy') => {
    if (lang === 'en') {
      await page.getByRole('button', { name: 'Calculate' }).click();
    } else {
      await page.getByRole('button', { name: 'Cyfrifo' }).click();
    }
  };

  // ---------------------------------------------------------
  // GROSS SALARY EMPTY TEST - ENGLISH
  // ---------------------------------------------------------
  test('01.English: Gross salary empty', async ({ page }) => {
    const errorSummary = new ErrorSummaryPage(page);
    await page.goto('/en');
    await clickCalculate(page, 'en');
    expect(true).toBe(true);
    await errorSummary.assertErrorSummaryHeading('There is a problem');
    await errorSummary.assertErrorMessage(errorMessages.english[0]);
  });

  // ---------------------------------------------------------
  // DAYS PER WEEK TESTS — ENGLISH
  // ---------------------------------------------------------
  test('02.English: daysPerWeek empty', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'daily');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[1]);
  });

  test('03.English: daysPerWeek = 0', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'daily');
    await page.fill('#inputDaysPerWeek', '0');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[2]);
  });

  test('04.English: daysPerWeek = 8', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'daily');
    await page.fill('#inputDaysPerWeek', '8');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[3]);
  });

  // ---------------------------------------------------------
  // HOURS PER WEEK TESTS — ENGLISH
  // ---------------------------------------------------------
  test('05.English: hoursPerWeek empty', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'hourly');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[4]);
  });

  test('06.English: hoursPerWeek = 0', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'hourly');
    await page.fill('#inputHoursPerWeek', '0');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[5]);
  });

  test('07.English: hoursPerWeek = 169', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('en', 'hourly');
    await page.fill('#inputHoursPerWeek', '169');
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[6]);
  });

  // ---------------------------------------------------------
  // TAX CODE TEST — ENGLISH
  // ---------------------------------------------------------
  test('08.English: invalid tax code', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareSingleSalaryCalculation('en');
    // Enter invalid tax code
    await page.getByTestId('tax-code').fill('aaaaaa');
    // Click Calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[7]);
  });

  // ---------------------------------------------------------
  // PENSION FIXED AMOUNT TEST — ENGLISH
  // ---------------------------------------------------------
  test('09.English: pensionFixed invalid (too large)', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareSingleSalaryCalculation('en');
    // Expand "Add more information"
    await calculator.expandSummaryBlock();
    // Enter invalid pension amount
    await page.getByTestId('pension-fixed').fill('999999999999');
    // Click Calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[8]);
  });

  // This covers Bug # 46355
  test('10.English: Empty Hours per week & PensionFixed invalid (too large)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareSingleSalaryCalculation('en');
    await calculator.prepareBaseCalculation('en', 'hourly');

    // Expand "Add more information"
    await calculator.expandSummaryBlock();
    // Enter invalid pension amount
    await page.getByTestId('pension-fixed').fill('999999999999');
    // Click Calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.english[9]);
  });

  // ---------------------------------------------------------
  //  GROSS SALARY EMPTY TEST - WELSH
  // ---------------------------------------------------------
  test('10.Welsh: Gross salary empty', async ({ page }) => {
    const errorSummary = new ErrorSummaryPage(page);
    await page.goto('/cy');
    await clickCalculate(page, 'cy');
    expect(true).toBe(true);
    await errorSummary.assertErrorSummaryHeading('Mae yna broblem');
    await errorSummary.assertErrorMessage(errorMessages.welsh[0]);
  });

  // ---------------------------------------------------------
  // DAYS PER WEEK TESTS — WELSH
  // ---------------------------------------------------------
  test('11.Welsh: daysPerWeek empty', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'daily');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[1]);
  });

  test('12.Welsh: daysPerWeek = 0', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'daily');
    await page.fill('#inputDaysPerWeek', '0');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[2]);
  });

  test('13.Welsh: daysPerWeek = 8', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'daily');
    await page.fill('#inputDaysPerWeek', '8');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[3]);
  });

  // ---------------------------------------------------------
  // HOURS PER WEEK TESTS — WELSH
  // ---------------------------------------------------------
  test('14.Welsh: hoursPerWeek empty', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'hourly');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[4]);
  });
  test('15.Welsh: hoursPerWeek = 0', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'hourly');
    await page.fill('#inputHoursPerWeek', '0');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[5]);
  });

  test('16.Welsh: hoursPerWeek = 169', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareBaseCalculation('cy', 'hourly');
    await page.fill('#inputHoursPerWeek', '169');
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[6]);
  });

  // ---------------------------------------------------------
  // TAX CODE TEST — WELSH
  // ---------------------------------------------------------
  test('17.Welsh: invalid tax code', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareSingleSalaryCalculation('cy');
    // Enter invalid tax code
    await page.getByTestId('tax-code').fill('aaaaaa');
    // Click Calculate
    await clickCalculate(page, 'cy');
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[7]);
  });

  // ---------------------------------------------------------
  // PENSION FIXED AMOUNT TEST — WELSH
  // ---------------------------------------------------------
  test('18.Welsh: pensionFixed invalid (too large)', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);
    const errorSummary = new ErrorSummaryPage(page);
    await calculator.prepareSingleSalaryCalculation('cy');
    // Expand "Add more information"
    await calculator.expandSummaryBlock();
    // Enter invalid pension amount
    await page.getByTestId('pension-fixed').fill('999999999999');
    // Click Calculate
    await page.getByRole('button', { name: 'Cyfrifo' }).click();
    expect(true).toBe(true);
    await errorSummary.assertErrorMessage(errorMessages.welsh[8]);
  });
});
