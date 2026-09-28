/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36693
 *  * User Story: 36695
 * E2E Test: User Journey for  E2E Automation: 1 DC, 1 DB & 1 POSS pensions are displayed in the Red & Yellow Channels
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user with 2 pensions in yellow channel and one pension in red channel.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'pending-pensions' page
 *   - AC3: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pending Pension page
 *   - AC5: User navigates back to the Pensions found page
 *   - AC6: User Navigates to the 'pensions-that-need-action' page
 *   - AC7: User Clicks 'show contact details' link
 *   - Unsupported pensions are not shown on the dashboard
 *   - Unsupported pension types are returned from the backend but not displayed
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - yellowPensionHelpers
 *   - redPensionHelpers
 *   - commHelpers
 *   - authentication
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: Red and Yellow Pensions combined  @e2e', async ({
    commonHelpers,
    pendingPensionsPage,
    pensionBreakdownPage,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'redAndYellow',
      commonHelpers,
    );

    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel();
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions();
      await pendingPensionsPage.pageLoads();
      await verifyYellowPension(
        commonHelpers,
        pensionBreakdownPage,
        page,
        request,
      );
      await pensionsFoundPage.waitForPensionsFound();
    }
    const redChannelExists = await pensionsFoundPage.hasRedChannel();
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage();
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails();
      await assertRedPensionCalloutTextFromArrangement(
        pensionsThatNeedActionPage,
        page,
        request,
      );
      await commonHelpers.clickHomeLink();
      await pensionsFoundPage.waitForPensionsFound();
    }
  });
});
