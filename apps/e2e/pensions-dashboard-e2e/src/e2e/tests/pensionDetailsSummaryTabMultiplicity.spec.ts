import { expect, test } from '@maps/playwright';

import {
  allNewTestCases,
  lumpSumScenario,
  pensionPotCallout,
} from '../data/scenarioDetails';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

/**
 *
 * @tests User Story 38983
 * @tests User Story 48482 FE - pension-details/summary tab - summary box behaviour
 *
 * @tests Test Case 38983: 39414: Acceptance Criteria 1 - Summary Tab: Lump Sum Sentence for DB Pensions
 * @tests Test Case 38983: 39415: Acceptance Criteria 2 - Summary Tab:Values are displayed correctly in lump sum for DB Pensions
 * @tests Test Case 38983: 39416: Acceptance Criteria 3 - Summary Tab: Lump Sum Sentence is not displayed for when lumpSum payableDetails object is not attached to the ERI illustrationType
 * @tests Test Case 38983: 39417: Acceptance Criteria 4 - Summary Tab: Values are not displayed in lump sum for DB Pensions hen lumpSum payableDetails object is not attached to the ERI illustrationType
 * @tests Test Case 49796 48482 AC1 TestCase1 : Verify Summary sentence box text AVC
 * @tests Test Case 49797 48482 AC1 TestCase2 : Verify Summary sentence box text DB
 * @tests Test Case 49799 48482 AC1 TestCase3 : Verify Summary sentence box text DC
 * @tests Test Case 49800 48482 AC1 TestCase4 : Verify Summary sentence box text - Lump Sum sentence
 * @tests Test Case 49834 48482 AC2 TestCase6 Verify Latest pot value box and tooltip - DC
 * @tests Test Case 49835 48482 AC2 TestCase7 Verify Latest pot value box and tooltip - AVC
 * @tests Test Case 49842 48482 AC3 TestCase8 Verify Latest pot value explainer accordion - DB+DC
 * @tests Test Case 49845 48482 AC3 TestCase9 Verify Latest pot value explainer accordion - DB+AVC
 * @tests Test Case 49846 48482 AC3 TestCase10 Verify Latest pot value explainer accordion - DB+DC+AVC
 * @tests Test Case 49850 48482 AC3 TestCase11 Verify Latest pot value No explainer accordion - AVC only
 * @tests Test Case 49851 48482 AC3 TestCase12 Verify Latest pot value No explainer accordion - DC only
 * @tests Test Case 49852 48482 AC3 TestCase13 Verify Latest pot value No explainer accordion - DC and AVC only
 * @tests Test Case 49854 48482 AC5 TestCase15 Verify latest pot value descriptive wording - DB+AVC
 * @tests Test Case 49855 48482 AC5 TestCase16 Verify latest pot value descriptive wording - DB+DC
 * @tests Test Case 49861 48482 AC5 TestCase17 Verify latest pot value descriptive wording - DB+DC+AVC
 * @tests Test Case 49865 48482 AC5 TestCase18 Verify latest pot value -No descriptive wording - DC+AVC
 *
 *
 * @tests User Story 51898: Toggletip Overlay for Keyboard users
 * @tests Test Case 52712 [AC4]: Close Previous Tooltip when Opening Another
 */

