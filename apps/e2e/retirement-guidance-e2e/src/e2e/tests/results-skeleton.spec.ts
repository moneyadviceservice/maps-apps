import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

/**
 * @tests User Story: 50724
 * @test Test Case 51242 : 50724 AC2 AC3 AC4 TEST CASE 2: Verify back link, Change answers button and two section headings display correctly
 * @test Test Case 51243: 50724 AC5 TEST CASE 3: Verify the Work out your retirement income and costs section displays with all three cards
 * @test Test Case 51244: 50724 AC6 AC7 AC8 TEST CASE 4: Verify all three cards open the correct URL in a new tab
 */

const sectionHeadings = [
  'What to do first',
  'What to focus on next',
  'Work out your retirement income and costs',
];

const cardTitles = [
  'Check how much is being paid into your workplace pension',
  'Create a retirement budget',
  'See your total retirement income',
];

const cardLinks = [
  'https://www.moneyhelper.org.uk/en/pensions-and-retirement/building-your-retirement-pot/workplace-pension-calculator',
  'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
  'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/pension-calculator',
];

test.describe('Retirement Guidance - Results Page', () => {
  test.beforeEach(async ({ page }) => {
    await questionnaireNavigator.skipToResults(page);
  });

  test('Results page loads successfully', async ({ page }) => {
    await expect(resultsPage.getPageHeading(page)).toBeVisible();
  });

  test('Back link navigates to Check your answers page', async ({ page }) => {
    await basePage.getBackLink(page).click();
    await expect(page).toHaveURL(/\/en\/change-options/);
  });

  test('Change answers button is visible below heading', async ({ page }) => {
    await expect(resultsPage.getChangeAnswersButton(page)).toBeVisible();
  });

  test('Section headings are visible in correct order', async ({ page }) => {
    for (const heading of sectionHeadings) {
      await expect(resultsPage.getSectionHeading(page, heading)).toBeVisible();
    }
  });

  test('All three cards are visible with correct titles', async ({ page }) => {
    for (const cardTitle of cardTitles) {
      await expect(resultsPage.getCardByTitle(page, cardTitle)).toBeVisible();
    }
  });

  test('Each card opens the correct URL in a new tab', async ({
    page,
    context,
  }) => {
    for (let i = 0; i < cardTitles.length; i++) {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        resultsPage.getCardLink(page, cardTitles[i]).click(),
      ]);
      await newPage.waitForLoadState();
      expect(newPage.url()).toBe(cardLinks[i]);
      await newPage.close();
    }
  });
});
