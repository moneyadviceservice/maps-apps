/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 51851
 *
 * E2E Test: User Journey for Hybrid Pension Types in all channels
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where the user has a combination of hybrid pension matrix across green, yellow, red, channels
 * also it verified data returned from the backend matches the expected data dislpayed on the dashboard.
 * unsupported pension are covered in other tests.
 * Tags: @e2e
 *
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { assertRedPensionCalloutTextFromArrangement } from '../utils/redPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';
import { verifyYellowPension } from '../utils/yellowPensionsHelper';

test.describe('Hybrid Pensions', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for: Hybrid Pensions in all channels @e2e', async ({
    commonHelpers,
    pendingPensionsPage,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    pensionsThatNeedActionPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'hybPensions_AllBenefitTypes_PC',
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

    const yellowChannelExists = await pensionsFoundPage.hasYellowChannel();
    if (yellowChannelExists) {
      await pensionsFoundPage.clickSeePendingPensions();
      await pendingPensionsPage.pageLoads();
      await verifyYellowPension(
        commonHelpers,
        pensionBreakdownPage,
        page,
        request,
      );
    }

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
