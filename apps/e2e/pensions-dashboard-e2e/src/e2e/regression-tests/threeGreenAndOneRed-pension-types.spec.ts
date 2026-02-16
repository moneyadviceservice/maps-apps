/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36692
 * E2E Test: User Journey for three green pensions (one state pension, two DC) and one possible pension (red channel)
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey for a user with three green pensions and one possible pension.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - State pension
 *   - AC4: User navigates to the Pension details page - DC/DB pension
 *   - AC5: User navigates back to the Pension breakdown page
 *   - AC6: User navigates back to the Pensions found page
 *   - AC7: User Navigates to the 'pensions-that-need-action' page
 *   - AC8: User Clicks 'show contact details link
 *   - Navigation to pension breakdown and back
 *   - Contact details for red channel can be shown/hidden
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PensionThatNeedActionPage
 *   - greenPensionHelpers
 *   - redPensionHelper
 *   - commHelpers
 *   - authentication
 */

import { test } from '@maps/playwright';

import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: Three (3) green Pension (One State Pension and 2 DC) and One Possible Pension  @newTest', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'lumpSumTest');

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, request);
      await pensionsFoundPage.waitForPensionsFound(page);
    }

    const redChannelExists = await pensionsFoundPage.hasRedChannel(page);
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage(
        page,
      );
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails(page);
      await assertRedPensionCalloutTextFromArrangement(page, request);
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
