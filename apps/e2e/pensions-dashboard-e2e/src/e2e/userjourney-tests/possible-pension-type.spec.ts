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

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';

test.describe('Pensions That Need Action (Red Channel) - JavaScript Enabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey: User with 1 pension that need action @e2e', async ({
    commonHelpers,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    page,
    request,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      'testScenario1',
      commonHelpers,
    );

    const redChannelExists = await pensionsFoundPage.hasRedChannel();
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage();
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails();
      await assertRedPensionCalloutTextFromArrangement(
        pensionsThatNeedActionPage,
        page,
        request,
      );
      await commonHelpers.clickHomeLink();
      await pensionsFoundPage.waitForPensionsFound();
    }
  });

  test('User Journey: User with 3 pensions that need action @e2e', async ({
    commonHelpers,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    page,
    request,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      'testScenario2',
      commonHelpers,
    );

    const redChannelExists = await pensionsFoundPage.hasRedChannel();
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage();
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails();
      await assertRedPensionCalloutTextFromArrangement(
        pensionsThatNeedActionPage,
        page,
        request,
      );
      await commonHelpers.clickHomeLink();
      await pensionsFoundPage.waitForPensionsFound();
    }
  });
});

test.describe('Pensions That Need Action (Red Channel) - JavaScript Disabled', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  /**
   * Skipped:
   *
   * https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_workitems/edit/37329
   */
  test.skip('User Journey: User with 1 pension that needs action (JS Disabled) @bug', async ({
    commonHelpers,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    page,
    request,
  }) => {
    test.use({ javaScriptEnabled: false });
    await commonHelpers.navigateToPensionsFoundPageJSDisabled('testScenario1');

    const redChannelExists = await pensionsFoundPage.hasRedChannel();
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage();
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails();
      await assertRedPensionCalloutTextFromArrangement(
        pensionsThatNeedActionPage,
        page,
        request,
      );
      await commonHelpers.clickHomeLink();
      await pensionsFoundPage.waitForPensionsFound();
    }
  });
});
