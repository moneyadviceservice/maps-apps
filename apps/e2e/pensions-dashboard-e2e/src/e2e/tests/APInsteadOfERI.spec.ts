import { expect, test } from '@maps/playwright';

import { APAmountDisplayedIfERIDBCodePresent } from '../data/scenarioDetails';
import { expectedTimelineDataAP } from '../data/timelineScenarioDetails';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import Timeline from '../pages/components/Timeline';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

/**
 * @tests User Story 41469
 * @tests Test case 41861 [AC1] AP Amount Displayed on Card (DB Code Present)
 * @tests Test case 41862 [AC1] ERI Amount Displayed on Card (No Unavailable Code Present)
 * @tests Test case 41869 [AC2] Pension Breakdown Page: Summary Total Includes AP Amount (DB Code Present)
 * @tests Test case 41877 [AC3] Pension Summary Page: Summary Total Includes AP Amount (DB Code Present)
 * @tests Test case 41874 [AC4] Timeline Displays AP Amount and Payable Date (DB code present for ERI)
 */

test.describe('Pension Details page - Summary Tab - Warning message component', () => {
  test('AP income appears instead of ERI for the cards, summary and timeline in the case of a DB pension, when the ERI unavailable code is DB.', async ({
    page,
  }) => {
    const scenarioName = APAmountDisplayedIfERIDBCodePresent.option;
    await commonSessions.navigateToPensionBreakdown(page, scenarioName);

    const schemeNames = [
      'State Pension',
      'Available ERI and AP',
      'ERI with DB Unavailable Code',
    ];

    for (const schemeName of schemeNames) {
      const pension = APAmountDisplayedIfERIDBCodePresent.pensions.find(
        (p) => p.schemeName === schemeName,
      );

      const estimatedIncomeText = await pensionBreakdownPage
        .getEstimatedIncome(page, schemeName)
        .innerText();
      const estimatedIncome = commonHelpers.cleanCurrency(estimatedIncomeText);

      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);

      if (pension.ERIUnavailableCode === 'DB') {
        expect(pension.APMonthlyAmount).toEqual(estimatedIncome);
        const summaryAmountText = await pensionDetailsPage.getSummaryAmount(
          page,
        );
        const summaryAmount = commonHelpers.cleanCurrency(summaryAmountText);
        expect(pension.APMonthlyAmount).toEqual(summaryAmount);
      } else {
        expect(pension.ERIMonthlyAmount).toEqual(estimatedIncome);
        if (schemeName !== 'State Pension') {
          const summaryAmountText = await pensionDetailsPage.getSummaryAmount(
            page,
          );
          const summaryAmount = commonHelpers.cleanCurrency(summaryAmountText);
          expect(pension.ERIMonthlyAmount).toEqual(summaryAmount);
        }
      }

      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }

    const expectedSummarySentenceMonthlyAmount =
      APAmountDisplayedIfERIDBCodePresent.pensions.reduce((total, pension) => {
        if (pension.ERIUnavailableCode === 'DB') {
          return total + (pension.APMonthlyAmount || 0);
        } else {
          return total + (pension.ERIMonthlyAmount || 0);
        }
      }, 0);

    const summarySentence = new ConfirmedPensionsSummary(page);
    const summarySentenceMonthlyAmountText =
      await summarySentence.getMonthlyAmount();
    const summarySentenceMonthlyAmount = commonHelpers.cleanCurrency(
      summarySentenceMonthlyAmountText,
    );
    expect(summarySentenceMonthlyAmount).toEqual(
      expectedSummarySentenceMonthlyAmount,
    );

    await page.getByTestId('timeline-link').click();
    await page.waitForURL('**/your-pensions-timeline');

    const timeline = new Timeline(page);
    const actualTimelineData = await timeline.getTimelineData(
      page,
      expectedTimelineDataAP,
    );
    expect(actualTimelineData).toEqual(expectedTimelineDataAP);
  });
});
