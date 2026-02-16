/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * * User Story: 36685
 * E2E Test: User Journey for Pensions That Need Action (Red Channel)
 *
 * @scope e2e-Scenarios
 *
 * This test simulates user journeys for users with pensions that need action (red channel).
 * It verifies:
 *   - AC1: User views Pensions found page
 *   - AC2: User Navigates to the 'pensions-that-need-action' page
 *   - AC3: User Clicks 'show contact details link
 *   - Retrieval and validation of pension data from the backend
 *   - Presence and correctness of scheme names on the UI
 *   - Conditional flow for Red channel including navigation and data mapping
 *
 * Tags: @e2e
 *
 * Related helpers and page objects:
 *   - PensionFoundPage
 *   - PensionThatNeedActionPage
 *   - redPensionHelper
 *   - commHelpers
 *   - authentication
 */
import { test } from '@maps/playwright';

import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';

test.describe('Pensions That Need Action (Red Channel) - JavaScript Enabled', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey: User with 1 pension that need action @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    /**
     * TODO: Refactor this to use a standard method and remove duplicate methods.
     */

    await commonHelpers.navigatetoPensionsFoundPage(page, 'testScenario1');

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

  test('User Journey: User with 3 pensions that need action @e2e', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    await commonHelpers.navigatetoPensionsFoundPage(page, 'testScenario2');

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

test.describe('Pensions That Need Action (Red Channel) - JavaScript Disabled', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  /**
   * Skipped:
   *
   * https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit/37329
   */
  test.skip('User Journey: User with 1 pension that needs action (JS Disabled) @bug', async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);
    test.use({ javaScriptEnabled: false });
    await commonHelpers.navigateToPensionsFoundPageJSDisabled(
      page,
      'testScenario1',
    );

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
