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

import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { verifyGreenPensions } from '../utils/greenPensionsHelper';
import { verifyUnsupportedPensions } from '../utils/unsupportedPensionsHelpers';

test.describe('JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: One(1) Supported pension and four (4) unsupported pensions  @e2e', async ({
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
      'supportedUnsupportedPensions_PC',
    );

    const otherPensionlink = await pensionsFoundPage.linkExpectingOtherPensions(
      page,
    );
    await expect(otherPensionlink).toContainText(
      'Are you expecting to see other pensions?',
    );
    const unsupportedPensionGuideText =
      await pensionsFoundPage.getUnsupportedPensionsText(page);
    expect(unsupportedPensionGuideText).toContain('Unsupported pensions found');
    const unsupportedPensionSummaryText =
      await pensionsFoundPage.getUnsupportedPensionsText(page);
    expect(unsupportedPensionSummaryText).toContain(
      pensionsFoundPage.unsupportedPensionsFound,
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.navigateToPensionBreakdownPage(page);
      await verifyGreenPensions(page, request);
    }
    if (unsupportedPensionSummaryText) {
      await verifyUnsupportedPensions(page, request);
    }
  });
});
