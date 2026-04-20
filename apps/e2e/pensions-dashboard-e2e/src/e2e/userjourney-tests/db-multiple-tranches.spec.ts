// multiplicity automation tests
// test multiplicty flag
// test that multiplicity is categorised as CONFIRMED, PENDING and UNSUPPORTED
// at the moment we are testing the pensions card only

import { TimelineHelper } from 'src/e2e/utils/timelineHelper';
import { test } from '@maps/playwright';

import pensionsBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { GreenMulticiplityHelper } from '../utils/greenMulticiplityHelper';

/**
 *
 * User Story: 43077 - BE -  Remove Multiplicity (except for McCloud) from the Unsupported Pensions bucket
 * User Story: 44976 - BE - Pension Card - Multiplicity flag in order to indicate an arrangement has multiplicity
 * User Story: 42864 - BE - Multiplicity -  hasIncome Boolean amendment
 * User Story: 45235 - FE - Multiple tranches - Multiple unavailable codes - Confirmed with no income Pension Cards
 * User Story: 44973 - BE - Logic change exchange most recent benefit illustration value with the earliest payable date
 * User Story: 44525 - DB with Multiple Tranches - Timeline Page
 * E2E Test: User Journey for DB Multiple tranches pension types
 *
 */

test.describe('Pension arrangement with multiple tranches', () => {
  test.use({ javaScriptEnabled: true });

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Verify DB pension cards with multiple tranches is displayed correctly on the MHPD dashboard', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'MultiplicityHasIncome',
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      // please note that this is subject to future change. the multiplicity functionality
      // only extended to pensions cards in green channel at the moment
      await GreenMulticiplityHelper.verifyMultipleTrenchesCardOnGreenChannel(
        page,
        request,
      );
    }
  });

  test('Verify Timeline for DB Multiple tranches is renderred correctly on MHPD dashboard', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'test_DBMultiplesWithTimeLine',
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      await TimelineHelper.verifyTimelineValues(page, request);
    }
  });

  test('Verify details on Summary, Income &Values tab contents for DB Multiple tranches on MHPD dashboard', async ({
    page,
    request,
  }) => {
    await commonHelpers.navigateToPensionsFoundPageTest(
      page,
      'combinedMultiplicityWithSp',
    );
    const greenChannelExists = await pensionsFoundPage.hasGreenChannel(page);
    if (greenChannelExists) {
      await pensionsFoundPage.clickSeeYourPensions(page);
      await pensionsBreakdownPage.pageLoads(page);
      await GreenMulticiplityHelper.verifySummaryAndIncomeTab(page, request);
    }
  });
});
