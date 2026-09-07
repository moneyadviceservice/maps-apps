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
import pensionsBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { GreenPensionsHelper } from '../utils/greenPensionsHelper';
import { TimelineHelper } from '../utils/timelineHelper';
import { GreenMulticiplityHelper } from '../utils/greenMulticiplityHelper';

test.describe('Combination Pensions', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('User Journey for Combination Pension Types @e2e', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'Frank_AllTypes_V1',
    );

    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      const confirmedArrangements =
        await GreenMulticiplityHelper.verifyBreakdownPageSummaryAndMultiTranchePensionCards(
          page,
          request,
        );
      await TimelineHelper.verifyTimelineValues(
        page,
        request,
        confirmedArrangements,
      );
      await GreenPensionsHelper.verifyGreenPensions(page, request);
    }
  });
});
