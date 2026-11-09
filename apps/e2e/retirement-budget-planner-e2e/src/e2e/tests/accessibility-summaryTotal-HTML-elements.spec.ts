import { test } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';
import summaryTotalPage from '../pages/SummaryTotalPage';

/**
 * @tests User Story 50529
 * @tests Test Case 51889 : 50529 AC1 AC2 TEST CASE 1: Verify the Summary Total section on both pages uses correct descriptive list HTML elements
 */

test.describe('Retirement Budget Planner - Summary Total HTML Elements Accessibility', () => {
  test.describe('Summary Total on Retirement Income Page', () => {
    test.beforeEach(async ({ page }) => {
      await homePage.startRetirementBudgetPlanner(page);
      await homePage.handleCookies(page);
      await aboutYouPage.fillValuesAndContinue(page);

      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/income/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, 'Retirement income');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('Summary Total HTML structure is valid and accessible', async ({
      page,
    }) => {
      await summaryTotalPage(page).verifySummaryTotalStructure();
    });
  });

  test.describe('Summary Total on Retirement Costs Page', () => {
    test.beforeEach(async ({ page }) => {
      await homePage.startRetirementBudgetPlanner(page);
      await homePage.handleCookies(page);
      await aboutYouPage.fillValuesAndContinue(page);

      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/income/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, 'Retirement income');
      await retirementIncomePage.fillValuesAndContinue(page, '500', 'year');

      await page.waitForLoadState('load');
      await page.waitForURL(/\/en\/essential-outgoings/, { timeout: 10000 });
      await basePage.waitForPageHeading(page, retirementCostsHeading);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('Summary Total HTML structure is valid and accessible', async ({
      page,
    }) => {
      await summaryTotalPage(page).verifySummaryTotalStructure();
    });
  });
});
