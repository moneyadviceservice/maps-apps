import { Page, expect } from '@playwright/test';

export const retirementDateMap = {
  'ASH Staff Pension Scheme': '1 January 2033',
  'Neighbourhood Watch Pension Scheme': '9 September 2033',
  'TNN Telecomms': '9 September 2038',
  'Kite Staff Pension Scheme': '9 September 2039',
  'State Pension': '9 September 2040',
};

export const expectedTimelineData = [
  {
    year: '2033',
    monthlyAmount: '£2,750',
    annualAmount: '£33,000',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
    ],
  },
  {
    year: '2038',
    monthlyAmount: '£3,250',
    annualAmount: '£39,000',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
    ],
  },
  {
    year: '2039',
    monthlyAmount: '£3,434',
    annualAmount: '£41,208',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
    ],
  },
  {
    year: '2040',
    monthlyAmount: '£4,338',
    annualAmount: '£52,056',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'TNN Telecomms',
        estimatedIncome: '£500 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2059',
    monthlyAmount: '£3,838',
    annualAmount: '£46,056',
    schemes: [
      {
        name: 'ASH Staff Pension Scheme',
        estimatedIncome: '£1,750 a month',
      },
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2060',
    monthlyAmount: '£2,088',
    annualAmount: '£25,056',
    schemes: [
      {
        name: 'Neighbourhood Watch Pension Scheme',
        estimatedIncome: '£1,000 a month',
      },
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
  {
    year: '2062',
    monthlyAmount: '£1,088',
    annualAmount: '£13,056',
    schemes: [
      {
        name: 'Kite Staff Pension Scheme',
        estimatedIncome: '£184 a month',
      },
      {
        name: 'State Pension',
        estimatedIncome: '£904 a month',
      },
    ],
  },
];

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

  async getTimelineData(page: Page) {
    const timelineData = [];
    const allEntryLocators = page.locator('ol > li');

    for (const yearEntry of expectedTimelineData) {
      const { year } = yearEntry;

      const specificEntryContainer = allEntryLocators.filter({
        has: page.getByTestId(`timeline-year-${year}`),
      });

      // Extract monthly and yearly amounts
      const monthlyLocator = specificEntryContainer.getByTestId(
        'timeline-year-monthly',
      );
      const annualLocator = specificEntryContainer.getByTestId(
        'timeline-year-annual',
      );

      const monthlyAmount = await monthlyLocator.textContent();
      const annualAmount = await annualLocator.textContent();

      // Extract scheme details from accordion
      const schemes: { name: string; estimatedIncome: string }[] = [];

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
