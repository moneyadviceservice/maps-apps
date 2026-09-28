import { expect, test } from '@playwright/test';

import homePage from '../pages/HomePage';
import questionnaireNavigator from '../pages/questionnaireNavigator';
import resultsPage from '../pages/resultsPage';

/**
 * @test User Story 57694: Update Retirement Budget Planner CTA with Budget Planner
 * @test 57767 : 57694 AC1, AC2 Test Case 1 : Verify Second CTA tab in 'Work out your retirement income and costs' section - EN
 *
 * Summary: Verify that the second CTA card in 'Work out your retirement income and costs'
 * section contains the correct heading, description text, and link pointing to Budget Planner
 */

test.describe('Results Page - Second CTA Card Verification', () => {
  test('AC1: Verify Second CTA tab heading is "Create a retirement budget" - EN', async ({
    page,
  }) => {
    // Navigate through questionnaire to reach results page
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToResults(page);
    await resultsPage.waitForPage(page);

    // Verify second CTA card heading
    const secondCTAHeading = resultsPage.getSecondCTAHeading(page);
    await expect(secondCTAHeading).toBeVisible();
    await expect(secondCTAHeading).toContainText('Create a retirement budget');
  });

  test('AC2: Verify Second CTA content and link - EN', async ({ page }) => {
    // Navigate through questionnaire to reach results page
    await homePage.startRetirementGuidance(page);
    await questionnaireNavigator.skipToResults(page);
    await resultsPage.waitForPage(page);

    // Get second CTA card
    const secondCTACard = resultsPage.getSecondCTACard(page);
    await expect(secondCTACard).toBeVisible();

    // Verify heading
    const heading = resultsPage.getSecondCTAHeading(page);
    await expect(heading).toContainText('Create a retirement budget');

    // Verify description contains expected text about budget planner
    const description = resultsPage.getSecondCTADescription(page);
    await expect(description).toContainText(
      'To see how much retirement income you might need, use our free budget planner to list all your likely costs after you retire.',
    );

    // Verify link
    const link = resultsPage.getSecondCTALink(page);
    await expect(link).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    );
    await expect(link).toHaveAttribute('target', '_blank');
  });
});
