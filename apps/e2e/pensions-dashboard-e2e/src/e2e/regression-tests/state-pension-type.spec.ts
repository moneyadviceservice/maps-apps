/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36687
 * E2E Test: User Journey for a user with one confirmed state pension
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user selecting the 'statePensionCase004' scenario, logging in, and navigating through the pension dashboard.
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'your-pension-breakdown' page
 *   - AC3: User navigates to the Pension details page - State pension
 *   - State pension is correctly retrieved from the backend
 *   - State pension is displayed on the dashboard
 *   - Key pension details (scheme name, retirement date, estimated monthly amount) are shown as expected
 *   - State pension details page is accurate (using utility helpers)
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
 *   - dateFormatter
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

  test('User Journey for: User with 1 (one) confirmed state pension @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(100000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     * i.e. scenarioSelectionPage.selectScenario({ scenarioName: 'testScenario9', environment: 'test' })
     */
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'statePensionCase004',
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, request);
    }
  });
});
