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
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: User with Defined Benefit (DB) pensions with lump sum pension in Green Channel @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */
    await commonHelpers.navigateToPensionsFoundPageTest(page, 'lumpSumTest');

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      // navigate to pensions breakdown page
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, request);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
