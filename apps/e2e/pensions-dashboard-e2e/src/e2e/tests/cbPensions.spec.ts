import { expect, test } from '@maps/playwright';

import { cbPensions } from '../data/scenarioDetails';
import { expectedTimelineDataCB } from '../data/timelineScenarioDetails';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';

/**
 * @tests User Story 50122 FE - CB - Pension Card
 * @tests Test Case 51222: 50122 AC1, 3, 4 TestCase1 : CB pension card with recurring income
 * @tests Test Case 51224: 50122 AC2, 3, 4 TestCase2 : CB Pension card lump sum only
 *
 * @tests User Story 50131: FE - CB - Timeline Page
 * @tests Test Case 51255: 50131 AC8 TestCase6 : No CB lump sum amount in timeline for non CB Pension
 * @tests Test Case 51246: 50131 AC1, 4, 13 TestCase1 : CB Verify Timeline Key
 * @tests Test Case 51266: 50131 AC10 TestCase8: Tooltip displayed for DB lump sum
 * @tests Test Case 51267: 50131 AC12, 13 Test Case 9 : Both lump sums displayed in the correct order
 * @tests Test Case 51247: 50131 AC2, 4, 13 TestCase2 : CB is displayed on the timeline
 * @tests Test Case 51248: 50131 AC3 TestCase3 : CB icon and lebal not displayed in timeline when No CB pension
 * @tests Test Case 51251: 50131 AC5, 13 TestCase4 : CB Lump sum displayed at change year level
 * @tests Test Case 51253: 50131 AC6, 7, 13 TestCase5 : CB Lump sum tooltip on timeline
 * @tests Test Case 51258: 50131 AC9, 11, 13 TestCase7 : DB Lump sum amount displayed at change year level
 *
 *
 * @tests User Story 50135 FE - CB - Pension Details - Summary tab
 * @tests Test Case 51348: 50135 AC1, 2 TestCase1 : Summary Box reflects CB Styling
 * @tests Test Case 51354: 50135 AC10 : TestCase6 : Verify Mobile layout CB Summary Tab
 * @tests Test Case 51349: 50135 AC3 TestCase2 : Verify CB tooltip on Summary Tab
 * @tests Test Case 51351: 50135 AC4, 6, 8 TestCase3 : Verify Summary Tab content CBL
 * @tests Test Case 51352: 50135 AC5,7 TestCase4 : Verify Summary Tab content CBS
 *
 * @tests User Story 50136: FE - CB - Pension Details - Income and Values tab
 * @tests Test Case 51371: 50136 AC2 TestCase2 : Verify CB accordion wording and logic - Income and Values Tab
 * @tests Test Case 51372: 50136 AC3, 4 TestCase3 : Verify CB recurring graphs, and pot Value tooltip on income and values tab
 * @tests Test Case 51373: 50136 AC5, 6, 7, 8 TestCase4 : CBL display and tooltip - Income and values tab
 * @tests Test Case 51374: 50136 AC9 TestCase5 : Verify Content and layout for Mobile - Income and values tab
 *
 * @tests User Story 55022: Remove H&S banner from /pension-details
 * @tests Test Case 55193 [AC1, AC2]: Help and Support Banner and Anchor removed from Pension Details page
 */

