/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 36697
 * User Story: 36659
 * E2E Test: User Journey for all pension types (Green, Yellow, Red, and Unsupported)
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where the user has a combination of green, yellow, red, and unsupported pension types returned from the backend.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC1.1: Verified verify Timeline values
 *   - AC1.2: Summary Statements
 *   - AC2: User navigates to the pension breakdown page for green pensions
 *   - AC3: User navigates to the pending pensions page for yellow pensions
 *   - AC4: User navigates to the pensions that need action page for red pensions
 *   - AC5: User can view and hide contact details for red pensions
 *   - AC6: All expected unsupported pension types are returned from the backend but not displayed in the UI
 *   - AC7: Data mapping and details for each pension type are validated
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PendingPensionPage
 *   - PensionThatNeedActionPage
 *   - greenPensionHelpers
 *   - yellowPensionHelpers
 *   - redPensionHelper
 *   - commHelpers
 *   - authentication
 *   - request
 *   - types
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';
import { verifyUnsupportedPensions } from '../utils/unsupportedPensionsHelpers';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: All supported pension types and unsupported pensions type @e2e', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'combinedPensions_PC_V4',
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      await TimelineHelper.verifyTimelineValues(page, request);
      await GreenPensionsHelper.verifyGreenPensions(page, request);
    }

    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel(page);
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions(page);
      await pendingPensionsPage.pageLoads(page);
      await verifyYellowPension(page, request);
    }

    const redChannelExists = await pensionsFoundPage.hasRedChannel(page);
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage(
        page,
      );
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails(page);
      await assertRedPensionCalloutTextFromArrangement(page, request);
      await commonHelpers.clickHomeLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }

    const unsupportedPensionsExists =
      await pensionsFoundPage.unsupportedPensionsCallOut(page);
    if (unsupportedPensionsExists) {
      await verifyUnsupportedPensions(page, request);
    }
  });
});
