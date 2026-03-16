/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import {
  simpleDetailsPageAllData,
  simpleDetailsPageEmptyFields,
} from '../data/scenarioDetails';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';

const heading = 'Income and values';
const subtext =
  'These charts show the value of your pension now (or from the latest available date) and what it could be worth in the future.';

test.describe('Pension Details page - Income and Values Tab', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Expected content is displayed on pensions details page - Income and Values tab, Confirmed pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      simpleDetailsPageAllData.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['Willow Pension Scheme', 'Oak Pension Scheme'];
    for (const schemeName of schemeNames) {
      const pension = simpleDetailsPageAllData.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);

      // Navigate to Income and Values  tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);

      await expect(page.getByTestId('heading')).toContainText(heading);
      await expect(page.getByTestId('sub-heading')).toContainText(subtext);

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Empty values and fields are not displayed on pensions details page - Income and Values tab, Confirmed pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      simpleDetailsPageEmptyFields.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Empty Willow Pension Scheme',
      'Empty Oak Pension Scheme',
    ];
    for (const schemeName of schemeNames) {
      const pension = simpleDetailsPageEmptyFields.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      // Navigate to Income and Values  tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );
      //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
      expect(
        await pensionDetailsPage.verifyCommonHeaderAndIllustrationDate(
          page,
          pension.referenceNumber,
          pension.payableDateERI,
          pension.dataIllustrationDate,
        ),
      ).toBe(true);

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
