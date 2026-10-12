import { expect, test } from '@playwright/test';

import { otherToolsToTry } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 52641
 * @test AC1: Verify retirement costs introductory copy below the page heading
 * @test AC2: Verify first Borrowing field heading copy
 */

test.describe('Retirement Budget Planner - Retirement costs final content changes (US 52641)', () => {
  test.beforeEach(async ({ page }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;
    const { pensionValue } = otherToolsToTry.income;

    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
  });

  test('AC1: Intro copy below the page heading reads correct text', async ({
    page,
  }) => {
    await retirementCostsPage.waitForRetirementCostsIntroText(page);

    const text = await retirementCostsPage.verifyRetirementCostsIntroText(page);
    expect(text).toBe(
      'Enter all the essential expenses you expect to pay after you retire, based on today\u2019s values.',
    );
  });

  test('AC2: First field heading in the Borrowing section is correct', async ({
    page,
  }) => {
    await retirementCostsPage.waitForRetirementCostsIntroText(page);
    await retirementCostsPage.clickAccordionSummary(page, 'Borrowing');

    const firstBorrowingLegend =
      retirementCostsPage.getFirstBorrowingFieldHeading(page);

    await expect(firstBorrowingLegend).toHaveText(
      'Credit card repayments (if you do not always repay in full)',
    );
  });
});
