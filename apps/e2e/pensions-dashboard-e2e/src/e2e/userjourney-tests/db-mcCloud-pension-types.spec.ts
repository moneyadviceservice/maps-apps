import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenMulticiplityHelper } from '../utils/greenMulticiplityHelper';
import { TimelineHelper } from '../utils/timelineHelper';

/**
 *
 * User Story: 47359 - BE - your-pensions-breakdown/summary Sentence - McCloud Business Logic Implementation
 * User Story: 47356 - BE - Timeline - Business Logic changes for McCloud Implementation
 * User Story: 47355 - BE - Pension Details Page - Business Logic changes for McCloud Implementation
 * User Story: 42864 - BE - Multiplicity -  hasIncome Boolean amendment
 * User Story: 47416 - FE - McCloud - your-pensions-timeline page(legacy and alternate)
 * User Story: 48327 - FE - McCloud - pension-details page - Summary tab
 * User Story: 48328 - FE - McCloud - pension-details page - Income & Values Tab for Timeline
 * User Story: 47418 - FE - McCloud - pension-details page - Income & Values Tab for Graphs
 * User Story: 47367 - FE - McCloud - your-pensions-breakdown/Summary Sentence
 * E2E Test: User Journey for McCloud pension types
 *
 */

test.describe('mcCloud pension types', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('verify Summary Sentence and timeline for mcCloud pension types', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'McCloud_All_And_SP',
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
    }
  });

  test('Verify details on Summary, Income &Values tab contents for McCloud pensions on MHPD dashboard', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'test_mcCloud_withUnavailableReason',
      commonHelpers,
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions();
      await pensionBreakdownPage.pageLoads();
      await GreenMulticiplityHelper.verifySummaryAndIncomeTab(
        commonHelpers,
        pensionBreakdownPage,
        page,
        request,
      );
    }
  });
});
