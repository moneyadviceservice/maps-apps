/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36690
 * E2E Test: User Journey for Nine Green Pensions in Green Channel
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey for a user with 9 green pensions, all in the Green Channel.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - State pension
 *   - AC4: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - Retrieval and validation of pension data from the backend
 *   - Presence and correctness of scheme names on the UI
 *   - Conditional flow for Green, Yellow, and Red channels including navigation and data mapping
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
import { expect, test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: User with 9 Green pensions in Green Channel @e2e', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'nineGreenPensions_PC',
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
    expect(
      yellowChannelExists,
      'Checking there are no yellow pensions',
    ).not.toBeTruthy();

    const redChannelExists = await pensionsFoundPage.hasRedChannel();
    expect(
      redChannelExists,
      'Checking there are no red pensions',
    ).not.toBeTruthy();

    const unsupportedCallout =
      await pensionsFoundPage.unsupportedPensionsCallOut();
    await expect(
      unsupportedCallout,
      'Checking there are no unsupported pensions',
    ).toHaveCount(0);
  });
});
