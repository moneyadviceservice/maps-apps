import { SalaryCalculatorPage } from 'e2e/pages/SalaryCalculatorPage';
import { expect, test } from '@playwright/test';

import { ENV } from '../data/environmentVariables';
import { CalculationTypePage } from '../pages/CalculationTypePage';
import { netlifyPasswordPage } from '../pages/NetlifyPasswordPage';

const httpPassword = ENV.HTTP_PASSWORD;

test.describe('Salary Calculator E2E - Calculation Type Selection Page', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await CalculationTypePage.disableCookieConsent(page);
    await page.goto('/en/b');

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

  test('Selecting single calculation type', async ({ page }) => {
    const calculationTypePage = new CalculationTypePage(page);

    await calculationTypePage.selectCalculationMode('single');
    await calculationTypePage.clickContinue();

    await page.waitForURL(/(\/en|\/cy)/);
    await expect(page).toHaveURL(/calculationType=single/);
    await expect(page).toHaveURL(/ab_source=b/);

    const salaryCalculatorPage = new SalaryCalculatorPage(page);
    await salaryCalculatorPage.verifyBackLinkHref('/en/b');
  });

  test('Selecting joint calculation type', async ({ page }) => {
    const calculationTypePage = new CalculationTypePage(page);

    await calculationTypePage.selectCalculationMode('joint');
    await calculationTypePage.clickContinue();

    await page.waitForURL(/(\/en|\/cy)/);
    await expect(page).toHaveURL(/calculationType=joint/);
    await expect(page).toHaveURL(/ab_source=b/);

    const salaryCalculatorPage = new SalaryCalculatorPage(page);
    await salaryCalculatorPage.verifyBackLinkHref('/en/b');
  });
});
