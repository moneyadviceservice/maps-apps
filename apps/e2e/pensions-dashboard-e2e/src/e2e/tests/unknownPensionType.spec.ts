import { expect, test } from '@maps/playwright';

import { noPensionTypes } from '../data/scenarioDetails';
import pendingPensionsPage from '../pages/PendingPensionsPage';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

/**
 * @tests User Story 55363: FE - SYS/NEW no pension type - Pension Card
 * @tests Test Case 55566: 55363 AC1, AC2, AC3 TestCase 1 : 'Pension type unknown' card displayed for SYS match type
 * @tests Test Case 55567: 55363 AC1, AC2, AC3 TestCase 2 : 'Pension type unknown' card displayed for NEW match type
 *
 * @tests User Story 55367: FE - SYS/NEW no pension type - your-pension-summary page/Summary tab - no pension design
 * @tests Test Case 55719: 55367 AC1, AC2, AC4 TestCase 1 : Summary Tab displays summary box - NEW no benefits
 * @tests Test Case 55722: 55367 AC1, AC2, AC4 TestCase 2: Summary Tab displays summary box - SYS no benefits
 * @tests Test Case 55724: 55367 AC3, AC4 TestCase 3: Pension type box not displayed - NEW no benefits
 * @tests Test Case 55726: 55367 AC3, AC4 TestCase 4: Pension type box not displayed - SYS no benefits
 *
 * @tests User Story 55372: FE - SYS/NEW - your-pension-summary page/Summary tab - logic change
 * @tests Test Case 55807: 55372 AC1, AC4, Test Case 1 : SYS matchType with values displays unavailable message on Summary Tab
 * @tests Test Case 55810: 55372 AC2, AC4, Test Case 2 : NEW matchType with values displays unavailable message on Summary Tab
 *
 * @tests User Story 55004: Dev -Value Illustration Date - Pension-details page
 * @tests Test Case 55849: 55004 - AC3 - Test Case 9 - SYS/NEW match code is received, graphs are rendered and the accordion is shown
 * @tests User Story 55960: QA Automation - Tech Debt - SYS/NEW - Income & Values Tab
 * @tests Test Case 55748: 55370 AC1 , AC4 TestCase 1 : SYS matchType - benefitType with values -  income and values tab warning text
 * @tests Test Case 55753: 55370 AC1 , AC4 TestCase 2 : NEW matchType  - benefitType with values -   income and values tab warning text
 * @tests Test Case 55758: 55370 AC2, AC4 Test Case 3 : SYS matchType - no benefitType and pensionType - displays alternative text
 * @tests Test Case 55759: 55370 AC2, AC4 Test Case 4 : NEW matchType - no benefitType and pensionType - displays alternative text
 * @tests Test Case 55772: 55370 AC3, AC4 Test Case 5 : NEW matchType - with benefit + no pensionType - Benefit title is displayed
 * @tests Test Case 55773: 55370 AC3, AC4 Test Case 6 : SYS matchType - with benefit + no pensionType - Benefit title is displayed
 */

const unknownPensionType = 'Pension type unknown';
const newUnavailableText =
  'This is a new pension. Your provider needs more time to send us data.';
const sysUnavailableText = `There's an issue with the data from your pension provider. You do not need to take any action at this point.`;
const newNoBenefitsText =
  'This is a new pension. Your provider needs more time to send us data.';
const sysNoBenefitsText = `There's an issue with the data from your pension provider. You do not need to take any action at this point.`;
const valuesWarningText =
  'Any information you see might be incorrect. Do not rely on any values until this pension has been confirmed.';
const accordionTitle = 'About these values';
const acccordionText1 =
  'The values are based on the calculation date shown below. This is the latest data your pension provider sent us.';
const acccordionText2 =
  'Your pension provider might be able to give you a more up-to-date value.';

test.describe('Unknown Pension Types', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
    await commonSessions.navigateToPendingPensions(page, noPensionTypes.option);
  });

  test('SYS, NEW match types displayed on Pending pensions page, and Summary Tab', async ({
    page,
  }) => {
    //pending pensions page
    const pendingPensions = [
      {
        schemeName: 'NEW - no benefits',
        expectedText: newUnavailableText,
        expectedIncomeAndValuesText: newNoBenefitsText,
      },
      {
        schemeName: 'SYS - no benefits',
        expectedText: sysUnavailableText,
        expectedIncomeAndValuesText: sysNoBenefitsText,
      },
      {
        schemeName: 'NEW - with benefits',
        expectedText: newUnavailableText,
        expectedIncomeAndValuesText: valuesWarningText,
      },
      {
        schemeName: 'SYS - with benefits',
        expectedText: sysUnavailableText,
        expectedIncomeAndValuesText: valuesWarningText,
      },
    ];

    const schemesWithNoBenefitValues = [
      'NEW - no benefits',
      'SYS - no benefits',
    ];

    for (const {
      schemeName,
      expectedText,
      expectedIncomeAndValuesText,
    } of pendingPensions) {
      await expect(
        pendingPensionsPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pendingPensionsPage.getPensionCardType(page, schemeName),
      ).toContainText(unknownPensionType);

      //Summary Tab - summary box - NEW, SYS
      await pendingPensionsPage.viewDetailsOfPendingPension(page, schemeName);
      await expect(page).toHaveURL(/pension-details\/your-pension-summary/);

      expect(await pensionDetailsPage.getSummaryBoxContent(page)).toContain(
        expectedText,
      );
      await expect(pensionDetailsPage.getPensionDetailType(page)).toBeHidden();

      //income and values tab - NEW, SYS
      await pensionDetailsPage.selectTab(page, 'Income & values');

      /* eslint-disable playwright/no-conditional-in-test */
      /*eslint-disable playwright/no-conditional-expect */

      if (schemesWithNoBenefitValues.includes(schemeName)) {
        await expect(
          pensionDetailsPage.getSysNewNoBenefitsMessage(page),
        ).toContainText(expectedIncomeAndValuesText);

        //no Benefit type title
        await expect(
          pensionDetailsPage.benefitTypeTitle(page, /.*/),
        ).toBeHidden();
        // No accordion displayed
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).toBeHidden();
      } else {
        //Text is displayed
        await expect(
          pensionDetailsPage.getSysNewValuesWarningMessage(page),
        ).toContainText(expectedIncomeAndValuesText);

        //Accordion is displayed
        await expect(
          pensionDetailsPage.valueIllustrationDateAccordion(page),
        ).toBeVisible();
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

        //Benefit type title is displayed
        await expect(
          pensionDetailsPage.benefitTypeTitle(page, 'db'),
        ).toContainText('Defined benefit');
      }

      await commonHelpers.clickBackLink(page);
    }
  });
});
