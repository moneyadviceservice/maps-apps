/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * E2E Test: Display of '--' for Missing Mandatory Pension Information
 *
 * @scope e2e-Scenarios
 *
 * This test verifies that when mandatory information is not available for all supported pension types (across Green, Yellow, and Red channels),
 * the UI displays '--' in place of the missing data fields.
 *
 * Test Scope:
 *   - Ensures '--' is shown for all pensions in all channels (Green, Yellow, Red) when mandatory information is missing.
 *   - Validates that the UI does not misleading values for missing mandatory fields.
 *
 * Tags: @e2e @emptyFields
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
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: Empty mandatory fields for all supported pension types in all channels @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'emptyFields_PC');

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, request);
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
      await commonHelpers.clickBackLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
