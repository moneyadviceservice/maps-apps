import { expect, test } from '@maps/playwright';

import { mcCloudAllAndSP } from '../data/scenarioDetails';
import IncomeAndValuesTab from '../pages/components/MccloudIncomeAndValuesTab';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import Timeline from '../pages/components/Timeline';
import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import YourPensionsTimeline from '../pages/YourPensionsTimeline';
import commonHelpers from '../utils/commonHelpers';
import { commonSessions } from '../utils/testSessionStorage';

/**
 * @tests User Story 47416 - FE - McCloud - your-pensions-timeline page
 * @tests Test Case 49585 AC1 TestCase1 : Verify McCloud Timeline explainer
 * @tests Test Case 49586 AC2 TestCase2 : Verify Toggle beneath Explainer
 * @tests Test Case 47416 AC3 TestCase3 Verify 'Alternative' Toggle selection
 * @tests Test Case 49596 AC4 TestCase4 Verify 'Legacy' Toggle selection
 * @tests Test Case 49591 AC5 TestCase5 : Verify See Details and Back Link navigation From Legacy option
 * @tests Test Case 49594 AC5 TestCase6 : Verify See Details and Back Link navigation From Alternative option
 */
/**
 * @tests User Story 47367 - FE - McCloud - your-pensions-breakdown/Summary Sentence
 * @tests Test Case 49620 AC2 TestCase2 Verify New header on pensions breakdown page (McCloud))
 * @tests Test Case 49622 AC3 TestCase3 : Verify Accordion on Pensions Breakdown page (McCloud))
 * @tests Test Case 49623 AC4 TestCase4 : Verify Accordion expanded & text (McCloud)
 * @tests Test Case 49624 AC5 TestCase5 : Verify mobile functionality pension breakdown page (McCloud)
 *
 * @tests User Story 47418: FE - McCloud - pension-details page - Graphs
 * @tests Test Case 49731 AC1 TestCase1 : Verify label and colour for Legacy option bar on graph box
 * @tests Test Case 49732 AC2 TestCase2 : Verify label and colour for Alternative option bar on graph box
 * @tests Test Case 49736 AC5 TestCase6 : Verify colours, content, and sizing of pension details page
 * @tests Test Case 49737 AC6 TestCase7 : Verify Mobile functionality for pension details page - Graphs (McCloud))
 *
 * @tests User Story 48328: FE - McCloud - pension-details page - Income & Values Timeline
 * @tests Test Case 50357 AC1 TestCase1 : McCloud explainer paragraph is displayed - Income and Values Tab
 * @tests Test Case 50360 AC2 TestCase2 : Verify McCloud Income and Values timeline split into legacy and Alternative
 * @tests Test Case 50406 AC5 TestCase7 : Verify Content and Layout matches figma - Desktop
 * @tests Test Case 50407 AC6 TestCase8 : Verify Content and Layout Mobile for McCloud income and values timeline
 *
 * @tests User Story 48327 FE - McCloud - pension-details page - Summary tab
 *
 * @tests User Story 53036: FE - McCloud Timeline Amendment
 * @tests Test Case 53290 [AC1]: Legacy and Alternative options visible if McCloud pension starts paying out in a year following State Pension becoming active
 *
 * @tests User Story 52967 - CI - Dev - Summary Sentence - Year and Context
 * @tests Test Case 53430 - 52967 - AC4 - AC6 - Test Case 8 -  Mobile - With McCloud
 * @tests 52967 - AC3 - Test Case 7 - McCloud - Dropdown content
 */

const summaryText = {
  heading: 'Your estimated income',
  statePensionAge:
    'In 2038, how much could you get from your pensions that year (before tax)?',
  optionsHeader: 'You have two options',
  legacyText: 'Legacy option',
  legacyMonthlyAmount: '£7,791.50 a month',
  legacyYearlyAmount: 'This adds up to around £93,497.78 a year.',
  alternativeText: 'Alternative option',
  alternativeMonthlyAmount: '£8,555.91 a month',
  alternativeYearlyAmount: 'This adds up to around £102,670.81 a year.',
  payableDate:
    "This is just a snapshot – it doesn't include pensions without an estimated income or that are due to start paying after 2038. As you start or stop taking your pensions, your income may go up or down.",
  timeline: 'View full pensions timeline',
  accordionTitle: 'Why do I have two options?',
  specificYearAccordionTitle: 'Why have we used a specific year?',
  accordionParagraph1:
    'You have a choice between legacy (final salary) and alternative (career average) pension benefits, which are calculated in different ways. The income and lump sums will be different for each option.',
  accordionParagraph2:
    'You do not have to choose until you start taking your pension.',
  specificYearAccordianParagraph:
    'This is the year you will reach State Pension age - the age you can claim your State Pension. You might start taking other pensions before or after this.',
};