test.describe('CB Pension Types', () => {
  test.beforeEach(async ({ commonSessions }) => {
    await commonSessions.navigateToPensionBreakdown(cbPensions.option);
  });

  test('Pension Breakdown page - Pension card & Timeline', async ({
    page,
    pensionBreakdownPage,
    isMobile,
    timeline,
  }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const detailsButtonText = 'See details';
    const TimelineTooltipText =
      'This cash balance lump sum is a guaranteed amount of money when you retire. You can choose how to take it, for example by buying an annuity (a guaranteed regular income) or by choosing more flexible income options.';

    // Pension Card
    const schemeNames = ['CB Recurring Scheme', 'CB Lump Sum Scheme'];
    for (const schemeName of schemeNames) {
      const pension: any = cbPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      await expect(
        pensionBreakdownPage.getPensionCard(schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(schemeName),
      ).toContainText(pension.employer);
      await expect(
        pensionBreakdownPage.getAdministratorName(schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(schemeName),
      ).toContainText(detailsButtonText);
    }

    //timeline explainer
    await confirmedPensionsSummary.clickTimelineLinkNonMcCloud();
    expect(await timeline.getTimelineKeyText()).toContain('Cash balance');
    expect(await timeline.getTimelineKeyText()).not.toContain('Lump sum');
    await timeline.togglePensionDropdown('2040', 'View pensions');
    const actualTimelineData = await timeline.getTimelineData(
      expectedTimelineDataCB,
    );
    expect(actualTimelineData).toEqual(expectedTimelineDataCB);

    //timeline Tooltip
    await timeline.clickTimelineTooltip();
    await expect(timeline.tooltipIcon).toHaveAttribute('aria-expanded', 'true');
    expect(await timeline.getTimelineTooltipText()).toContain(
      TimelineTooltipText,
    );
    await timeline.clickTimelineTooltip();
    await expect(timeline.tooltipIcon).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  test('Pension Details Page Summary - CB Recurring Scheme only', async ({
    pensionDetailsPage,
    pensionBreakdownPage,
  }) => {
    const pensionScheme = ['CB Recurring Scheme'];

    for (const schemeName of pensionScheme) {
      const pension = cbPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const summaryCardText = `You could receive ${pension?.estimatedIncome} a month from the first payable date of ${pension?.expectedRetirementDate}.`;
      const recurringCard = pensionBreakdownPage.getPensionCard(
        'CB Recurring Scheme',
      );

      await pensionBreakdownPage.clickSeeDetailsButton(recurringCard);

      // summary sentence
      await expect(pensionDetailsPage.summaryCard).toContainText(
        summaryCardText,
      );

      const potValue = await pensionDetailsPage.getPotValueCallout();
      const potValueText = await potValue
        .getByTestId('pot-value-amount')
        .textContent();

      expect(potValueText).toContain(pension?.APPotValue);
    }
  });

  test('Pension Details Page Summary & Income & values tooltip - CB Lump Sum Scheme only', async ({
    page,
    pensionBreakdownPage,
    pensionDetailsPage,
    isMobile,
  }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const cbLumpSumTooltipText =
      'This cash balance lump sum is a guaranteed amount of money when you retire. You can choose how to take it, for example by buying an annuity (a guaranteed regular income) or by choosing more flexible income options.';

    const pensionScheme = ['CB Lump Sum Scheme'];

    for (const schemeName of pensionScheme) {
      const pension = cbPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const summaryCardText = `Your cash balance could be ${pension?.lumpSum} on the first payable date of ${pension?.expectedRetirementDate}.`;
      const explainerHeading =
        'This cash balance scheme provides a guaranteed lump sum';
      const explainerText =
        'This cash balance scheme is set up to give you a guaranteed lump sum when you retire. You can choose how to take it, for example by buying an annuity (a guaranteed regular income) or by choosing more flexible income options.';
      const { container, heading, description } =
        await confirmedPensionsSummary.getExplainer('CBLUMP');
      const pensionCard =
        pensionBreakdownPage.getPensionCard('CB Lump Sum Scheme');

      await pensionBreakdownPage.clickSeeDetailsButton(pensionCard);

      // summary sentence
      await expect(pensionDetailsPage.summaryCard).toContainText(
        summaryCardText,
      );

      //explainer - warning message only for CB lump sum
      await expect(container).toBeVisible();
      await expect(heading).toHaveText(explainerHeading);
      await expect(description).toContainText(explainerText);

      //navigate to income and values tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        'tab-pension-income-and-values',
        'Income and values',
      );

      //cbLumpSumTooltip
      await pensionBreakdownPage.clickCBLumpSumTooltip();
      await expect(pensionBreakdownPage.cbLumpSumTooltipIcon).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(await pensionBreakdownPage.getCBLumpSumTooltipText()).toContain(
        cbLumpSumTooltipText,
      );
      await pensionBreakdownPage.clickCBLumpSumTooltip();
      await expect(pensionBreakdownPage.cbLumpSumTooltipIcon).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
  });

  test('Pension Details Page Summary Tab & income and values tab', async ({
    page,
    pensionBreakdownPage,
    pensionDetailsPage,
    isMobile,
    barChart,
    donutChart,
    incomeAndValuesAccordions,
  }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const accordionText = `Estimates for this pension are based on your salary and years you’ve been a scheme member, as well as the expected retirement date. They’re also based on the provider’s assumptions about inflation and whether the scheme is active. To help you understand the impact of inflation, the estimated income is shown in today’s money, so you can see what that amount would be worth right now.`;
    const tooltipText =
      ' scheme is a workplace pension where the employer guarantees either a lump sum at retirement or that contributions grow at a guaranteed rate for each year you work. They also take responsibility for the investment risk, which means you’ll know the value of your pension pot when you decide to access it. ';

    const pensionScheme = ['CB Recurring Scheme', 'CB Lump Sum Scheme'];

    for (const schemeName of pensionScheme) {
      const pension = cbPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );

      const pensionCard = pensionBreakdownPage.getPensionCard(schemeName);
      const expectedBarHeaderText = pension?.barChartHeaderText;
      const expectedDonutHeaderText = pension?.donutChartHeaderText;
      const accordionIds = pension?.accordionId ?? [];

      await pensionBreakdownPage.clickSeeDetailsButton(pensionCard);

      const cbLabelBox = pensionDetailsPage.pensionDetailType;
      await expect(cbLabelBox.getByTestId('CB-icon')).toBeVisible();
      await expect(cbLabelBox).toContainText('Cash balance');

      //CB tooltip
      await confirmedPensionsSummary.clickPensionTypeTooltip();
      await expect(confirmedPensionsSummary.tooltipIcon).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(
        await confirmedPensionsSummary.getPensionTypeTooltipText(),
      ).toContain(tooltipText);
      await confirmedPensionsSummary.clickPensionTypeTooltip();
      await expect(confirmedPensionsSummary.tooltipIcon).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      //tooltipLink opens new tab
      await confirmedPensionsSummary.clickPensionTypeTooltip();
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        confirmedPensionsSummary.clickPensionTypeTooltipLink(),
      ]);
      await newPage.waitForLoadState();
      expect(newPage.url()).toContain('/en/support/understand-your-pensions');
      const didYouUnderstand = new DidYouUnderstand(newPage);
      await expect(didYouUnderstand.pageHeading).toHaveText(
        'Understand your pensions',
      );
      await newPage.close();
      await expect(confirmedPensionsSummary.tooltipIcon).toBeVisible();

      //navigate to income and values tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        'tab-pension-income-and-values',
        'Income and values',
      );

      // Chart headings
      const barHeaderText = await barChart.getBarHeaderText();
      const donutHeaderText = await donutChart.donutHeaderText;

      expect(barHeaderText).toEqual(expectedBarHeaderText);
      expect(donutHeaderText).toContain(expectedDonutHeaderText);

      for (const accordionId of accordionIds) {
        //Assert accordion label text
        await expect(
          incomeAndValuesAccordions.getLabelLocator(accordionId),
        ).toContainText('How these values are calculated');

        //  accordion is closed by default
        await expect(
          incomeAndValuesAccordions.getAccordionLocator(accordionId),
        ).not.toHaveAttribute('open');

        //Click accordion to open & assert open
        await incomeAndValuesAccordions.toggle(accordionId);
        await expect(
          incomeAndValuesAccordions.getAccordionLocator(accordionId),
        ).toHaveAttribute('open');

        // Assert content text
        const calculationText =
          await incomeAndValuesAccordions.getCalculationText(accordionId);
        expect(calculationText).toContain(accordionText);
        // Click accordion and assert closed
        await incomeAndValuesAccordions.toggle(accordionId);
        await expect(
          incomeAndValuesAccordions.getAccordionLocator(accordionId),
        ).not.toHaveAttribute('open');
      }

      await page.locator('a[data-testid="back"]').click();
    }
  });
});
