/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 *  * User Story: 36695
 * E2E Test: User Journey for one supported pension and four unsupported pensions
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user with one supported pension and four unsupported pensions.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - DC/DB pension
 *   - AC4: User navigates back to the Pension breakdown page
 *   - AC5: User navigates back to the Pensions found page
 *   - Unsupported pensions are not shown on the dashboard
 *   - Unsupported pension types are returned from the backend but not displayed
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
import { expect, test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { verifyUnsupportedPensions } from '../utils/unsupportedPensionsHelpers';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: One(1) Supported pension and four (4) unsupported pensions  @e2e', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'supportedUnsupportedPensions_PC_V3',
      commonHelpers,
    );

    const otherPensionlink =
      await pensionsFoundPage.linkExpectingOtherPensions();
    await expect(otherPensionlink).toContainText('here’s what you can do.');
    const unsupportedPensionGuideText =
      await pensionsFoundPage.getUnsupportedPensionsText();
    expect(unsupportedPensionGuideText).toContain('Unsupported pensions found');
    const unsupportedPensionSummaryText =
      await pensionsFoundPage.getUnsupportedPensionsText();
    expect(unsupportedPensionSummaryText).toContain(
      pensionsFoundPage.unsupportedPensionsFound,
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
    }
    if (unsupportedPensionSummaryText) {
      await verifyUnsupportedPensions(
        commonHelpers,
        pensionsFoundPage,
        page,
        request,
      );
    }
  });
});
