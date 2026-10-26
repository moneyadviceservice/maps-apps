/* eslint-disable playwright/no-conditional-in-test */

import { expect, test } from '@maps/playwright';

import {
  lumpSumScenario,
  newDetailsPageSummary,
} from '../data/scenarioDetails';
import { dcAccruedAndEriUnlikely as dataScenario2 } from '../data/scenarioDetails';
import BarChart from '../pages/components/BarChart';
import { PensionType } from '../types/barChartScenario.types';

/**
 * @tests User Story 36780 and 36781
 * @scenario The newDetailsPage_Summary test scenario contains 6 pensions that cover the following scenarios:
 *    - DB Pension scenario for no available values.
 *    - DB pension scenario for unavailable estimate at retirement, but has latest values.
 *    - DB pension scenario for both latest value and estimate at retirement values.
 *    - DC pension scenario for only estimated retirement values.
 *    - DC pension scenario for no available values.
 *    - DC pension with both latest and estimated values.
 *
 *  And 3 pensions without an estimated income for unhappy paths.
 *    - DC pension without estimated income and unavailable chart data.
 *
 *
 *
 *  @test User Story 38985
 *  - Doughnut chart tooltip text is displayed correctly
 *  - Doughnut chart tooltip text is not displayed
 *  - Estimate retiment year is displayed/unavailable
 *  - Estimate value amount is displayed/unavailable
 *  - Latest Value year is displayed/unavailable
 *  - Latest Value amount is displayed/unavailable
 *
 *
 *
 * @tests Test Case 37923 [AC0] Bar chart colours (DC Pension)
 * @tests Test Case 37924 [AC0] Bar chart colours (DB Pension)
 *
 * @tests Test Case 37500 [AC1, AC2] Bar chart component titles (DB Pension)
 * @tests Test Case 37490 [AC1, AC2] Bar chart component titles (DC Pension)
 *
 * @tests Test Case 37501 [AC3] Latest value bar chart: Value Illustration date exists (DB Pension)
 * @tests Test Case 37491 [AC3] Latest value bar chart: Value Illustration date exists (DC Pension)
 * @tests Test Case 37502 [AC3] Latest value bar chart: Value Illustration date does not exist (DB Pension)
 * @tests Test Case 37492 [AC3] Latest value bar chart: Value Illustration date does not exist (DC Pension)
 *
 * @tests Test Case 37503 [AC4] Estimate at retirement bar chart: Retirement Date exists (DB Pension)
 * @tests Test Case 37493 [AC4] Estimate at retirement bar chart: Retirement Date exists (DC Pension)
 * @tests Test Case 37505 [AC4] Estimate at retirement bar chart: Retirement Date does not exist (DB Pension)
 * @tests Test Case 37494 [AC4] Estimate at retirement bar chart: Retirement Date does not exist (DC Pension)
 *
 * @tests Test Case 37506 [AC5] Latest value bar chart: Annual amount and Monthly amount have a value (DB Pension)
 * @tests Test Case 37495 [AC5] Latest value bar chart: Annual amount and Monthly amount have a value (DC Pension)
 * @tests Test Case 37507 [AC5] Latest value bar chart: Annual amount and Monthly amount have no value (DB Pension)
 * @tests Test Case 37496 [AC5] Latest value bar chart: Annual amount and Monthly amount have no value (DC Pension)
 *
 * @tests Test Case 37508 [AC6] Estimate at retirement bar chart: Annual amount and Monthly amount have a value (DB Pension)
 * @tests Test Case 37497 [AC6] Estimate at retirement bar chart: Annual amount and Monthly amount have a value (DC Pension)
 * @tests Test Case 37509 [AC6] Estimate at retirement bar chart: Annual amount and Monthly amount have no value (DB Pension)
 * @tests Test Case 37498 [AC6] Estimate at retirement bar chart: Annual amount and Monthly amount have no value (DC Pension)
 *
 * @tests Test Case 37510 [AC7] Bar chart heights (DB Pension)
 * @tests Test Case 37499 [AC7] Bar chart heights (DC Pension)
 *
 * @tests Test Case 37890 [AC8] Bar chart heights: no Estimate at retirement value but Latest value exists (DB Pension)
 * @tests Test Case 37889 [AC8] Bar chart heights: no Estimate at retirement value but Latest value exists (DC Pension)
 *
 *
 * @tests Test Case 37520 [AC1, AC2, AC3] Doughnut chart titles (DC Pension)
 *
 * @tests Test Case 37524 [AC4] Latest value doughnut chart: Value Illustration Date has a value (DC Pension)
 * @tests Test Case 37525 [AC4] Latest value doughnut chart: Value Illustration Date does not have a value (DC Pension)
 *
 * @tests Test Case 37531 [AC5] Estimate at retirement doughnut chart: Retirement Date has a value (DC Pension)
 * @tests Test Case 37532 [AC5] Estimate at retirement doughnut chart: Retirement Date does not have a value (DC Pension)
 *
 * @tests Test Case 37534 [AC6] Latest value doughnut chart: PensionArrangement.BenefitIllustration has a value (DC Pension)
 * @tests Test Case 37537 [AC6] Latest value doughnut chart: PensionArrangement.BenefitIllustration has no value (DC Pension)
 *
 * @tests Test Case 37539 [AC7] Estimate at retirement doughnut chart: PensionArrangement.BenefitIllustration has a value (DC Pension)
 * @tests Test Case 37549 [AC7] Estimate at retirement doughnut chart: PensionArrangement.BenefitIllustration has no value (DC Pension)
 *
 * @tests Test Case 37552 [AC8]  Doughnut chart colours: annual and monthly amounts are populated for Latest Value and Estimate at Retirement doughnut charts (DC Pension)
 *
 * @tests Test Case 37554 [AC9] Doughnut chart colours: annual and monthly amounts are populated for Latest Value chart but not for Estimate at Retirement chart (DC Pension)
 *
 * @tests Test Case 37556 [AC10] Annual and monthly amounts are populated for Estimate at Retirement chart but not for Latest Value chart (DC Pension)
 *
 * @tests Test Case 38441 [AC11] AP greater than ERI (DC Pension)
 *
 * @tests Test Case 37448 [AC12] AP equal to ERI (DC Pension)
 */
