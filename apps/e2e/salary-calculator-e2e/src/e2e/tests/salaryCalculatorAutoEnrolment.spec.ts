import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { CalculationTypePage } from '../pages/CalculationTypePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';

const httpPassword = ENV.HTTP_PASSWORD;

test.describe('Salary Calculator E2E - Auto-enrolment tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await CalculationTypePage.disableCookieConsent(page);
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

  // TESTCASE - 57027
  test('Single calculation gross salary > 10000 and no pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('10000', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // TESTCASE - 57028
  test('Joint calculation gross salary > 10000 and no pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('10000', 1);
    await calculator.enterGrossIncome('15000', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // TESTCASE - 57029
  test('Single calculation gross salary > 10000 and 5% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('10000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('5', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // TESTCASE - 57652
  test('Joint calculation gross salary < 37430', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('10000', 1);
    await calculator.enterGrossIncome('15000', 2);

    await calculator.clickCalculate('joint');

    await expect(calculator.verifyBenefitsCallout()).resolves.not.toThrow();
  });

  // TESTCASE - 57651
  test('Single calculation gross salary < 37430', async ({ page }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('10000', 1);

    await calculator.clickCalculate();

    await expect(calculator.verifyBenefitsCallout()).resolves.not.toThrow();
  });

  // Single - Scenario 1
  test('Single calculation gross salary = 22000 and 5% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('22000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('5', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // Single - Scenario 2
  test('Single calculation gross salary = 22000 and 0% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('22000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Single - Scenario 3
  test('Single calculation gross salary = 7500 and 0% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('7500', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // Single - Scenario 4
  test('Single calculation gross salary = 23000 and 2% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('23000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('2', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // Single - Scenario 5
  test('Single calculation gross salary = 23000 and 0% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('23000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Single - Scenario 6
  test('Single calculation gross salary = 30000 and 0% pension', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('single');
    await calculator.enterGrossIncome('30000', 1);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);

    await calculator.clickCalculate();

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 1
  test('Joint calculation (salary1 = 22000 and 5% pension, salary2 = 8000 and pension 0%)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('22000', 1);
    await calculator.enterGrossIncome('8000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('5', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionPercent('0', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 2
  test('Joint calculation (salary1 = 22000 and 5% pension, salary2 = 8000 and pension £150)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('22000', 1);
    await calculator.enterGrossIncome('8000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionFixed('150', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 3
  test('Joint calculation (salary1 = 7500 and 0% pension, salary2 = 8000 and pension 0%)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('7500', 1);
    await calculator.enterGrossIncome('8000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionPercent('0', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(false),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 4
  test('Joint calculation (salary1 = 23000 and 2% pension, salary2 = 35000 and pension 0%)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('23000', 1);
    await calculator.enterGrossIncome('35000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('2', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionPercent('0', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 5
  test('Joint calculation (salary1 = 23000 and 0% pension, salary2 = 35000 and pension £350)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('23000', 1);
    await calculator.enterGrossIncome('35000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionFixed('350', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });

  // Joint - Scenario 6
  test('Joint calculation (salary1 = 23000 and 0% pension, salary2 = 35000 and pension 0%)', async ({
    page,
  }) => {
    const calculator = new SalaryCalculatorPage(page);

    await calculator.selectCalculationMode('joint');
    await calculator.enterGrossIncome('23000', 1);
    await calculator.enterGrossIncome('35000', 2);

    await calculator.expandSummaryBlock(1);
    await calculator.enterPensionPercent('0', 1);
    await calculator.expandSummaryBlock(2);
    await calculator.enterPensionPercent('0', 2);

    await calculator.clickCalculate('joint');

    await expect(
      calculator.verifyAutoEnrolmentCallout(),
    ).resolves.not.toThrow();
  });
});
