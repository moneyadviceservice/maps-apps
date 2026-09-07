import { expect, test } from '@maps/playwright';

import {
  simpleDetailsPageAllData,
  simpleDetailsPageEmptyFields,
} from '../data/scenarioDetails';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 55004: Dev -Value Illustration Date - Pension-details page
 * @tests Test Case 55844: 55004 - AC2 - Test Case 5 - Desktop - Verify pension-details page Income and values tab accordion
 * */

const heading = 'Income and values';
const accordionTitle = 'About these values';
const acccordionText1 =
  'The values are based on the calculation date shown below. This is the latest data your pension provider sent us.';
const acccordionText2 =
  'Your pension provider might be able to give you a more up-to-date value.';

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
          pension?.referenceNumber,
          pension?.payableDateERI,
        ),
      ).toBe(true);

      await expect(page.getByTestId('heading')).toContainText(heading);
      await expect(page.getByTestId('sub-heading')).toContainText(
        pensionDetailsPage.incomeValuesSubHeadingText,
      );

      await expect(
        pensionDetailsPage.valueIllustrationDateAccordion(page),
      ).not.toHaveAttribute('open');
      expect(await pensionDetailsPage.valueIllustrationDateTitle(page)).toBe(
        accordionTitle,
      );
      await commonHelpers.clickAccordion(
        page,
        pensionDetailsPage.valueIllustrationDateAccordion(page),
        accordionTitle,
      );
      expect(
        await pensionDetailsPage.getValueIllustrationDateAccordionText(page),
      ).toBe(acccordionText1);
      expect(
        await pensionDetailsPage.getValueIllustrationDateAccordionText2(page),
      ).toBe(acccordionText2);
      await expect(
        pensionDetailsPage.valueIllustrationDateAccordion(page),
      ).toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        pensionDetailsPage.valueIllustrationDateAccordion(page),
        accordionTitle,
      );
      await expect(
        pensionDetailsPage.valueIllustrationDateAccordion(page),
      ).not.toHaveAttribute('open');

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
          pension?.referenceNumber,
          pension?.payableDateERI,
        ),
      ).toBe(true);

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });

  test('Expected sub heading for DC pensions is displayed on pensions details page - Income and Values tab, Confirmed pensions', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      simpleDetailsPageAllData.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = ['Oak Pension Scheme'];
    for (const schemeName of schemeNames) {
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

      await expect(page.getByTestId('sub-heading-dc')).toContainText(
        pensionDetailsPage.incomeValuesSubHeadingTextDC,
      );

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
