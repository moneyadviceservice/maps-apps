import { expect, test } from '@maps/playwright';

import { cdcPensions } from '../data/scenarioDetails';
import { expectedTimelineDataCDC } from '../data/timelineScenarioDetails';
import DidYouUnderstand from '../pages/components/DidYouUnderstandThisPage';
import IncomeAndValuesAccordions from '../pages/components/IncomeAndValuesAccordions';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import Timeline from '../pages/components/Timeline';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { commonSessions } from '../utils/testSessionStorage';

/**
 * @tests User Story 49014 FE - CDC- Pension Card
 * @tests Test Case 50604 49014 AC1 TestCase1 : CDC Pension Card - Desktop
 * @tests Test Case 50605 49014 AC2 TestCase2 : CDC Pension Card - Mobile View
 *
 * @tests User Story 49025: FE - CDC - Timeline Page
 * @tests Test Case 50606: 49025 AC1 TestCase1 : CDC Timeline Page - Desktop
 * @tests Test Case 50607: 49025 AC2 TestCase2 : CDC Timeline Page - Mobile View
 *
 * @tests User Story 49020 FE - CDC - Pension -Details- summary tab
 * @tests Test Case 50610: 49020 AC1 TestCase1 : Verify Colour, illustration and Icon for CDC summary tab
 * @tests Test Case 50611: 49020 AC2 TestCase2 : CDC summary tab - verify label box
 * @tests Test Case 50612: 49020 AC2 TestCase3 : CDC summary tab - verify tooltip text
 * @tests Test Case 50614: 49020 AC3 TestCase4 : CDC summary tab - verify tooltip link
 * @tests Test Case 50615: 49020 AC4 TestCase5 : CDC summary tab - verify explainer box
 *
 * @tests User Story 49144: FE - CDC - Pension -Details- Income and Values tab
 * @tests Test Case 50626: 49144 AC2 & 3 TestCase2 : Verify CDC Income and Values tab Accordion Content
 *
 * @tests User Story 55022: Remove H&S banner from /pension-details
 * @tests Test Case 55193 [AC1, AC2]: Help and Support Banner and Anchor removed from Pension Details page
 */

