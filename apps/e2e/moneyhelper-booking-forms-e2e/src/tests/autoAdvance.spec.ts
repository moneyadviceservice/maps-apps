import { StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { BasePage } from '@mhbf-e2e/pages/BasePage';
import { DefinedContributionPage } from '@mhbf-e2e/pages/Eligibility';

test.describe('Auto Advance Logic', () => {
  /**
- 
@tests 59290 - Navigate to the eligibility step with ?aa=pw parameter
   */

  test('auto advances to the correct flow and page based for the Pension Wise parameter', async ({
    page,
  }) => {
    const definedContributionPage = new DefinedContributionPage(page);

    // Navigate to the eligibility defined contribution page
    await definedContributionPage.goToEligibilityDefinedContribution();

    // Assert
    await expect(
      definedContributionPage.pageTitle(
        StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
      ),
    ).toBeVisible();
  });

  test('follows the default flow when an invalid auto advance query parameter is provided', async ({
    page,
  }) => {
    const basePage = new BasePage(page);

    // Navigate to the root page with an invalid auto advance query parameter
    await basePage.gotoHome('?aa=dud');

    // Wait for the page to load with the invalid auto advance query parameter
    await page.waitForURL('/en?aa=dud', {
      timeout: 20000,
    });

    // Assert the default appointment-type heading, avoiding a duplicate test ID.
    await expect(
      basePage.pageTitle(
        StepName.APPOINTMENT_TYPE,
        'What would you like to discuss?',
      ),
    ).toBeVisible();
  });
});