const expectedTimelineText = {
  pageTitle: 'Your pensions',
  timelineHeading: 'Timeline',
  timelineExplainerText:
    'For one or more of your pensions, you have a choice between legacy (final salary) and alternative (career average) pension benefits. Toggle between the options to see the different values in your timeline.',
  legacyOptionLabel: 'Legacy option',
  alternativeOptionLabel: 'Alternative option',
};
const legacyUrl = 'en/your-pensions-timeline?income=legacy';
const alternativeUrl = 'en/your-pensions-timeline?income=alternative';

test.describe('McCloud Pension Types', () => {
  test.beforeEach(async ({ page }) => {
    await commonSessions.navigateToPensionBreakdown(
      page,
      mcCloudAllAndSP.option,
    );
  });

  test('Pension breakdown page - Summary Sentence & Timeline', async ({
    page,
    isMobile,
  }) => {
    const confirmedPensionsSummary = new ConfirmedPensionsSummary(
      page,
      isMobile,
    );
    const yourPensionsTimeline = new YourPensionsTimeline(page);
    // Summary Sentence
    expect(await confirmedPensionsSummary.getHeading()).toBe(
      summaryText.heading,
    );
    expect(await confirmedPensionsSummary.getStatePensionAge()).toBe(
      summaryText.statePensionAge,
    );

    // options header
    expect(await confirmedPensionsSummary.getSummarySentenceTitle()).toBe(
      summaryText.optionsHeader,
    );

    // Legacy Option section
    expect(await confirmedPensionsSummary.getLegacyLabel()).toBe(
      summaryText.legacyText,
    );
    expect(await confirmedPensionsSummary.getLegacyMonthlyAmount()).toBe(
      summaryText.legacyMonthlyAmount,
    );
    expect(await confirmedPensionsSummary.getLegacyYearlyAmount()).toBe(
      summaryText.legacyYearlyAmount,
    );

    // Alternative option section
    expect(await confirmedPensionsSummary.getAlternativeLabel()).toBe(
      summaryText.alternativeText,
    );
    expect(await confirmedPensionsSummary.getAlternativeMonthlyAmount()).toBe(
      summaryText.alternativeMonthlyAmount,
    );
    expect(await confirmedPensionsSummary.getAlternativeYearlyAmount()).toBe(
      summaryText.alternativeYearlyAmount,
    );

    // Specific year accordion
    await expect(
      confirmedPensionsSummary.specificYearAccordion,
    ).not.toHaveAttribute('open');
    expect(await confirmedPensionsSummary.getSpecificYearAccordionTitle()).toBe(
      summaryText.specificYearAccordionTitle,
    );
    await confirmedPensionsSummary.clickSpecificYearAccordion();
    expect(await confirmedPensionsSummary.getSpecificYearAccordionText()).toBe(
      summaryText.specificYearAccordianParagraph,
    );
    await expect(
      confirmedPensionsSummary.specificYearAccordion,
    ).toHaveAttribute('open');
    await confirmedPensionsSummary.clickSpecificYearAccordion();
    await expect(
      confirmedPensionsSummary.specificYearAccordion,
    ).not.toHaveAttribute('open');

    //Summary Accordion
    expect(await confirmedPensionsSummary.getOptionsAccordionTitle()).toBe(
      summaryText.accordionTitle,
    );
    await expect(confirmedPensionsSummary.mcCloudAccordion).not.toHaveAttribute(
      'open',
      '',
    );
    await confirmedPensionsSummary.clickMcCloudAccordion();
    await expect(confirmedPensionsSummary.mcCloudAccordion).toHaveAttribute(
      'open',
      '',
    );

    expect(
      await confirmedPensionsSummary.getMcCloudAccordionFirstParagraph(),
    ).toBe(summaryText.accordionParagraph1);
    expect(
      await confirmedPensionsSummary.getMcCloudAccordionSecondParagraph(),
    ).toBe(summaryText.accordionParagraph2);

    //timeline explainer
    await confirmedPensionsSummary.clickTimelineLink(page);
    expect(await yourPensionsTimeline.getTimelineExplainer()).toBe(
      expectedTimelineText.timelineExplainerText,
    );

    //Legacy selected by default
    expect(await yourPensionsTimeline.getLegacyOptionText()).toBe(
      expectedTimelineText.legacyOptionLabel,
    );
    expect(page.url()).toContain(legacyUrl);

    //Click Alternative, assert URL
    await yourPensionsTimeline.clickAlternativeOption(page);
    expect(page.url()).toContain(alternativeUrl);

    //Verify back link - Alternative
    await yourPensionsTimeline.verifyBackLinkAlternativeOption(page);
    expect(page.url()).toContain(alternativeUrl);

    //Verify back link - Legacy
    await yourPensionsTimeline.clickLegacyOption(page);
    expect(page.url()).toContain(legacyUrl);
    await yourPensionsTimeline.verifyBackLinkLegacyOption(page);
    expect(page.url()).toContain(legacyUrl);
  });

  test('Income and Values tab - Graphs & Timeline', async ({ page }) => {
    const incomeAndValuesTab = new IncomeAndValuesTab(page);
    const heading = 'Income and values';
    const subtext =
      'This pension has multiple incomes that could pay out at different times. Some may only be paid for a limited time.';
    const explainerText =
      'You have a choice between legacy (final salary) and alternative (career average) pension benefits, which are calculated in different ways.';
    const legacyLabel = 'Legacy option';
    const legacyMonthly2031 = 'From 2031, you could get £1,783.64 a month';
    const legacyLumpSum2031 = 'plus a one-time lump sum of £64,210';
    const legacyMonthly2038 = 'From 2038, you could get £1,984.68 a month';
    const legacyIncrease2038 = '(increase of £201.04)';
    const altLabel = 'Alternative option';
    const altMonthly2031 = 'From 2031, you could get £1,281.63 a month';
    const altLumpSum2031 = 'plus a one-time lump sum of £46,138.75';
    const altMonthly2038 = 'From 2038, you could get £2,192.67 a month';
    const altIncrease2038 = '(increase of £911.04)';
    //navigate to income and values tab
    await pensionBreakdownPage.navigateToSchemeIncomeAndValuesTab(
      page,
      'Scottish Runners Pension Scheme - Active',
    );
    //assert explainer text
    await expect(incomeAndValuesTab.heading).toContainText(heading);
    await expect(incomeAndValuesTab.subText).toContainText(subtext);
    await expect(incomeAndValuesTab.mccloudSection).toContainText(
      explainerText,
    );

    // Assert Legacy Option Section
    await expect(incomeAndValuesTab.legacyLabel).toContainText(legacyLabel);
    // Assert 2031 bullet points - Legacy
    await expect(
      incomeAndValuesTab.getIncomeMonthly('2031', 'legacy'),
    ).toContainText(legacyMonthly2031);
    await expect(
      incomeAndValuesTab.getIncomeLumpSum('2031', 'legacy'),
    ).toContainText(legacyLumpSum2031);

    // Assert 2038 bullet points and Difference - Legacy
    await expect(
      incomeAndValuesTab.getIncomeMonthly('2038', 'legacy'),
    ).toContainText(legacyMonthly2038);
    await expect(
      incomeAndValuesTab.getIncomeDifference('2038', 'legacy'),
    ).toContainText(legacyIncrease2038);

    // Assert Alternative Option Header
    await expect(incomeAndValuesTab.alternativeLabel).toContainText(altLabel);

    // Assert 2031 bullet points -Alternative
    await expect(
      incomeAndValuesTab.getIncomeMonthly('2031', 'alternative'),
    ).toContainText(altMonthly2031);

    await expect(
      incomeAndValuesTab.getIncomeLumpSum('2031', 'alternative'),
    ).toContainText(altLumpSum2031);

    // Assert 2038 bullet points and increase text - Alternative
    await expect(
      incomeAndValuesTab.getIncomeMonthly('2038', 'alternative'),
    ).toContainText(altMonthly2038);

    await expect(
      incomeAndValuesTab.getIncomeDifference('2038', 'alternative'),
    ).toContainText(altIncrease2038);

    //assert graph headings for legacy and alternative
    const graphBoxes = [
      { year: '2031', label: legacyLabel, barHeading: 'Estimated income' },
      { year: '2031', label: legacyLabel, barHeading: 'Lump sum' },
      { year: '2031', label: altLabel, barHeading: 'Estimated income' },
      { year: '2031', label: altLabel, barHeading: 'Lump sum' },
      { year: '2038', label: legacyLabel, barHeading: 'Estimated income' },
      { year: '2038', label: altLabel, barHeading: 'Estimated income' },
    ];

    for (const box of graphBoxes) {
      const graphBoxHeading = incomeAndValuesTab.getBarLabel(
        box.year,
        box.label,
        box.barHeading,
      );

      await expect(graphBoxHeading).toContainText(box.label);
    }
  });

  test('Verify expected McCloud pension arrangement for Summary Text box on Summary tab', async ({
    page,
  }) => {
    const schemeNames = [
      'Enforcement Pension Scheme',
      'Scottish Runners Pension Scheme - Active',
      'Scottish Runners Pension Scheme - Deferred',
      'Pyro Pension Scheme',
      'NHS Pension Scheme',
    ];
    for (const schemeName of schemeNames) {
      const pension = mcCloudAllAndSP.pensions.find(
        (p) => p.schemeName === schemeName,
      );
      expect(pension).toBeDefined();
      if (!pension) {
        throw new Error(
          `Pension with schemeName "${schemeName}" not found in pensionPotCallout.pensions`,
        );
      }
      await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
      await pensionDetailsPage.assertHeading(page, schemeName);
      expect(page.url()).toContain('/pension-details/your-pension-summary');
      expect(pensionDetailsPage.getSummaryCard(page)).toBeDefined();
      const summaryBoxText = await pensionDetailsPage.getSummaryBoxText(page);
      const mcCloudWarningFlagText =
        await pensionDetailsPage.getMcCloudWarningFlagText(page);
      expect(summaryBoxText).toContain('Legacy option');
      expect(summaryBoxText).toContain('Alternative option');

      const expectedPayableDate = pension.payableDateERI;
      expect(expectedPayableDate).toBeDefined();
      if (expectedPayableDate) {
        const escapedPayableDate = expectedPayableDate.replaceAll(
          /[.*+?^${}()|[\]\\]/g,
          String.raw`\$&`,
        );
        const payableDatePattern = new RegExp(escapedPayableDate, 'g');
        let payableDateMatchCount = 0;
        while (payableDatePattern.exec(summaryBoxText) !== null) {
          payableDateMatchCount += 1;
        }
        expect(payableDateMatchCount).toBe(1);
      }

      const legacySectionPattern = /Legacy option([\s\S]*?)Alternative option/;
      const alternativeSectionPattern =
        /Alternative option([\s\S]*?)from the first payable date of/i;
      const legacySectionMatch = legacySectionPattern.exec(summaryBoxText);
      const alternativeSectionMatch =
        alternativeSectionPattern.exec(summaryBoxText);
      const legacySectionText = legacySectionMatch?.[1] ?? '';
      const alternativeSectionText = alternativeSectionMatch?.[1] ?? '';

      if (
        legacySectionText.toLowerCase().includes('lump sum') &&
        alternativeSectionText.toLowerCase().includes('lump sum')
      ) {
        const datePattern = /\b\d{1,2}\s+[A-Za-z]+\s+\d{4}\b/;
        expect(legacySectionText).not.toMatch(datePattern);
        expect(alternativeSectionText).not.toMatch(datePattern);
      }

      expect(mcCloudWarningFlagText).toBeDefined();
      expect(mcCloudWarningFlagText).toContain(
        pensionDetailsPage.mcCloudWarningFlagText,
      );
      await commonHelpers.clickLink(page, 'Back');
      await pensionBreakdownPage.pageLoads(page);
    }
  });
});

test.describe('McCloud pension occurs after state pension', () => {
  test('Timeline page should have legacy and alternative options if McCloud pension occurs after state pension', async ({
    page,
  }) => {
    await commonSessions.navigateToPensionBreakdown(
      page,
      'McCloud_Year_After_StatePension',
    );
    await pensionBreakdownPage.clickPensionsTimelineButton(page);
    await expect(page).toHaveURL(/\?income=legacy/);
    const timeline = new Timeline(page);
    await expect(timeline.McCloudLegacyOption).toBeVisible();
    await expect(timeline.McCloudAlternativeOption).toBeVisible();
  });
});
