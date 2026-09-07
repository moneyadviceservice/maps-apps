import { expect, Locator, Page } from '@maps/playwright';

interface SchemeData {
  name: string;
  estimatedIncome: string;
  lumpSum?: string | null;
}

interface TimelineData {
  year: string;
  monthlyAmount: string;
  annualAmount: string;
  lumpSumAmount?: string;
  cashBalanceAmount?: string;
  schemes: SchemeData[];
}

interface TimelineYearEntry {
  year: string;
}

class Timeline {
  private readonly page: Page;
  readonly tooltipIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tooltipIcon = page
      .getByTestId('cash-balance-total')
      .getByTestId('tooltip-icon');
  }

  async getAccordionCountByYear(year: string): Promise<number> {
    const allEntryLocators = this.page.locator('ol > li');
    const specificEntryContainer = allEntryLocators.filter({
      has: this.page.getByTestId(`timeline-year-${year}`),
    });

    const accordionLocator = specificEntryContainer.getByTestId(
      `timeline-accordion-${year}`,
    );
    const summaryLocator = accordionLocator.locator('summary');

    await summaryLocator.waitFor({ state: 'visible' });

    const summaryText = await summaryLocator.textContent();

    const countRegex = /\((\d+)\)/;

    const countMatch = summaryText ? countRegex.exec(summaryText) : null;

    const schemeCount = Number.parseInt(countMatch?.[1] ?? '0', 10);
    return schemeCount;
  }

  isSortedByDate(
    schemesArray: SchemeData[],
    dateMap: Record<string, string>,
  ): boolean {
    const schemeDates = schemesArray.map((scheme) => {
      const dateString = dateMap[scheme.name];
      if (!dateString) {
        throw new Error(`Scheme date not found for: ${scheme.name}`);
      }
      return new Date(dateString);
    });

    for (let i = 0; i < schemeDates.length - 1; i++) {
      if (schemeDates[i] > schemeDates[i + 1]) {
        return false;
      }
    }
    return true;
  }

  async getTimelineData(
    page: Page,
    scenarioData: TimelineYearEntry[],
  ): Promise<TimelineData[]> {
    const timelineData: TimelineData[] = [];
    const allEntryLocators = page.locator('ol > li').filter({ visible: true });

    // Change the loop to use the passed-in scenarioData
    for (const yearEntry of scenarioData) {
      const { year } = yearEntry;

      const specificEntryContainer = allEntryLocators.filter({
        has: page.getByTestId(`timeline-year-${year}`),
      });

      // Extract monthly, yearly, lump sum, and cash balance totals for this yearPcb
      const monthlyAmount = await specificEntryContainer
        .getByTestId('timeline-year-monthly')
        .textContent();
      const annualAmount = await specificEntryContainer
        .getByTestId('timeline-year-annual')
        .textContent();

      const cashBalanceLocator = specificEntryContainer.getByTestId(
        'timeline-year-cash-balance',
      );

      const lumpSumLocator = specificEntryContainer.getByTestId(
        'timeline-year-lump-sum',
      );

      let cashBalanceAmount: string | null = null;
      if (await cashBalanceLocator.isVisible()) {
        cashBalanceAmount = await cashBalanceLocator.textContent();
      }

      let lumpSumAmount: string | null = null;
      if (await lumpSumLocator.isVisible()) {
        lumpSumAmount = await lumpSumLocator.textContent();
      }

      // Extract scheme details via helper function
      const accordionLocator = specificEntryContainer.getByTestId(
        `timeline-accordion-${year}`,
      );
      const schemes = await this.extractSchemesData(accordionLocator);

      // Add the collected data for this year to the results array
      timelineData.push({
        year: year,
        monthlyAmount: monthlyAmount
          ? monthlyAmount.trim().replaceAll(/\s+/g, ' ')
          : '',
        annualAmount: annualAmount
          ? annualAmount.trim().replaceAll(/\s+/g, ' ')
          : '',
        ...(lumpSumAmount !== null && {
          lumpSumAmount: lumpSumAmount.trim().replaceAll(/\s+/g, ' '),
        }),
        ...(cashBalanceAmount !== null && {
          cashBalanceAmount: cashBalanceAmount.trim().replaceAll(/\s+/g, ' '),
        }),
        schemes,
      });
    }

    return timelineData;
  }

  /**
   * Helper function to extract scheme arrays from a specific year's accordion locator.
   * This isolates the nested loop, dramatically lowering cognitive complexity.
   */
  private async extractSchemesData(
    accordionLocator: Locator,
  ): Promise<SchemeData[]> {
    const schemes: SchemeData[] = [];
    const incomeAmountLocators = accordionLocator.getByTestId('timeline-entry');
    const schemeCount = await incomeAmountLocators.count();

    for (let i = 0; i < schemeCount; i++) {
      const incomeAmountElement = incomeAmountLocators.nth(i);

      const estimatedIncomeLocator = incomeAmountElement
        .getByTestId('timeline-estimated-income')
        .locator('strong');

      const estimatedIncome =
        (await estimatedIncomeLocator.count()) > 0
          ? await estimatedIncomeLocator.textContent()
          : null;

      const name = await incomeAmountElement
        .getByTestId('timeline-entry-scheme-name')
        .textContent();

      const lumpSumLocator = incomeAmountElement
        .getByTestId('timeline-lump-sum')
        .locator('strong');

      let lumpSumValue: string | null = null;
      if ((await lumpSumLocator.count()) > 0) {
        const text = await lumpSumLocator.textContent();
        lumpSumValue = text ? text.trim() : null;
      }

      schemes.push({
        name: name ? name.trim() : 'Scheme Name Locator Failed',
        estimatedIncome: estimatedIncome ? estimatedIncome.trim() : '',
        ...(lumpSumValue !== null && { lumpSum: lumpSumValue }),
      });
    }

    return schemes;
  }

  async getAccordionSummaryText(year: string): Promise<string> {
    const allEntryLocators = this.page.locator('ol > li');
    const specificEntryContainer = allEntryLocators.filter({
      has: this.page.getByTestId(`timeline-year-${year}`),
    });
    const summaryLocator = specificEntryContainer.locator('summary');

    const text = await summaryLocator.textContent();
    return text ? text.trim() : '';
  }

  async togglePensionDropdown(
    year: string,
    expectedState: 'Hide pensions' | 'View pensions',
  ): Promise<string> {
    const allEntryLocators = this.page.locator('ol > li');
    const specificEntryContainer = allEntryLocators.filter({
      has: this.page.getByTestId(`timeline-year-${year}`),
    });

    const summaryLocator = specificEntryContainer.locator('summary');
    const detailsLocator = specificEntryContainer.locator('details').first();

    await expect(summaryLocator).toBeVisible({ timeout: 5000 });
    await summaryLocator.click();

    // Assert the state change based on the attribute
    if (expectedState === 'Hide pensions') {
      await expect(detailsLocator).toHaveAttribute('open', '', {
        timeout: 3000,
      });
    } else {
      await expect(detailsLocator).not.toHaveAttribute('open', 'open', {
        timeout: 3000,
      });
    }

    // Return the new text content for final assertion in the main test
    const newText = await summaryLocator.textContent();
    return newText ? newText.trim() : '';
  }

  async getTimelineKeyText() {
    return await this.page.getByTestId('timeline-key').innerText();
  }

  async clickTimelineTooltip() {
    await this.page
      .getByTestId('cash-balance-total')
      .getByTestId('tooltip-icon')
      .click();
  }

  async getTimelineTooltipText() {
    return (
      await this.page
        .getByTestId('cash-balance-total')
        .getByTestId('tooltip-content')
        .innerText()
    )
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  get McCloudLegacyOption(): Locator {
    return this.page.getByTestId('timeline-toggle-option-legacy-label');
  }

  get McCloudAlternativeOption(): Locator {
    return this.page.getByTestId('timeline-toggle-option-alternative-label');
  }
}

export default Timeline;
