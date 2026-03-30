import { expect, test } from '@maps/playwright';

import {
  allNewTestCases,
  pensionTimelineSentence4,
} from '../data/scenarioDetails';
import {
  expectedTimelineDataTS,
  retirementDateMapTS,
} from '../data/timelineScenarioDetails';
import ConfirmedPensionsSummary from '../pages/components/SummarySentence';
import Timeline from '../pages/components/Timeline';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import YourPensionsTimeline from '../pages/YourPensionsTimeline';
import commonHelpers from '../utils/commonHelpers';

/**
 * @tests User Story 38616 - Pension Summary Sentence
 *
 * @tests Test Case 39901 [AC1] - Verify the presence and title of the sub-header
 * @tests Test Case 39902 [AC2] - Verify the page uses a 12-column grid
 * @tests Test Case 39903 [AC3] - Verify the complete summary sentence with State Pension year available
 * @tests Test Case 39904 [AC4] - Summary Sentence Without State Pension Year
 * @tests Test Case 39905 [AC5] - Summary Sentence With State Pension Year and no SP benefitIllustrations
 * @tests Test Case 39906 [AC6] - Verify the summary sentence when the State Pension ERI is zero
 * @tests Test Case 39907 [AC7] - Verify the presence and content of the accordion (with state pension)
 * @tests Test Case 39908 [AC8] - Verify the absence of the accordion (without state pension)
 * @tests Test Case 39909 [AC9] -  View and Click Full Timeline Button
 * @tests Test Case 39910 [AC10] - Verify navigation to the error page on failure of clicking view timeline button.
 * @tests Test Case 39954 [AC11] - Summary Sentence With all pension ERI values available
 * @tests Test Case 39956 [AC12] - Summary Sentence with ERI data unavailable for all pensions and no state pension
 * @tests Test Case 39957 [AC13] - Summary Sentence works on mobile
 *
 */

/**
 * @tests User Story 38617 - Pension Timeline Page
 * @tests Test Case 39721 [AC1] - Timeline Year Rows
 * @tests Test Case 39723 [AC2] - View/hide Pension Toggle
 * @tests Test Case 39725 [AC3] - View Pensions (Expanded view)
 * @tests Test Case 39726 [AC4] - Cumulative Display of Pension Schemes by Year
 * @tests Test Case 39729 [AC5] - Applicable to Mobile and Desktop Versions
 */

const summaryText = {
  heading: 'Your estimated income',
  statePensionAge:
    "You'll reach State Pension age  in 2040. How much could you get from your pensions that year (before tax)?",
  tooltip:
    'The State Pension age is the earliest age you can claim State Pension. You don’t have to start taking your State Pension at this age - you can also defer it.\nClose',
  monthlyAmount: '£4,338 a month',
  yearlyAmount: 'This adds up to around £52,056 a year.',
  payableDate:
    "This is just a snapshot – it doesn't include pensions without an estimated income or that are due to start paying after 2040. As you start or stop taking your pensions, your income may go up or down.",
  timeline: 'View full timeline of your pensions',
  accordionTitle: 'About these values',
  accordionParagraph1:
    'This income is based on the pensions we have estimates for so far - it might not include all your pensions. Pension providers usually update these estimates at least once a year, and make calculations based on each pension’s contribution levels and expected retirement date. They’re not guaranteed, and may go down as well as up. See the pension details for more information.',
  accordionParagraph2:
    'Most estimated incomes show you how much your pension would be worth in today’s money. All values are shown before tax. Learn more about tax and pensions (opens in a new window) .',
};

const summaryTextZeroERINoBI = {
  monthlyAmount: '£3,434 a month',
  yearlyAmount: 'This adds up to around £41,208 a year.',
};

const summaryTextNoSP =
  "You might start taking each of your pensions at different times. As they start or stop, your income may go up or down.\n\nTo help you see how much money you could have when you retire, we've put the available estimated incomes into a timeline.";

