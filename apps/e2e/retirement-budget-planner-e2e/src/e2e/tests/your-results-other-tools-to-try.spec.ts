import { expect, test } from '@playwright/test';

import { otherToolsToTry, pageHeading } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 44562
 * @test 49248: 44562 AC1 TEST CASE 1: Verify 'Other tools to try" cards are visible on the Your results page
 * @test 49249: 44562 AC2 TEST CASE 2: Verify Budget planner card navigates to correct URL
 * @test 49251: 44562 AC3 TEST CASE 3: Verify 'Pension calculator' card navigates to correct URL
 * @test 49252: 44562 AC4 TEST CASE 4: Verify 'Benefits calculator' card navigates to correct URL
 */

test.describe('Retirement Budget Planner - Your results page - Other tools to try', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify Other tools to try card - Pension calculator', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;
    const { pensionValue } = otherToolsToTry.income;
    const { mortgageRepayment } = otherToolsToTry.cost;
    const expectedPensionCalculator =
      otherToolsToTry.expected.pensionCalculator;
    const expectedBenefitsCalculator =
      otherToolsToTry.expected.benefitsCalculator;
    const expectedBudgetPlanner = otherToolsToTry.expected.budgetPlanner;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    await basePage.waitForPageHeading(page, pageHeading);
    await expect(resultsPage.getOtherToolsHeader(page)).toBeVisible();
    await expect(resultsPage.getTeaserCards(page)).toHaveCount(3);

    const pensionLink = resultsPage.getTeaserCardLink(
      page,
      expectedPensionCalculator.title,
    );
    await expect(pensionLink).toBeVisible();
    const [pensionPage] = await Promise.all([
      page.waitForEvent('popup'),
      pensionLink.click(),
    ]);
    await expect(pensionPage).toHaveURL(expectedPensionCalculator.link);
    await pensionPage.close();

    const benefitsLink = resultsPage.getTeaserCardLink(
      page,
      expectedBenefitsCalculator.title,
    );
    await expect(benefitsLink).toBeVisible();
    const [benefitsPage] = await Promise.all([
      page.waitForEvent('popup'),
      benefitsLink.click(),
    ]);
    await expect(benefitsPage).toHaveURL(expectedBenefitsCalculator.link);
    await benefitsPage.close();

    const budgetPlannerLink = resultsPage.getTeaserCardLink(
      page,
      expectedBudgetPlanner.title,
    );
    await expect(budgetPlannerLink).toBeVisible();
    const [budgetPage] = await Promise.all([
      page.waitForEvent('popup'),
      budgetPlannerLink.click(),
    ]);
    await expect(budgetPage).toHaveURL(expectedBudgetPlanner.link);
    await budgetPage.close();
  });
});
