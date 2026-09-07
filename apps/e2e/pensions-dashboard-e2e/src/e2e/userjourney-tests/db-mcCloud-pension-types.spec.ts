import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import pensionsBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
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

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('verify Summary Sentence and timeline for mcCloud pension types', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'McCloud_All_And_SP',
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
    }
  });

  test('Verify details on Summary, Income &Values tab contents for McCloud pensions on MHPD dashboard', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'test_mcCloud_withUnavailableReason',
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      await GreenMulticiplityHelper.verifySummaryAndIncomeTab(page, request);
    }
  });
});
