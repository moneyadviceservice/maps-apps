import { expect, test } from '@lib/test.lib';
import { ResultsComponent } from '@pages/components/results.component';

test.describe('Check Another Pension Link - Navigation Test', () => {
  let resultsComponent: ResultsComponent;

  test.beforeEach(async ({ page }) => {
    resultsComponent = new ResultsComponent(page);
  });

  test('AC1: "Check another pension" link directs user to Question 1 - EN', async ({
    page,
  }) => {
    // Navigate to results page with sample query parameters
    await resultsComponent.gotoResults('en', 'q-1=0&q-2=0');
    await resultsComponent.waitForResultsPage();

    // Verify "Check another pension" link is visible
    const checkAnotherPensionLink = resultsComponent.checkAnotherPensionLink;
    await expect(checkAnotherPensionLink).toBeVisible();

    // Verify link text
    await expect(checkAnotherPensionLink).toHaveText('check another pension');

    // Click the link
    await checkAnotherPensionLink.click();

    // Verify navigation to Question 1
    await expect(page).toHaveURL(/\/en\/pension-type\/question-1/);
  });
});
