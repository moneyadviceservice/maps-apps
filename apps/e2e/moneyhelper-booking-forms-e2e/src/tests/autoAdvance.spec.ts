import { StepName } from '@app/lib/constants';
import { DefinedContributionPage } from '@pages/Eligibility';

import { expect, test } from '../fixtures/test.fixtures';
import { BasePage } from '../pages/BasePage';
let basePage: BasePage;

test.describe(`Auto Advance Logic`, () => {
  /**
   * @tests 59290 - Navigate to the eligibility step with ?aa=pw parameter
   */

  test('auto advances to the correct flow and page based for the Pension Wise parameter', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    const definedContributionPage = new DefinedContributionPage(page);
    // Navigate to the eligibility defined contribution page
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Assert
    await expect(
      page.getByTestId(`${StepName.ELIGIBILITY_DEFINED_CONTRIBUTION}-title`),
    ).toBeVisible();
  });

  test('follows the default flow when an invalid auto advance query parameter is provided', async ({
    page,
  }) => {
    basePage = new BasePage(page);
    // Navigate to the root page with an invalid auto advance query parameter
    await basePage.gotoHome('?aa=dud');

    // Wait for the page to load with the invalid auto advance query parameter
    await page.waitForURL(`/en?aa=dud`, {
      timeout: 20000,
    });

    // Assert - check :visible due to potential multiple elements with the same data-testid (NoJsNotice component)
    await expect(
      page.locator(
        `[data-testid="${StepName.APPOINTMENT_TYPE}-title"]:visible`,
      ),
    ).toBeVisible();
  });
});
