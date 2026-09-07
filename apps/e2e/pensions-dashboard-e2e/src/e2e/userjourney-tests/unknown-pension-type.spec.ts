/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 55363
 * User Story: 55367
 * User Story: 55372
 * User Story: 55370
 * E2E Test: User Journey for Unknown Pension Types in all channels
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where the user has a SYS or NEW pension matchType across yellow and red channels
 * also it verified data returned from the backend matches the expected data dislpayed on the dashboard.
 * Tags: @e2e
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionsBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import pensionsThatNeedActionPage from '../pages/PensionsThatNeedActionPage';
import commonHelpers from '../utils/commonHelpers';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('Unknown Pension Types', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for: SYS and NEW matchType Pensions in all channels @e2e', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'No_Pension_Types',
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      await TimelineHelper.verifyTimelineValues(page, request);
      await GreenPensionsHelper.verifyGreenPensions(page, request);
    }

    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel(page);
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions(page);
      await pendingPensionsPage.pageLoads(page);
      await verifyYellowPension(page, request);
    }

    const redChannelExists = await pensionsFoundPage.hasRedChannel(page);
    if (redChannelExists) {
      await pensionsThatNeedActionPage.proceedToPensionNeedingActionDetailsPage(
        page,
      );
      await pensionsThatNeedActionPage.clickAllShowAndHideContactDetails(page);
      await assertRedPensionCalloutTextFromArrangement(page, request);
      await commonHelpers.clickHomeLink(page);
      await pensionsFoundPage.waitForPensionsFound(page);
    }
  });
});