const expectedTimelineText = {
  pageTitle: 'Your pensions',
  timelineHeading: 'Timeline',
  paragraphOne:
    'The timeline shows how your total estimated pension income could change over time based on each pension’s retirement date Show more information . These values are not guaranteed and may go down as well as up.',
  paragraphTwo:
    'Your actual income will depend on how and when you take your pensions.',
  tooltip:
    'The pension retirement date is the date your provider expects you to start taking money from this pension scheme. You don’t have to retire or take your pension on this date - you can usually change it by contacting them.',
  keyHeading: 'Key',
  keyItems: 'State Pension Defined benefit Defined contribution',
  aboutTheseValuesHeading: 'About these values',
  aboutTheseValuesParagraphOne:
    'These values are based on the pensions we have estimated incomes for so far - they might not include all your pensions. They’re not guaranteed, and may go down as well as up. The incomes and timeline are also based on expected retirement dates from your pension providers. See each pension’s details page for more information.',
  aboutTheseValuesParagraphTwo:
    'All values are shown before tax. Learn more about tax and pensions (opens in a new window) .',
};

test.describe('Confirmed Pensions Summary Section tests', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });

  test('Summary Sentence - State Pension Year and ERI available, and timeline page automation', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      pensionTimelineSentence4.option,
    );

    await pensionsFoundPage.clickSeeYourPensions(page);

    const confirmedPensionsSummary = new ConfirmedPensionsSummary(page);

    // Asserting that summary sentence text is as expected
    expect(await confirmedPensionsSummary.getHeading()).toBe(
      summaryText.heading,
    );
    expect(await confirmedPensionsSummary.getStatePensionAge()).toBe(
      summaryText.statePensionAge,
    );

    const tooltipInput = page.locator('[data-testid="tooltip-icon"]');

    await confirmedPensionsSummary.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'true');
    expect(await confirmedPensionsSummary.getTooltipText()).toBe(
      summaryText.tooltip,
    );

    await confirmedPensionsSummary.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'false');

    expect(await confirmedPensionsSummary.getMonthlyAmount()).toBe(
      summaryText.monthlyAmount,
    );
    expect(await confirmedPensionsSummary.getYearlyAmount()).toBe(
      summaryText.yearlyAmount,
    );
    expect(await confirmedPensionsSummary.getPayableDate()).toBe(
      summaryText.payableDate,
    );
    expect(await confirmedPensionsSummary.getTimelineLinkText()).toBe(
      summaryText.timeline,
    );
    expect(await confirmedPensionsSummary.getAccordionTitle()).toBe(
      summaryText.accordionTitle,
    );

    await confirmedPensionsSummary.clickAccordion();

    expect(await confirmedPensionsSummary.getAccordionFirstParagraph()).toBe(
      summaryText.accordionParagraph1,
    );
    expect(await confirmedPensionsSummary.getAccordionSecondParagraph()).toBe(
      summaryText.accordionParagraph2,
    );

    // Get the pension scheme names directly from the imported scenario data
    const pensionSchemes = pensionTimelineSentence4.pensions.map(
      (pension) => pension.schemeName,
    );

    // Calculate the totals
    const calculatedTotals =
      await confirmedPensionsSummary.calculateTotalsFromPensions(
        pensionSchemes,
      );

    // Assume you have methods to get the text from the page
    const monthlyAmountText = await confirmedPensionsSummary.getMonthlyAmount();
    const yearlyAmountText = await confirmedPensionsSummary.getYearlyAmount();

    // Extract and parse the values for assertion
    const monthlyAmount = Number.parseInt(
      monthlyAmountText
        .replace('£', '')
        .replace(' a month', '')
        .replace(',', ''),
      10,
    );
    const yearlyAmount = Number.parseInt(
      yearlyAmountText.replaceAll(/\D/g, ''),
      10,
    );

    // Assert that the calculated totals match the summary sentences
    expect(calculatedTotals.monthly).toEqual(monthlyAmount);
    expect(calculatedTotals.yearly).toEqual(yearlyAmount);

    // Click timeline link and assert timeline URL - BEGINNING OF 38617 AUTOMATION
    await page.getByTestId('timeline-link').click();
    await page.waitForURL('**/your-pensions-timeline');

    const expectedURL = 'your-pensions-timeline';
    expect(page.url()).toContain(expectedURL);

    // Assert timeline page text content
    const yourPensionsTimeline = new YourPensionsTimeline(page);
    expect(await yourPensionsTimeline.getPageTitle()).toBe(
      expectedTimelineText.pageTitle,
    );
    expect(await yourPensionsTimeline.getTimelineHeading()).toBe(
      expectedTimelineText.timelineHeading,
    );
    expect(await yourPensionsTimeline.getFirstParagraph()).toBe(
      expectedTimelineText.paragraphOne,
    );
    expect(await yourPensionsTimeline.getSecondParagraph()).toBe(
      expectedTimelineText.paragraphTwo,
    );
    expect(await yourPensionsTimeline.getKeyHeading()).toBe(
      expectedTimelineText.keyHeading,
    );
    expect(await yourPensionsTimeline.getKeyItems()).toBe(
      expectedTimelineText.keyItems,
    );
    expect(await yourPensionsTimeline.getAboutTheseValuesHeading()).toBe(
      expectedTimelineText.aboutTheseValuesHeading,
    );
    expect(await yourPensionsTimeline.getAboutTheseValuesParagraphOne()).toBe(
      expectedTimelineText.aboutTheseValuesParagraphOne,
    );
    expect(await yourPensionsTimeline.getAboutTheseValuesParagraphTwo()).toBe(
      expectedTimelineText.aboutTheseValuesParagraphTwo,
    );

    // Verify tooltip content
    await yourPensionsTimeline.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'true');
    expect(await yourPensionsTimeline.getTooltipText()).toBe(
      expectedTimelineText.tooltip,
    );

    await yourPensionsTimeline.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'false');

    // Assert timeline data
    const timeline = new Timeline(page);
    const actualTimelineData = await timeline.getTimelineData(
      page,
      expectedTimelineDataTS,
    );
    expect(actualTimelineData).toEqual(expectedTimelineDataTS);

    // Verify accordion pension count matches data length
    for (const expectedEntry of expectedTimelineDataTS) {
      const year = expectedEntry.year;
      const expectedCount = expectedEntry.schemes.length;
      const actualCountFromUI = await timeline.getAccordionCountByYear(year);
      expect(actualCountFromUI).toEqual(expectedCount);
    }

    // Validate that schemes within each year are sorted by retirement date
    for (const entry of actualTimelineData) {
      const year = entry.year;
      if (entry.schemes.length <= 1) continue;
      const isSorted = timeline.isSortedByDate(
        entry.schemes,
        retirementDateMapTS,
      );

      expect(
        isSorted,
        `Schemes for Year ${year} are not sorted by retirement date.`,
      ).toBe(true);

      if (!isSorted) {
        console.error(
          `Order for ${year}:`,
          entry.schemes.map((s) => s.name),
        );
      }
    }

    // Validate that monthly incomes for individual pensions add up to total Monthly and Annual Amounts
    for (const entry of actualTimelineData) {
      const schemesTotalMonthlyIncome = entry.schemes.reduce((sum, scheme) => {
        const monthlyIncome = commonHelpers.cleanCurrency(
          scheme.estimatedIncome,
        );
        return sum + monthlyIncome;
      }, 0);

      const totalMonthlyAmount = commonHelpers.cleanCurrency(
        entry.monthlyAmount,
      );
      const totalAnnualAmount = commonHelpers.cleanCurrency(entry.annualAmount);

      expect(schemesTotalMonthlyIncome).toBe(totalMonthlyAmount);

      const calculatedAnnualAmount = totalMonthlyAmount * 12;

      expect(calculatedAnnualAmount).toBe(totalAnnualAmount);
    }

    // Verify Accordion Toggle
    for (const expectedEntry of expectedTimelineDataTS) {
      const year = expectedEntry.year;

      // Verify initial state is closed
      const summaryText = await timeline.getAccordionSummaryText(year);
      expect(summaryText).toContain('View pensions');

      // Click to open the dropdown
      const openedText = await timeline.togglePensionDropdown(
        year,
        'Hide pensions',
      );
      expect(openedText).toContain('Hide pensions');

      // Click to close the dropdown
      const closedText = await timeline.togglePensionDropdown(
        year,
        'View pensions',
      );
      expect(closedText).toContain('View pensions');
    }
  });

  test('Summary Sentence - State Pension Year available but ERI is 0', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      'StatePensionSummaryZeroERIPC',
    );

    await pensionsFoundPage.clickSeeYourPensions(page);

    const confirmedPensionsSummary = new ConfirmedPensionsSummary(page);

    // Asserting that summary sentence text is as expected
    expect(await confirmedPensionsSummary.getHeading()).toBe(
      summaryText.heading,
    );
    expect(await confirmedPensionsSummary.getStatePensionAge()).toBe(
      summaryText.statePensionAge,
    );

    const tooltipInput = page.locator('[data-testid="tooltip-icon"]');

    await confirmedPensionsSummary.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'true');
    expect(await confirmedPensionsSummary.getTooltipText()).toBe(
      summaryText.tooltip,
    );

    await confirmedPensionsSummary.clickTooltip();
    await expect(tooltipInput).toHaveAttribute('aria-expanded', 'false');

    expect(await confirmedPensionsSummary.getMonthlyAmount()).toBe(
      summaryTextZeroERINoBI.monthlyAmount,
    );
    expect(await confirmedPensionsSummary.getYearlyAmount()).toBe(
      summaryTextZeroERINoBI.yearlyAmount,
    );
    expect(await confirmedPensionsSummary.getPayableDate()).toBe(
      summaryText.payableDate,
    );
    expect(await confirmedPensionsSummary.getTimelineLinkText()).toBe(
      summaryText.timeline,
    );
    expect(await confirmedPensionsSummary.getAccordionTitle()).toBe(
      summaryText.accordionTitle,
    );

    await confirmedPensionsSummary.clickAccordion();

    expect(await confirmedPensionsSummary.getAccordionFirstParagraph()).toBe(
      summaryText.accordionParagraph1,
    );
    expect(await confirmedPensionsSummary.getAccordionSecondParagraph()).toBe(
      summaryText.accordionParagraph2,
    );

    // Get the pension scheme names directly from the imported scenario data
    const pensionSchemes = pensionTimelineSentence4.pensions.map(
      (pension) => pension.schemeName,
    );

    // Calculate the totals
    const calculatedTotals =
      await confirmedPensionsSummary.calculateTotalsFromPensions(
        pensionSchemes,
      );

    // Assume you have methods to get the text from the page
    const monthlyAmountText = await confirmedPensionsSummary.getMonthlyAmount();
    const yearlyAmountText = await confirmedPensionsSummary.getYearlyAmount();

    // Extract and parse the values for assertion
    const monthlyAmount = Number.parseInt(
      monthlyAmountText
        .replace('£', '')
        .replace(' a month', '')
        .replace(',', ''),
      10,
    );
    const yearlyAmount = Number.parseInt(
      yearlyAmountText.replaceAll(/\D/g, ''),
      10,
    );

    // Assert that the calculated totals match the summary sentences
    expect(calculatedTotals.monthly).toEqual(monthlyAmount);
    expect(calculatedTotals.yearly).toEqual(yearlyAmount);
  });

  test('Fallback Summary Sentence - No State Pension available', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(
      page,
      allNewTestCases.option,
    );

    await pensionsFoundPage.clickSeeYourPensions(page);

    const confirmedPensionsSummary = new ConfirmedPensionsSummary(page);

    expect(await confirmedPensionsSummary.getSummaryTextNoSP()).toBe(
      summaryTextNoSP,
    );
  });

  test('Summary sentence not available when there is no State Pension and no pensions with an estimated income', async ({
    page,
  }) => {
    await commonHelpers.navigatetoPensionsFoundPage(page, 'greenNoIncomePC');

    await pensionsFoundPage.clickSeeYourPensions(page);

    const summarySentenceLocator = page.getByTestId('summary-sentence');

    // Assert that the locator is not visible
    await expect(summarySentenceLocator).toBeHidden();
  });
});