test.describe('CDC Pension Types', () => {
  test.beforeEach(async ({ page }) => {
    await commonSessions.navigateToPensionBreakdown(page, cdcPensions.option);
  });

  test('Pension Breakdown page - Pension card & Timeline', async ({
    page,
    isMobile,
  }) => {
    const timeline = new Timeline(page);
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const detailsButtonText = 'See details';

    // Pension Card
    const schemeNames = [
      'Royal Mail Collective Defined Contribution',
      'Royal Mail CDC AVC',
    ];
    for (const schemeName of schemeNames) {
      const pension = cdcPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      if (!pension) {
        throw new Error(`No pension found for schemeName: ${schemeName}`);
      }

      await expect(
        pensionBreakdownPage.getPensionCard(page, schemeName),
      ).toBeVisible();
      await expect(
        pensionBreakdownPage.getActiveStatus(page, schemeName),
      ).toContainText(pension.activeStatus);
      await expect(
        pensionBreakdownPage.getPensionCardType(page, schemeName),
      ).toContainText(pension.pensionCardType);
      await expect(
        pensionBreakdownPage.getEmployerName(page, schemeName),
      ).toContainText(pension.employer);
      await expect(
        pensionBreakdownPage.getAdministratorName(page, schemeName),
      ).toContainText(pension.pensionProvider);
      await expect(
        pensionBreakdownPage.getRetirementDate(page, schemeName),
      ).toContainText(pension.expectedRetirementDate);
      await expect(
        pensionBreakdownPage.getEstimatedIncome(page, schemeName),
      ).toContainText(pension.estimatedIncome);
      await expect(
        pensionBreakdownPage.getSeeDetailsButton(page, schemeName),
      ).toContainText(detailsButtonText);
    }

    //timeline explainer
    await confirmedPensionsSummary.clickTimelineLinkNonMcCloud(page);
    expect(await timeline.getTimelineKeyText()).toContain('CDC');
    await timeline.togglePensionDropdown('2053', 'View pensions');
    const actualTimelineData = await timeline.getTimelineData(
      page,
      expectedTimelineDataCDC,
    );
    expect(actualTimelineData).toEqual(expectedTimelineDataCDC);
  });

  test('Pension Details Page Summary Tab & income and values tab', async ({
    page,
    isMobile,
  }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const accordions = new IncomeAndValuesAccordions(page);
    const cdcAccordionTestID = 'cdc-calculation-accordion';
    const accordionText = `Estimates for this pension are based on you getting a one-time lump sum and an income for life that starts paying from the expected retirement date. Your income for life is reviewed and adjusted each year, which means it could go down, as well as up, both before and after you start receiving it. They’re also based on your salary and years you’ve been a scheme member, as well the provider’s assumptions about inflation, investment performance, and future contribution levels. To help you understand the impact of inflation, the estimated income is shown in today's money, so you can see what that amount would be worth right now.`;
    const tooltipText =
      ' scheme pays you a regular income for life when you retire. The income can rise or fall before and after you start taking it. This depends on many factors, like how well the scheme’s investments have performed. Your money is invested together with the contributions from your employer and other scheme members, so the risk is shared and the pension might grow at a higher rate. ';
    const pensionScheme = ['Royal Mail Collective Defined Contribution'];

    for (const schemeName of pensionScheme) {
      const pension = cdcPensions.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      const summaryCardText = `You could receive ${pension?.estimatedIncome} a month from the first payable date of ${pension?.expectedRetirementDate}.Plus an estimated lump sum payment of ${pension?.lumpSum}`;
      const explainerHeading =
        'This is a collective defined contribution (CDC) pension';
      const explainerText =
        'The income you could receive is not guaranteed. Your income could go up or down both before and after you start receiving it.';
      const { container, heading, description } =
        await confirmedPensionsSummary.getExplainer('CDC');
      const firstPensionCard = page.getByTestId('information-callout').first();

      await pensionBreakdownPage.clickSeeDetailsButton(page, firstPensionCard);

      // summary sentence
      await expect(pensionDetailsPage.getSummaryCard(page)).toContainText(
        summaryCardText,
      );
      const cdcLabelBox = pensionDetailsPage.getPensionDetailType(page);
      await expect(cdcLabelBox.getByTestId('CDC-icon')).toBeVisible();
      await expect(cdcLabelBox).toContainText('CDC');

      //CDC tooltip
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
      await expect(didYouUnderstand.getPageHeading()).toHaveText(
        'Understand your pensions',
      );
      await newPage.close();
      await expect(confirmedPensionsSummary.tooltipIcon).toBeVisible();

      //explainer
      await expect(container).toBeVisible();
      await expect(heading).toHaveText(explainerHeading);
      await expect(description).toContainText(explainerText);

      //navigate to income and values tab
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );
      //Assert accordion label text
      await expect(
        accordions.getLabelLocator(cdcAccordionTestID),
      ).toContainText('How these values are calculated');
      //  accordion is closed by default
      await expect(
        accordions.getAccordionLocator(cdcAccordionTestID),
      ).not.toHaveAttribute('open');
      //Click accordion to open & assert open
      await accordions.toggle(cdcAccordionTestID);
      await expect(
        accordions.getAccordionLocator(cdcAccordionTestID),
      ).toHaveAttribute('open');
      // Assert content text
      const calculationText = await accordions.getCalculationText(
        cdcAccordionTestID,
      );
      expect(calculationText).toContain(accordionText);
      // Click accordion and assert closed
      await accordions.toggle(cdcAccordionTestID);
      await expect(
        accordions.getAccordionLocator(cdcAccordionTestID),
      ).not.toHaveAttribute('open');
    }
  });
});
