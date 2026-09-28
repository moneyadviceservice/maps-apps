import { expect, test } from '@playwright/test';

import { resultsHeading } from '../data/results';
import { retirementCostsHeading } from '../data/retirement-costs';
import { retirementIncomeHeading } from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 47657
 */

const runBaseKeyboardTest = () => {
  test('Verify all pages submit correctly with keyboard', async ({ page }) => {
    await expect(basePage.continueButton(page)).toHaveCount(1);

    await aboutYouPage.fillValuesAndContinue(
      page,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { continueWithKeyboard: true },
    );
    await expect(
      basePage.pageHeading(page, retirementIncomeHeading),
    ).toBeVisible();

    await retirementIncomePage.fillValuesAndContinue(page, '500', 'month', {
      continueWithKeyboard: true,
    });
    await expect(
      basePage.pageHeading(page, retirementCostsHeading),
    ).toBeVisible();

    await retirementCostsPage.fillValuesAndContinue(
      page,
      '500',
      'formmortgageRepaymentId',
      { continueWithKeyboard: true },
    );
    await expect(basePage.pageHeading(page, resultsHeading)).toBeVisible();
  });
};

test.describe('Retirement Budget Planner - Keyboard accessibility (JS enabled)', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  runBaseKeyboardTest();
});

test.describe('Retirement Budget Planner - Keyboard accessibility (JS disabled)', () => {
  test.use({ javaScriptEnabled: false });

  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page, {
      waitForNetworkSettle: false,
    });
  });

  runBaseKeyboardTest();
});