test.describe('Pension Details page - Your Pensions', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('verify lump sum sentence on summary sentence for a DB pension', async ({
    page,
  }) => {
    const scenarioName = lumpSumScenario.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'Horizon Lifetime Plan',
      'Oakfield Secure Pension',
      'GreenOak Retirement Plan',
    ];
    for (const schemeName of schemeNames) {
      const pension = lumpSumScenario.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const eriPotValue = pension?.ERIPotValue;
      console.log('ERIPotValue:', eriPotValue);
      const payableDate = pension?.payableDateERI;
      console.log('payableDate:', payableDate);
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');

      // Verify the presence of lump sum statement
      const lumpSumSentence = await pensionDetailsPage.getLumpSumText(page);
      expect(lumpSumSentence.includes(eriPotValue)).toBe(true);
      expect(lumpSumSentence.includes(payableDate)).toBe(true);
      await commonHelpers.clickLink(page, 'Back');
    }
  });

  test('verify lump sum sentence is not displayed on summary sentence for a DB pension when lumpSum payableDetails object is not attached to the ERI illustrationType', async ({
    page,
  }) => {
    const scenarioName = lumpSumScenario.option;
    await commonSessions.navigateToPensionsFoundPage(page, scenarioName);
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeName = 'SilverTree Future Fund';
    const pension = allNewTestCases.pensions.find(
      (p) => p.schemeName === schemeName,
    );
    const eriPotValue = pension?.ERIPotValue;
    console.log('ERIPotValue:', eriPotValue);
    const payableDate = pension?.payableDateERI;
    console.log('payableDate:', payableDate);
    await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
    await pensionDetailsPage.assertHeading(page, schemeName);
    expect(page.url()).toContain('/pension-details/your-pension-summary');

    // Verify the absence of lump sum statement
    const lumpSumSentence = await pensionDetailsPage.getLumpSumText(page);
    expect(lumpSumSentence.includes(eriPotValue)).toBe(false);
    expect(lumpSumSentence.includes(payableDate)).toBe(false);
  });

  test('Expected content is displayed in Latest Pot Value in Summary Tab', async ({
    page,
    isMobile,
  }) => {
    const summaryTab = new ConfirmedPensionsSummary(page, isMobile);
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      pensionPotCallout.option,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);

    const schemeNames = [
      'AVC only Scheme',
      'DC only scheme',
      'CBS only Scheme',
      'CBS and AVC Scheme',
      'CBS and DC Scheme',
      'DC and AVC Scheme',
      'CBS, AVC and DC Scheme',
    ];
    for (const schemeName of schemeNames) {
      const pension = pensionPotCallout.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      //expect(pension).toBeDefined(); // Add this line for better error reporting
      if (!pension) {
        throw new Error(
          `Pension with schemeName "${schemeName}" not found in pensionPotCallout.pensions`,
        );
      }
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);

      const potValueToolTipContent =
        'The pot value is how much money has built up in this pension scheme. It’s a combination of your contributions, your employer’s contributions (if it’s a workplace pension), and any investment growth.Close';
      const summaryCardText = `You could receive ${pension.monthlyAmount} a month from the first payable date of ${pension.firstPayableDate}.`;

      // summary sentence
      await expect(pensionDetailsPage.getSummaryCard(page)).toContainText(
        summaryCardText,
      );

      //Latest pot value box heading
      await expect(summaryTab.potValueTitle).toContainText('Latest pot value');

      //Latest pot value box tooltip: Closed by default, click, open, text visible, close
      await expect(summaryTab.potValueToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      await commonHelpers.clickTooltip(page, 'pot-value-title');
      await expect(summaryTab.potValueToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await expect(summaryTab.potValueToolTipText).toHaveText(
        potValueToolTipContent,
      );
      await commonHelpers.clickTooltip(page, 'pot-value-title');
      await expect(summaryTab.potValueToolTipIconState).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      const retirementContent = page
        .getByTestId('retirement-date')
        .getByTestId('tooltip-content');

      const latestPotContent = page
        .getByTestId('pot-value-title') // or whichever matches your pot value block
        .getByTestId('tooltip-content');

      await commonHelpers.clickTooltip(page, 'retirement-date');
      await expect(retirementContent).toBeVisible();

      // 2. Click the Latest Pot Value tooltip
      await commonHelpers.clickTooltip(page, 'pot-value-title');
      await expect(retirementContent).toBeHidden();
      await expect(latestPotContent).toBeVisible();
      await commonHelpers.clickTooltip(page, 'pot-value-title');
      await expect(latestPotContent).toBeHidden();

      //Latest pot value amount
      expect(await summaryTab.getPotValueAmount()).toContain(
        pension.potValueAmount,
      );

      //Latest pot value box text
      await expect(summaryTab.potValueAmountText).toContainText(
        pension.latestPotValueText,
      );

      //Latest pot value box Accordion: Closed by default, click, open, text visible, close
      await expect(summaryTab.potValueAccordion).not.toHaveAttribute('open');
      await commonHelpers.clickAccordion(
        page,
        summaryTab.potValueAccordion,
        'What does this mean?',
      );
      await expect(summaryTab.potValueAccordion).toHaveAttribute('open');
      await expect(summaryTab.potValueAccordion).toHaveText(
        pension.potValueAccordionText,
      );
      await commonHelpers.clickAccordion(
        page,
        summaryTab.potValueAccordion,
        'What does this mean?',
      );
      await expect(summaryTab.potValueAccordion).not.toHaveAttribute('open');

      //navigate back
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});
