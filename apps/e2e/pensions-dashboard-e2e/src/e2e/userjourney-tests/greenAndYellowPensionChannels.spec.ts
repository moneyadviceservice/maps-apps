/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36696
 *  * User Story: 36659
 *  E2E Test: 1 DB & 1 DC pensions are displayed in the Yellow & Green Channels
 *
 * This test simulates a user with user with Confirmed pensions (without estimated income only) and a pending pension.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - AC5: User navigates back to the Pensions found page
 *   - AC6: User Navigates to the 'pending-pensions' page
 *   - AC7: User navigates to the Pension details page - DC/DB pension
 *   - AC8: User navigates back to the Pending Pension page
 *   - AC9: User navigates back to the Pensions found page
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - greenPensionHelpers
 *   - unsupportedPensionHelpers
 *   - commHelpers
 *   - authentication
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: Green and Yellow pensions combined  @e2e', async ({
    commonHelpers,
    pendingPensionsPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'greenAndYellow',
      commonHelpers,
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage();
      await GreenPensionsHelper.verifyGreenPensions(
        commonHelpers,
        pensionBreakdownPage,
        pensionDetailsPage,
        pensionsFoundPage,
        statePensionsDetailsPage,
        page,
        request,
      );
      await pensionsFoundPage.waitForPensionsFound();
    }

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
    }
  });
});
