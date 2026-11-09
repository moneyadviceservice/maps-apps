// multiplicity automation tests
// test multiplicty flag
// test that multiplicity is categorised as CONFIRMED, PENDING and UNSUPPORTED
// at the moment we are testing the pensions card only

import { TimelineHelper } from 'src/e2e/utils/timelineHelper';
import { test } from '@maps/playwright';

import { userJourneyTimeout } from '../../../playwright.qa.config';
import { GreenMulticiplityHelper } from '../utils/greenMulticiplityHelper';

/**
 * User Story: 43077 - BE -  Remove Multiplicity (except for McCloud) from the Unsupported Pensions bucket
 * User Story: 44976 - BE - Pension Card - Multiplicity flag in order to indicate an arrangement has multiplicity
 * User Story: 42864 - BE - Multiplicity -  hasIncome Boolean amendment
 * User Story: 45235 - FE - Multiple tranches - Multiple unavailable codes - Confirmed with no income Pension Cards
 * User Story: 44973 - BE - Logic change exchange most recent benefit illustration value with the earliest payable date
 * User Story: 44525 - DB with Multiple Tranches - Timeline Page
 * E2E Test: User Journey for DB Multiple tranches pension types
 */

test.describe('Pension arrangement with multiple tranches', () => {
  test.describe.configure({ timeout: userJourneyTimeout });

  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test('Verify DB pension cards with multiple tranches is displayed correctly on the MHPD dashboard', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'MultiplicityHasIncome',
      commonHelpers,
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel();
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions();
      await pensionBreakdownPage.pageLoads();
      await GreenMulticiplityHelper.verifyBreakdownPageSummaryAndMultiTranchePensionCards(
        pensionBreakdownPage,
        page,
        request,
      );
    }
  });

  test('Verify Timeline for DB Multiple tranches is renderred correctly on MHPD dashboard', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'test_DBMultiplesWithTimeLine',
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

  test('Verify details on Summary, Income &Values tab contents for DB Multiple tranches on MHPD dashboard', async ({
    commonHelpers,
    pensionBreakdownPage,
    pensionsFoundPage,
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      'combinedMultiplicityWithSp',
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
