import { expect, test } from '@playwright/test';

import {
  retirementCostsErrorMessage,
  retirementCostsErrorMessageWelsh,
  retirementCostsHeading,
} from '../data/retirement-costs';
import {
  retirementIncomeErrorMessage,
  retirementIncomeErrorMessageWelsh,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 50538
 * @tests Test Case 51540 : 50538 AC1 TEST CASE 1: Verify error messages on the retirement income page English & Welsh
 * @tests Test Case 51541 : 50538 AC2 TEST CASE 2: Verify error messages on the retirement cost page English & Welsh
 */
test.describe('Retirement Budget Planner - Error Messages Accessibility (Income & Costs)', () => {
  test.describe('Retirement Income Page - Error Messages', () => {
    test.beforeEach(async ({ page }) => {
      // Start the retirement budget planner and navigate to income page
      await homePage.startRetirementBudgetPlanner(page);
      await homePage.handleCookies(page);
      await aboutYouPage.fillValuesAndContinue(page);

      // Wait for retirement income page
      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/income/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, 'Retirement income');
    });

    test('Should display error message in English when continuing without entering income data', async ({
      page,
    }) => {
      // Click continue without filling in any data
      await basePage.continueButton(page).click();

      // Verify error heading is visible
      await expect(basePage.getErrorSummaryLink(page)).toBeVisible();
      await expect(basePage.getErrorSummaryLink(page)).toHaveText(
        retirementIncomeErrorMessage,
      );
    });

    test('Should display error message in Welsh when continuing without entering income data', async ({
      page,
    }) => {
      // Switch to Welsh language
      await homePage.clickWelshLink(page);
      await page.waitForURL(/\/cy\/income/);

      // Click continue without filling in any data
      await basePage.continueButton(page).click();

      // Verify Welsh error message
      await expect(basePage.getErrorSummaryLink(page)).toBeVisible();
      await expect(basePage.getErrorSummaryLink(page)).toHaveText(
        retirementIncomeErrorMessageWelsh,
      );
    });
  });

  test.describe('Retirement Costs Page - Error Messages', () => {
    test.beforeEach(async ({ page }) => {
      // Start the retirement budget planner and navigate to costs page
      await homePage.startRetirementBudgetPlanner(page);
      await homePage.handleCookies(page);
      await aboutYouPage.fillValuesAndContinue(page);

      // Wait for retirement income page and fill it
      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/income/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, 'Retirement income');
      await retirementIncomePage.fillValuesAndContinue(page, '500', 'year');

      // Wait for retirement costs page
      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/essential-outgoings/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, retirementCostsHeading);
    });

    test('Should display error message in English when continuing without entering costs data', async ({
      page,
    }) => {
      // Click continue without filling in any data
      await basePage.continueButton(page).click();

      // Verify error heading is visible
      await expect(basePage.getErrorSummaryLink(page)).toBeVisible();
      await expect(basePage.getErrorSummaryLink(page)).toHaveText(
        retirementCostsErrorMessage,
      );
    });

    test('Should display error message in Welsh when continuing without entering costs data', async ({
      page,
    }) => {
      // Switch to Welsh language
      await homePage.clickWelshLink(page);
      await page.waitForURL(/\/cy\/essential-outgoings/);

      // Click continue without filling in any data
      await basePage.continueButton(page).click();

      // Verify Welsh error message
      await expect(basePage.getErrorSummaryLink(page)).toBeVisible();
      await expect(basePage.getErrorSummaryLink(page)).toHaveText(
        retirementCostsErrorMessageWelsh,
      );
    });
  });
});
