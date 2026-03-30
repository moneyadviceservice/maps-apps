/**
 * @tests User Story 45486: Analytics – Salary Calculator : ACDL E2E Automation
 *
 * This suite validates the analytics “Page Load – React” event for the Salary Calculator.
 * It covers the following five end to end user journeys, includes verification of parameters, their values under the event for each test:
 *
 * • Landing page (Salary Calculator - start)
 * • Single calculation – Calculate
 * • Single calculation – Recalculate
 * • Compare two salaries – Calculate
 * • Compare two salaries – Recalculate
 */

import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { adobeDatalayer } from '../data/salCalcAdobeDatalayer';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';
import { SalaryCalculatorPage } from '../pages/SalaryCalculatorPage';
import { verifyDatalayer } from '../utils/salCalAcdlUtils';

test.describe('SalaryCalculator-Analytics', () => {
  const httpPassword = ENV.HTTP_PASSWORD;
  test.beforeEach(async ({ page, baseURL }) => {
    // Disable cookie consent using shared helper
    await SalaryCalculatorPage.disableCookieConsent(page);

    // Navigate to the base path
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Handle password-protected environments (Netlify or dev)
    if (
      baseURL &&
      (baseURL.includes('netlify.app') ||
        baseURL.includes('moneyhelper.org.uk'))
    ) {
      await netlifyPasswordPage.enterPassword(page, httpPassword);
    }

    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('DataLayer - pageLoadReact', async ({ page }) => {
    const locales = ['en', 'cy'] as const;

    const urls = [
      '',
      '?calculationType=single&isEmbed=false&language=en&recalculated=false&salary2_grossIncome=&salary2_grossIncomeFrequency=annual&salary2_hoursPerWeek=&salary2_daysPerWeek=&salary2_taxCode=&salary2_isScottishResident=false&salary2_pensionPercent=0&salary2_pensionFixed=&salary2_plan1=false&salary2_plan2=false&salary2_plan4=false&salary2_plan5=false&salary2_planPostGrad=false&salary2_isBlindPerson=&salary2_isOverStatePensionAge=&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=5&pensionFixed=&plan4=true&plan5=true&isOverStatePensionAge=true&isBlindPerson=true&calculate=&calculationType-mobile=single#results',
      '?calculationType=single&isEmbed=false&language=en&recalculated=true&salary2_grossIncome=&salary2_grossIncomeFrequency=annual&salary2_hoursPerWeek=&salary2_daysPerWeek=&salary2_taxCode=&salary2_isScottishResident=false&salary2_pensionPercent=&salary2_pensionFixed=0&salary2_plan1=false&salary2_plan2=false&salary2_plan4=false&salary2_plan5=false&salary2_planPostGrad=false&salary2_isBlindPerson=false&salary2_isOverStatePensionAge=false&grossIncome=32%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=5&pensionFixed=&plan4=true&isOverStatePensionAge=true&isBlindPerson=true&calculate=&calculationType-mobile=single#results',
      '?calculationType=joint&isEmbed=false&language=en&recalculated=false&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=&pensionPercent=&pensionFixed=&calculationType-mobile=joint&salary2_grossIncome=39%2C000&salary2_grossIncomeFrequency=annual&salary2_taxCode=&salary2_pensionPercent=&salary2_pensionFixed=&calculate=#results-comparison',
      '?calculationType=joint&isEmbed=false&language=en&recalculated=true&grossIncome=35%2C000&grossIncomeFrequency=annual&taxCode=1257L&pensionPercent=&pensionFixed=&calculationType-mobile=joint&salary2_grossIncome=39%2C000&salary2_grossIncomeFrequency=annual&salary2_taxCode=S1257L&salary2_pensionPercent=12&salary2_pensionFixed=&salary2_plan2=true&salary2_plan4=true&salary2_isOverStatePensionAge=true&salary2_isBlindPerson=true&calculate=#results-comparison',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        await test.step(`Verifying datalayer at ${expectedUrl}`, async () => {
          await page.goto(expectedUrl, { waitUntil: 'domcontentloaded' });
          expect(true).toBe(true);
          await verifyDatalayer(page, 'pageLoadReact', locale, values);
        });
      }
    }
  });
});
