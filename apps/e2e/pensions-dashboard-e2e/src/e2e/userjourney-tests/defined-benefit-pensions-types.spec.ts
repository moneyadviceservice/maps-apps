/**
 * E2E Test: User Journey for a user with one Defined Benefit (DB) pension in Green Channel
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user selecting the 'statePensionCaseC' scenario, logging in, and navigating through the pension dashboard.
 * It verifies:
 *   - Defined Benefit pension is correctly retrieved from the backend
 *   - DB pension is displayed on the dashboard
 *   - Key pension details (scheme name, retirement date, etc.) are shown as expected
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - ScenarioSelectionPage
 *   - WelcomePage
 *   - LoadingPage
 *   - PensionFoundPage
 *   - authentication
 *   - request
 */
import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: User with Defined Benefit (DB) pensions with lump sum pension in Green Channel @e2e', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'lumpSumTest',
      commonHelpers,
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      // navigate to pensions breakdown page
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
  });
});