test.describe('Pension Details page - Income and Values Bar Chart/Donut Chart', () => {
  test.describe('Using saved sessions', () => {
    test.beforeEach(async ({ commonSessions }) => {
      const scenarioName = newDetailsPageSummary.option;
      await commonSessions.navigateToPensionsFoundPage(scenarioName);
    });

    test('Bar chart is rendering the correct dates, values and sizes across all scenarios in green channel', async ({
      page,
      barChart,
      commonHelpers,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();

      const schemeNames = [
        'Prime Lifetime Fund',
        'Capital Gains Retirement',
        'Secure Growth',
        'Pinnacle Pension Trust',
        'Horizon Income Plan',
        'Dynamic Future Fund',
      ];
      for (const schemeName of schemeNames) {
        const pension = newDetailsPageSummary.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        await pensionBreakdownPage.viewDetailsOfPension(schemeName);
        await pensionDetailsPage.assertHeading(schemeName);
        await pensionDetailsPage.selectTab('Income & values');

        const url = page.url();
        expect(url).toContain('/pension-details/pension-income-and-values');

        const subHeadingText = await pensionDetailsPage.getSubHeadingText();
        expect(subHeadingText).toEqual(
          pensionDetailsPage.incomeValuesSubHeadingText,
        );

        // Extract all the relevent information from the bar chart.
        const headerText = await barChart.getBarHeaderText();

        const leftBarLegendText = (
          await barChart.getBarLegendText('left')
        ).trim();
        const rightBarLegendText = (
          await barChart.getBarLegendText('right')
        ).trim();

        const leftBarColour = await barChart.getBarColour('left');
        const rightBarColour = await barChart.getBarColour('right');

        const leftBarHeight = await barChart.getBarHeight('left');
        const rightBarHeight = await barChart.getBarHeight('right');

        const leftBarLabelText = await barChart.getBarLabelText('left');
        const rightBarLabelText = await barChart.getBarLabelText('right');

        // AC1, AC2, AC3, AC4 - Tests bar chart headers & Latest Value and Retirement Value Illustration Dates
        const latestIllustrationYear =
          pension?.barChartData?.latestIllustrationYear;
        const retirementIllustrationYear =
          pension?.barChartData?.retirementIllustrationYear;

        // If there's no left year, then it should just have the label.
        let expectedLatestValueLegend = '';
        if (!latestIllustrationYear) {
          expectedLatestValueLegend = 'Latest value';
        } else {
          expectedLatestValueLegend = `Latest value\n${latestIllustrationYear}`;
        }

        let expectedRetirementLegend = '';
        if (!retirementIllustrationYear && !pension?.retirementYear) {
          expectedRetirementLegend = 'Estimate at retirement';
        } else {
          expectedRetirementLegend = `Estimate at retirement\n${
            retirementIllustrationYear ?? pension?.retirementYear
          }`;
        }

        expect(headerText).toEqual('Estimated income');
        expect(leftBarLegendText).toEqual(expectedLatestValueLegend);
        expect(rightBarLegendText).toEqual(expectedRetirementLegend);

        // AC0 - Tests bar chart colours.
        const barColours: Record<PensionType, string> = {
          DC: 'bg-teal-700',
          DB: 'bg-purple-650',
        };

        const expectedLeftBarColour = 'bg-slate-350';
        const expectedRightBarColour = barColours[pension?.pensionType];

        // Even though the estimated retirement value may be unavailable, it still is the expected colour by 0px tall.
        expect(leftBarColour).toEqual(expectedLeftBarColour);
        expect(rightBarColour).toEqual(expectedRightBarColour);

        // AC5, AC6 - Tests latest value figures.
        const { monthly: latestMonthly, yearly: latestYearly } =
          pension?.barChartData?.latestValues ?? {};

        const { monthly: retirementMonthly, yearly: retirementYearly } =
          pension?.barChartData?.estimateAtRetirement ?? {};

        const expectedLatestValueLabel = commonHelpers.buildExpectedChartLabel(
          latestMonthly,
          latestYearly,
        );

        const expectedRetirementLabel = commonHelpers.buildExpectedChartLabel(
          retirementMonthly,
          retirementYearly,
        );

        expect(leftBarLabelText).toEqual(expectedLatestValueLabel);
        expect(rightBarLabelText).toEqual(expectedRetirementLabel);

        // AC7, AC8 - Tests bar chart heights.
        const expectedRetirementBarHeight = pension?.barChartData
          ?.estimateAtRetirement
          ? BarChart.MaxBarHeightInPixels
          : BarChart.MinBarHeightInPixels;
        expect(rightBarHeight).toEqual(expectedRetirementBarHeight);

        const expectedLeftBarHeight = barChart.calculateLeftBarHeight(
          pension?.barChartData,
        );
        expect(leftBarHeight).toBeGreaterThanOrEqual(expectedLeftBarHeight - 1);
        expect(leftBarHeight).toBeLessThanOrEqual(expectedLeftBarHeight + 1);

        // Take it back to the pension breakdown for the next pension.
        await commonHelpers.clickLink('Back');
        await pensionBreakdownPage.pageLoads();
      }
    });

    test('Bar chart is rendering unavailable values across scenarios in yellow channel', async ({
      page,
      barChart,
      commonHelpers,
      pensionsFoundPage,
      pensionDetailsPage,
      pensionBreakdownPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();

      const schemeNames = [
        'Stellar Security Plan',
        'Visionary Pension Trust',
        'Evergreen Retirement Fund',
      ];
      for (const schemeName of schemeNames) {
        const pension = newDetailsPageSummary.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        await pensionBreakdownPage.viewDetailsOfPension(schemeName);
        await pensionDetailsPage.assertHeading(schemeName);
        await pensionDetailsPage.selectTab('Income & values');

        const url = page.url();
        expect(url).toContain('/pension-details/pension-income-and-values');

        const subHeadingText = await pensionDetailsPage.getSubHeadingText();
        expect(subHeadingText).toEqual(
          pensionDetailsPage.incomeValuesSubHeadingText,
        );

        // Extract all the relevent information from the bar chart.
        const headerText = await barChart.getBarHeaderText();

        const leftBarLegendText = (
          await barChart.getBarLegendText('left')
        ).trim();
        const rightBarLegendText = (
          await barChart.getBarLegendText('right')
        ).trim();

        const leftBarColour = await barChart.getBarColour('left');
        const rightBarColour = await barChart.getBarColour('right');

        const leftBarHeight = await barChart.getBarHeight('left');
        const rightBarHeight = await barChart.getBarHeight('right');

        const leftBarLabelText = await barChart.getBarLabelText('left');
        const rightBarLabelText = await barChart.getBarLabelText('right');

        // AC1, AC2, AC3, AC4 - Tests bar chart headers & Latest Value and Retirement Value Illustration Dates
        const latestIllustrationYear =
          pension?.barChartData?.latestIllustrationYear;
        const retirementIllustrationYear =
          pension?.barChartData?.retirementIllustrationYear;

        // If there's no left year, then it should just have the label.
        let expectedLatestValueLegend = '';
        if (latestIllustrationYear) {
          expectedLatestValueLegend = `Latest value\n${latestIllustrationYear}`;
        } else {
          expectedLatestValueLegend = 'Latest value';
        }

        let expectedRetirementLegend = '';
        if (!retirementIllustrationYear && !pension?.retirementYear) {
          expectedRetirementLegend = 'Estimate at retirement';
        } else {
          expectedRetirementLegend = `Estimate at retirement\n${
            retirementIllustrationYear ?? pension?.retirementYear
          }`;
        }

        expect(headerText).toEqual('Estimated income');
        expect(leftBarLegendText).toEqual(expectedLatestValueLegend);
        expect(rightBarLegendText).toEqual(expectedRetirementLegend);

        // AC0 - Tests bar chart colours.
        const barColours: Record<PensionType, string> = {
          DC: 'bg-teal-700',
          DB: 'bg-purple-650',
        };

        const expectedLeftBarColour = 'bg-slate-350';
        const expectedRightBarColour = barColours[pension?.pensionType];

        // Even though the estimated retirement value may be unavailable, it still is the expected colour by 0px tall.
        expect(leftBarColour).toEqual(expectedLeftBarColour);
        expect(rightBarColour).toEqual(expectedRightBarColour);

        // AC5, AC6 - Tests latest value figures.
        const { monthly: latestMonthly, yearly: latestYearly } =
          pension?.barChartData.latestValues ?? {};

        const { monthly: retirementMonthly, yearly: retirementYearly } =
          pension?.barChartData.estimateAtRetirement ?? {};

        const expectedLatestValueLabel = commonHelpers.buildExpectedChartLabel(
          latestMonthly,
          latestYearly,
        );

        const expectedRetirementLabel = commonHelpers.buildExpectedChartLabel(
          retirementMonthly,
          retirementYearly,
        );

        expect(leftBarLabelText).toEqual(expectedLatestValueLabel);
        expect(rightBarLabelText).toEqual(expectedRetirementLabel);

        // AC7, AC8 - Tests bar chart heights.
        const expectedRetirementBarHeight = pension?.barChartData
          .estimateAtRetirement
          ? BarChart.MaxBarHeightInPixels
          : BarChart.MinBarHeightInPixels;
        expect(rightBarHeight).toEqual(expectedRetirementBarHeight);

        const expectedLeftBarHeight = barChart.calculateLeftBarHeight(
          pension?.barChartData,
        );
        expect(leftBarHeight).toBeGreaterThanOrEqual(expectedLeftBarHeight - 1);
        expect(leftBarHeight).toBeLessThanOrEqual(expectedLeftBarHeight + 1);

        // Take it back to the pending pensions page for the next pension.
        await commonHelpers.clickLink('Back');
        await pensionBreakdownPage.pageLoads();
      }
    });

    test('Donut chart is rendering the correct dates, values and sizes across all scenarios', async ({
      page,
      commonHelpers,
      donutChart,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();

      const schemeNames = [
        'Prime Lifetime Fund',
        'Capital Gains Retirement',
        'Secure Growth',
        'Pinnacle Pension Trust',
        'Horizon Income Plan',
        'Dynamic Future Fund',
      ];
      for (const schemeName of schemeNames) {
        const pension = newDetailsPageSummary.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        // Gets text indicating whether a pension is a DC or DB pension
        const pensionCardType = await pensionBreakdownPage
          .getPensionCardType(schemeName)
          .innerText();

        // Donut chart is only available on DC pensions
        if (pensionCardType == 'Defined contribution') {
          await pensionBreakdownPage.viewDetailsOfPension(pension?.schemeName);
          await pensionDetailsPage.assertHeading(schemeName);
          await pensionDetailsPage.selectTab('Income & values');

          const url = page.url();
          expect(url).toContain('/pension-details/pension-income-and-values');

          const subHeadingText = await pensionDetailsPage.getSubHeadingText();
          expect(subHeadingText).toEqual(
            pensionDetailsPage.incomeValuesSubHeadingText,
          );

          // Extract all the relevent information from the bar chart.
          const headerText = await donutChart.donutHeaderText;

          const leftDonutLegendText = await donutChart.getDonutLegendText(
            'left',
          );
          const rightDonutLegendText = await donutChart.getDonutLegendText(
            'right',
          );

          const leftDonutLabelText = await donutChart.getDonutLabelText('left');
          const rightDonutLabelText = await donutChart.getDonutLabelText(
            'right',
          );

          // AC1, AC2, AC3, AC4 - Tests bar chart headers & Latest Value and Retirement Value Illustration Dates
          const latestIllustrationYear =
            pension?.donutChartData?.latestIllustrationYear;
          const retirementIllustrationYear =
            pension?.donutChartData?.retirementIllustrationYear;

          // If there's no left year, then it should just have the label.
          let expectedLatestValueLegend = '';
          if (latestIllustrationYear) {
            expectedLatestValueLegend = `Latest value\n${latestIllustrationYear}`;
          } else {
            expectedLatestValueLegend = 'Latest value';
          }

          let expectedRetirementLegend = '';
          if (!retirementIllustrationYear && !pension?.retirementYear) {
            expectedRetirementLegend = 'Estimate at retirement';
          } else {
            expectedRetirementLegend = `Estimate at retirement\n${
              retirementIllustrationYear ?? pension?.retirementYear
            }`;
          }

          expect(headerText).toEqual('Pot value');
          expect(leftDonutLegendText).toEqual(expectedLatestValueLegend);
          expect(rightDonutLegendText).toEqual(expectedRetirementLegend);

          // Tooltip text and open & closed states
          const potValueToolTipIconState = page.locator(
            'h3[data-testid="donut-heading"] label[data-testid="tooltip-icon"]',
          );

          // tooltip closed by default
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'false',
          );

          // tooltip open
          await commonHelpers.clickTooltip('donut-heading');
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'true',
          );

          // tooltip closed
          await commonHelpers.clickTooltip('donut-heading');
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'false',
          );

          // Get colours from webpage
          const leftDonutColours = await donutChart.getColoursFromDom('left');
          const rightDonutColours = await donutChart.getColoursFromDom('right');

          const leftDonutColoursPath = leftDonutColours.path;
          const leftDonutColoursOuter = leftDonutColours.outer;
          const leftDonutColoursInner = leftDonutColours.inner;

          const rightDonutColoursPath = rightDonutColours.path;
          const rightDonutColoursOuter = rightDonutColours.outer;
          const rightDonutColoursInner = rightDonutColours.inner;

          // Get colours from data
          let leftDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
          if (pension?.donutChartData?.latestValue == null) {
            leftDonutFilledStatus = 'unfilled';
          }

          let rightDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
          if (pension?.donutChartData?.estimateAtRetirement == null) {
            rightDonutFilledStatus = 'unfilled';
          }

          const leftDonutColoursFromData = await donutChart.getColoursFromData(
            'left',
            leftDonutFilledStatus,
          );
          const rightDonutColoursFromData = await donutChart.getColoursFromData(
            'right',
            rightDonutFilledStatus,
          );

          // check that value from data scenario and value from webpage match
          expect(leftDonutColoursPath).toEqual(leftDonutColoursFromData.path);
          expect(leftDonutColoursOuter).toEqual(leftDonutColoursFromData.outer);
          expect(leftDonutColoursInner).toEqual(leftDonutColoursFromData.inner);

          expect(rightDonutColoursPath).toEqual(rightDonutColoursFromData.path);
          expect(rightDonutColoursOuter).toEqual(
            rightDonutColoursFromData.outer,
          );
          expect(rightDonutColoursInner).toEqual(
            rightDonutColoursFromData.inner,
          );

          // AC5, AC6 - Tests latest value figures.
          const latestValue: any = pension?.donutChartData?.latestValue;
          const retirementValue: any =
            pension?.donutChartData?.estimateAtRetirement;

          // Check latest value and estimate at retirement amounts (checking for 'Unavailable' text when value is null)
          let expectedLatestValueAmount = '';
          if (latestValue) {
            expectedLatestValueAmount =
              await pensionDetailsPage.formatCurrencyStringWithCommas(
                latestValue,
              );
          } else {
            expectedLatestValueAmount = 'Unavailable';
          }

          let expectedRetirementAmount = '';
          if (retirementValue) {
            expectedRetirementAmount =
              await pensionDetailsPage.formatCurrencyStringWithCommas(
                retirementValue,
              );
          } else {
            expectedRetirementAmount = 'Unavailable';
          }

          expect(leftDonutLabelText).toEqual(expectedLatestValueAmount);
          expect(rightDonutLabelText).toEqual(expectedRetirementAmount);

          // calculate donut filled percentage from webpage
          const leftDonutFilledPercentage =
            await donutChart.calculateFilledPercentage('left');
          const rightDonutFilledPercentage =
            await donutChart.calculateFilledPercentage('right');

          // calculate donut filled percentage from data
          const donutFilledPerecentagesFromData =
            await donutChart.calculateDonutFillFromData(
              latestValue,
              retirementValue,
            );

          const leftDonutPercentageFromData =
            donutFilledPerecentagesFromData.leftPercentage;
          const rightDonutPercentageFromData =
            donutFilledPerecentagesFromData.rightPercentage;

          expect(leftDonutPercentageFromData).toEqual(
            leftDonutFilledPercentage,
          );
          expect(rightDonutPercentageFromData).toEqual(
            rightDonutFilledPercentage,
          );

          // Take it back to the pension breakdown for the next pension.
          await commonHelpers.clickLink('Back');
          await pensionBreakdownPage.pageLoads();
        }
      }
    });

    test('Donut chart is rendering unavailable data for pending pensions', async ({
      page,
      commonHelpers,
      donutChart,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
    }) => {
      await pensionsFoundPage.clickSeeYourPensions();

      const schemeNames = [
        'Stellar Security Plan',
        'Visionary Pension Trust',
        'Evergreen Retirement Fund',
      ];
      for (const schemeName of schemeNames) {
        const pension = newDetailsPageSummary.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        // Gets text indicating whether a pension is a DC or DB pension
        const pensionCardType = await pensionBreakdownPage
          .getPensionCardType(schemeName)
          .innerText();

        // Donut chart is only available on DC pensions
        if (pensionCardType == 'Defined contribution') {
          await pensionBreakdownPage.viewDetailsOfPension(schemeName);
          await pensionDetailsPage.assertHeading(schemeName);
          await pensionDetailsPage.selectTab('Income & values');

          const url = page.url();
          expect(url).toContain('/pension-details/pension-income-and-values');

          const subHeadingText = await pensionDetailsPage.getSubHeadingText();
          expect(subHeadingText).toEqual(
            pensionDetailsPage.incomeValuesSubHeadingText,
          );

          // Extract all the relevent information from the bar chart.
          const headerText = await donutChart.donutHeaderText;

          const leftDonutLegendText = await donutChart.getDonutLegendText(
            'left',
          );
          const rightDonutLegendText = await donutChart.getDonutLegendText(
            'right',
          );

          const leftDonutLabelText = await donutChart.getDonutLabelText('left');
          const rightDonutLabelText = await donutChart.getDonutLabelText(
            'right',
          );

          // AC1, AC2, AC3, AC4 - Tests bar chart headers & Latest Value and Retirement Value Illustration Dates
          const latestIllustrationYear =
            pension?.donutChartData?.latestIllustrationYear;
          const retirementIllustrationYear =
            pension?.donutChartData?.retirementIllustrationYear;

          // If there's no left year, then it should just have the label.
          let expectedLatestValueLegend = '';
          if (!latestIllustrationYear) {
            expectedLatestValueLegend = 'Latest value';
          } else {
            expectedLatestValueLegend = `Latest value\n${latestIllustrationYear}`;
          }

          let expectedRetirementLegend = '';
          if (!retirementIllustrationYear && !pension?.retirementYear) {
            expectedRetirementLegend = 'Estimate at retirement';
          } else {
            expectedRetirementLegend = `Estimate at retirement\n${
              retirementIllustrationYear ?? pension?.retirementYear
            }`;
          }

          expect(headerText).toEqual('Pot value');
          expect(leftDonutLegendText).toEqual(expectedLatestValueLegend);
          expect(rightDonutLegendText).toEqual(expectedRetirementLegend);

          // Tooltip text and open & closed states
          const potValueToolTipIconState = page.locator(
            'h3[data-testid="donut-heading"] label[data-testid="tooltip-icon"]',
          );

          // tooltip closed by default
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'false',
          );

          // tooltip open
          await commonHelpers.clickTooltip('donut-heading');
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'true',
          );

          // tooltip closed
          await commonHelpers.clickTooltip('donut-heading');
          await expect(potValueToolTipIconState).toHaveAttribute(
            'aria-expanded',
            'false',
          );

          // Get colours from webpage
          const leftDonutColours = await donutChart.getColoursFromDom('left');
          const rightDonutColours = await donutChart.getColoursFromDom('right');

          const leftDonutColoursPath = leftDonutColours.path;
          const leftDonutColoursOuter = leftDonutColours.outer;
          const leftDonutColoursInner = leftDonutColours.inner;

          const rightDonutColoursPath = rightDonutColours.path;
          const rightDonutColoursOuter = rightDonutColours.outer;
          const rightDonutColoursInner = rightDonutColours.inner;

          // Get colours from data
          let leftDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
          if (pension?.donutChartData?.latestValue == null) {
            leftDonutFilledStatus = 'unfilled';
          }

          let rightDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
          if (pension?.donutChartData?.estimateAtRetirement == null) {
            rightDonutFilledStatus = 'unfilled';
          }

          const leftDonutColoursFromData = await donutChart.getColoursFromData(
            'left',
            leftDonutFilledStatus,
          );
          const rightDonutColoursFromData = await donutChart.getColoursFromData(
            'right',
            rightDonutFilledStatus,
          );

          // check that value from data scenario and value from webpage match
          expect(leftDonutColoursPath).toEqual(leftDonutColoursFromData.path);
          expect(leftDonutColoursOuter).toEqual(leftDonutColoursFromData.outer);
          expect(leftDonutColoursInner).toEqual(leftDonutColoursFromData.inner);

          expect(rightDonutColoursPath).toEqual(rightDonutColoursFromData.path);
          expect(rightDonutColoursOuter).toEqual(
            rightDonutColoursFromData.outer,
          );
          expect(rightDonutColoursInner).toEqual(
            rightDonutColoursFromData.inner,
          );

          // AC5, AC6 - Tests latest value figures.
          const latestValue: any = pension?.donutChartData?.latestValue;
          const retirementValue: any =
            pension?.donutChartData?.estimateAtRetirement;

          // Check latest value and estimate at retirement amounts (checking for 'Unavailable' text when value is null)
          let expectedLatestValueAmount = '';
          if (!latestValue) {
            expectedLatestValueAmount = 'Unavailable';
          } else {
            expectedLatestValueAmount =
              await pensionDetailsPage.formatCurrencyStringWithCommas(
                latestValue,
              );
          }

          let expectedRetirementAmount = '';
          if (!retirementValue) {
            expectedRetirementAmount = 'Unavailable';
          } else {
            expectedRetirementAmount =
              await pensionDetailsPage.formatCurrencyStringWithCommas(
                retirementValue,
              );
          }

          expect(leftDonutLabelText).toEqual(expectedLatestValueAmount);
          expect(rightDonutLabelText).toEqual(expectedRetirementAmount);

          // calculate donut filled percentage from webpage
          const leftDonutFilledPercentage =
            await donutChart.calculateFilledPercentage('left');
          const rightDonutFilledPercentage =
            await donutChart.calculateFilledPercentage('right');

          // calculate donut filled percentage from data
          const donutFilledPerecentagesFromData =
            await donutChart.calculateDonutFillFromData(
              latestValue,
              retirementValue,
            );

          const leftDonutPercentageFromData =
            donutFilledPerecentagesFromData.leftPercentage;
          const rightDonutPercentageFromData =
            donutFilledPerecentagesFromData.rightPercentage;

          expect(leftDonutPercentageFromData).toEqual(
            leftDonutFilledPercentage,
          );
          expect(rightDonutPercentageFromData).toEqual(
            rightDonutFilledPercentage,
          );

          // Take it back to the pending pension page for the next pension.
          await commonHelpers.clickLink('Back');
          await pensionBreakdownPage.pageLoads();
        }
      }
    });
  });

  test.describe('Not using saved sessions', () => {
    test.beforeEach(async ({ commonHelpers }) => {
      await commonHelpers.navigateToEmulator('en');
    });

    test('Donut chart - AP is greater than ERI value / AP is equal to ERI value', async ({
      commonHelpers,
      donutChart,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
    }) => {
      await commonHelpers.navigatetoPensionsFoundPage(
        dataScenario2.option,
        commonHelpers,
      );
      await pensionsFoundPage.clickSeeYourPensions();

      for (const pension of dataScenario2.pensions) {
        await pensionBreakdownPage.viewDetailsOfPension(pension.schemeName);
        await pensionDetailsPage.assertHeading(pension.schemeName);
        await pensionDetailsPage.selectTab('Income & values');

        const leftDonutLabelText = await donutChart.getDonutLabelText('left');
        const rightDonutLabelText = await donutChart.getDonutLabelText('right');

        // Get colours from webpage
        const leftDonutColours = await donutChart.getColoursFromDom('left');
        const rightDonutColours = await donutChart.getColoursFromDom('right');

        const leftDonutColoursPath = leftDonutColours.path;
        const leftDonutColoursOuter = leftDonutColours.outer;
        const leftDonutColoursInner = leftDonutColours.inner;

        const rightDonutColoursPath = rightDonutColours.path;
        const rightDonutColoursOuter = rightDonutColours.outer;
        const rightDonutColoursInner = rightDonutColours.inner;

        // Get colours from data
        let leftDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
        if (pension.donutChartData?.latestValue == null) {
          leftDonutFilledStatus = 'unfilled';
        }

        let rightDonutFilledStatus: 'filled' | 'unfilled' = 'filled';
        if (pension.donutChartData?.estimateAtRetirement == null) {
          rightDonutFilledStatus = 'unfilled';
        }

        const leftDonutColoursFromData = await donutChart.getColoursFromData(
          'left',
          leftDonutFilledStatus,
        );
        const rightDonutColoursFromData = await donutChart.getColoursFromData(
          'right',
          rightDonutFilledStatus,
        );

        // check variables
        expect(leftDonutColoursPath).toEqual(leftDonutColoursFromData.path);
        expect(leftDonutColoursOuter).toEqual(leftDonutColoursFromData.outer);
        expect(leftDonutColoursInner).toEqual(leftDonutColoursFromData.inner);

        expect(rightDonutColoursPath).toEqual(rightDonutColoursFromData.path);
        expect(rightDonutColoursOuter).toEqual(rightDonutColoursFromData.outer);
        expect(rightDonutColoursInner).toEqual(rightDonutColoursFromData.inner);

        // AC5, AC6 - Tests latest value figures.
        const latestValue = pension.donutChartData?.latestValue;
        const retirementValue = pension.donutChartData?.estimateAtRetirement;

        // Check latest value and estimate at retirement amounts (checking for 'Unavailable' text when value is null)
        let expectedLatestValueAmount = '';
        if (!latestValue) {
          expectedLatestValueAmount = 'Unavailable';
        } else {
          expectedLatestValueAmount =
            await pensionDetailsPage.formatCurrencyStringWithCommas(
              latestValue,
            );
        }

        let expectedRetirementAmount = '';
        if (!retirementValue) {
          expectedRetirementAmount = 'Unavailable';
        } else {
          expectedRetirementAmount =
            await pensionDetailsPage.formatCurrencyStringWithCommas(
              retirementValue,
            );
        }

        expect(leftDonutLabelText).toEqual(expectedLatestValueAmount);
        expect(rightDonutLabelText).toEqual(expectedRetirementAmount);

        // calculate donut filled percentage from webpage
        const leftDonutFilledPercentage =
          await donutChart.calculateFilledPercentage('left');
        const rightDonutFilledPercentage =
          await donutChart.calculateFilledPercentage('right');

        // calculate donut filled percentage from data
        const donutFilledPerecentagesFromData =
          await donutChart.calculateDonutFillFromData(
            latestValue,
            retirementValue,
          );

        const leftDonutPercentageFromData =
          donutFilledPerecentagesFromData.leftPercentage;
        const rightDonutPercentageFromData =
          donutFilledPerecentagesFromData.rightPercentage;

        // compare value from data to value from webpage
        expect(leftDonutPercentageFromData).toEqual(leftDonutFilledPercentage);
        expect(rightDonutPercentageFromData).toEqual(
          rightDonutFilledPercentage,
        );

        // Take it back to the pension breakdown for the next pension.
        await commonHelpers.clickLink('Back');
        await pensionBreakdownPage.pageLoads();
      }
    });

    test('Pensions Details page - Income and Values tab, - verify tool tip statment, dates and value for AP and ERI in lumpsum data scenarios', async ({
      page,
      commonHelpers,
      donutChart,
      pensionBreakdownPage,
      pensionDetailsPage,
      pensionsFoundPage,
    }) => {
      await commonHelpers.navigatetoPensionsFoundPage(
        lumpSumScenario.option,
        commonHelpers,
      );
      await pensionsFoundPage.clickSeeYourPensions();

      const schemeNames = [
        'Horizon Lifetime Plan',
        'Summit Gold Pension',
        'GreenOak Retirement Plan',
        'Oakfield Secure Pension',
        'SilverTree Future Fund',
      ];
      for (const schemeName of schemeNames) {
        const pension: any = lumpSumScenario.pensions.find(
          (p) => p.schemeName === schemeName,
        );
        await pensionBreakdownPage.viewDetailsOfPension(schemeName);
        await pensionDetailsPage.assertHeading(pension?.schemeName);
        await pensionDetailsPage.selectTab('Income & values');
        expect(page.url()).toContain(
          '/pension-details/pension-income-and-values',
        );

        const eriPotValue = pension?.ERIPotValue;
        const apPotValue = pension?.APPotValue;
        const estimateRetirementYear = pension?.EstimateRetirementYear;
        const tooltipStatement = lumpSumScenario.doughtnutTooltipStatement;
        const latestValueYear = pension?.LatestValueYear;

        //plan reference number & tooltip text, Retirement date, information last updated & tooltip text
        await donutChart.openToolTip();
        const donutData = await donutChart.donutDataFromPage;
        // Verify tooltip text is displayed correctly and donut data contains the correct values
        // donut shaded area already covered in previous tests
        expect(donutData).toContain(tooltipStatement);
        expect(donutData.includes(eriPotValue)).toBe(true);
        expect(donutData.includes(apPotValue)).toBe(true);
        expect(donutData.includes(estimateRetirementYear)).toBe(true);
        expect(donutData.includes(latestValueYear)).toBe(true);

        await commonHelpers.clickLink('Back');
        await pensionBreakdownPage.pageLoads();
      }
    });
  });
});
