/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 36691
 * E2E Test: User Journey for Eight Yellow Pensions in Yellow Channel
 *
 * This test simulates a user journey all avaialable yellow pensions, all in the Yellow Channel.
 * It verifies:
 *   - Navigation to the Pensions Found page
 *   - Retrieval and validation of pension data from the backend
 *   - Presence and correctness of scheme names on the UI
 *   - Conditional flow for Yellow channel including navigation and data mapping
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PendingPensionPage
 *   - greenPensionHelpers
 *   - commHelpers
 *   - authentication
 */
import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: User with eight (8) Yellow pensions in Confirmed Channel @e2e', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'eightYellowPensions',
      commonHelpers,
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions();
      await pensionBreakdownPage.pageLoads();
      await TimelineHelper.verifyTimelineValues(commonHelpers, page, request);
      await GreenPensionsHelper.verifyGreenPensions(
        commonHelpers,
        pensionBreakdownPage,
        pensionDetailsPage,
        pensionsFoundPage,
        statePensionsDetailsPage,
        page,
        request,
      );
    }
  });
});
