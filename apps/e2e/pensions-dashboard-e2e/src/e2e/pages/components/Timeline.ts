import { expect, Page } from '@maps/playwright';

interface SchemeData {
  name: string;
  estimatedIncome: string;
}

interface TimelineData {
  year: string;
  monthlyAmount: string;
  annualAmount: string;
  schemes: SchemeData[];
}

interface TimelineYearEntry {
  year: string;
}

class Timeline {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

  isSortedByDate(schemesArray, dateMap) {
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
    scenarioData: TimelineYearEntry[], // <--- Reusable Parameter
  ): Promise<TimelineData[]> {
    const timelineData: TimelineData[] = [];
    const allEntryLocators = page.locator('ol > li');

    // Change the loop to use the passed-in scenarioData
    for (const yearEntry of scenarioData) {
      const { year } = yearEntry;

      const specificEntryContainer = allEntryLocators.filter({
        has: page.getByTestId(`timeline-year-${year}`),
      });

      // --- Extraction Logic Remains the Same ---

      // Extract monthly and yearly amounts
      const monthlyLocator = specificEntryContainer.getByTestId(
        'timeline-year-monthly',
      );
      // ... (rest of the locator definitions) ...
      const annualLocator = specificEntryContainer.getByTestId(
        'timeline-year-annual',
      );

      // ... (rest of the text extraction) ...
      const monthlyAmount = await monthlyLocator.textContent();
      const annualAmount = await annualLocator.textContent();

      // Extract scheme details from accordion
      const schemes: SchemeData[] = [];

      const accordionLocator = specificEntryContainer.getByTestId(
        `timeline-accordion-${year}`,
      );

      const incomeAmountLocators = accordionLocator.locator(
        'strong:not([data-testid])',
      );
      const schemeCount = await incomeAmountLocators.count();

      for (let i = 0; i < schemeCount; i++) {
        const incomeAmountElement = incomeAmountLocators.nth(i);

        const estimatedIncome = await incomeAmountElement.textContent();

        const schemeEntryContainer = incomeAmountElement
          .locator('..')
          .locator('..');

        const nameLocator = schemeEntryContainer.locator('p.font-bold').first();
        const name = await nameLocator.textContent();

        schemes.push({
          name: name ? name.trim() : 'Scheme Name Locator Failed',
          estimatedIncome: estimatedIncome ? estimatedIncome.trim() : '',
        });
      }

      // Add the collected data for this year to the results array
      timelineData.push({
        year: year,
        monthlyAmount: monthlyAmount
          ? monthlyAmount.trim().replaceAll(/\s+/g, ' ')
          : '',
        annualAmount: annualAmount
          ? annualAmount.trim().replaceAll(/\s+/g, ' ')
          : '',
        schemes,
      });
    }

    return timelineData;
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
}

export default Timeline;
