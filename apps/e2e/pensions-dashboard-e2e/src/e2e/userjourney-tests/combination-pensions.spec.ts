/* eslint-disable playwright/no-conditional-in-test */
// This rule is disabled as end-to-end regression tests rely on conditional logic.

/**
 * User Story: 50679
 * User Story: 50676
 * User Story: 50672
 * E2E Test: User Journey for Combination Pension Types
 *
 * @scope e2e-Scenarios
 *
 * This test simulates a user journey where the user has a set of confirmed combination pensions
 * also it verifies data returned from the backend matches the expected data dislpayed on the dashboard.
 * Tags: @e2e
 *
 */

import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';
import { GreenMulticiplityHelper } from '../utils/greenMulticiplityHelper';

test.describe('Combination Pensions', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('User Journey for Combination Pension Types @e2e', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionDetailsPage,
    pensionsFoundPage,
    statePensionsDetailsPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'Frank_AllTypes_V1',
      commonHelpers,
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions();
      await pensionBreakdownPage.pageLoads();
      const confirmedArrangements =
        await GreenMulticiplityHelper.verifyBreakdownPageSummaryAndMultiTranchePensionCards(
          pensionBreakdownPage,
          page,
          request,
        );
      await TimelineHelper.verifyTimelineValues(
        commonHelpers,
        page,
        request,
        confirmedArrangements,
      );
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
  });
});
