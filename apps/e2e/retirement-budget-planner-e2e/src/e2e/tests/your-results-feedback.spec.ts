import { expect, test } from '@playwright/test';

import { pageHeading } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 44432
 * @tests Test Case 49140: Verify feedback integration mount point on results page
 * @tests Test Case 49145: Verify Informizely setup scripts are present on results page
 * @tests Test Case 49153: Verify feedback mount point uses expected survey id mapping
 */

test.describe('Retirement Budget Planner - Your results page - Feedback component', () => {
  const feedbackContainer = (page) =>
    page.locator('[id^="informizely-embed-"]');

  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.fillValuesAndContinue(page, '5000');
    await retirementCostsPage.fillValuesAndContinue(
      page,
      '2000',
      'formmortgageRepaymentId',
    );
    await basePage.waitForPageHeading(page, pageHeading);
  });

  test('Verify feedback integration mount point is rendered on results page', async ({
    page,
  }) => {
    await expect(feedbackContainer(page)).toHaveCount(1);
    await expect(feedbackContainer(page)).toHaveAttribute(
      'id',
      /^informizely-embed-/,
    );
  });

  test('Verify Informizely setup scripts are present on results page', async ({
    page,
  }) => {
    await expect(page.locator('script#informizely-script-tag')).toHaveCount(1);
    await expect(page.locator('script#_informizely_script_tag')).toHaveCount(1);
  });

  test('Verify feedback mount point uses expected survey id mapping', async ({
    page,
  }) => {
    await expect(feedbackContainer(page)).toHaveAttribute(
      'id',
      /informizely-embed-(ujqnyilh|fjguluwfj|uljyrlhlk|zjiieufr)$/,
    );
  });
});
