import { Page } from '@maps/playwright';

type StatePensionsDetailsPage = {
  accordionTextAbout: string;
  estimatedIncomeSubheading: string;
  toolTip1Text: string;
  toolTip2Text: string;
  toolTipLocator: string;
  forecastStatementTitle: string;
  waitForPageTitle: (page: Page) => Promise<void>;
  getForecastStatement: (page: Page) => Promise<string | null>;
  getForecastStatementTitle: (page: Page) => Promise<string | null>;
  getCurrentMonthlyAmount: (page: Page) => Promise<string | null>;
  getCurrentAnnualAmount: (page: Page) => Promise<string | null>;
  getRetirementAnnualAmount: (page: Page) => Promise<string | null>;
  getRetirementMonthlyAmount: (page: Page) => Promise<string | null>;
  getCurrentPayableDate: (page: Page) => Promise<string | null>;
  getRetirementPayableDate: (page: Page) => Promise<string | null>;
  getAdditionalDataSourceUrl: (page: Page) => Promise<string | null>;
  getFirstToolTipIcon: (page: Page) => Promise<string | null>;
  getSecondToolTipIcon: (page: Page) => Promise<string | null>;
  getContentsOfFirstToolTip: (page: Page) => Promise<string | null>;
  getContentsOfSecondToolTip: (page: Page) => Promise<string | null>;
  getIntroInformation: (page: Page) => Promise<string | null>;
  verifyMonthlyEstimateToday: (
    page: Page,
    expectedAmount: number | null,
  ) => Promise<boolean>;
  verifyYearlyEstimateToday: (
    page: Page,
    expectedAmount: number | null,
  ) => Promise<boolean>;
  verifyMonthlyForecast: (
    page: Page,
    expectedAmount: number | null,
  ) => Promise<boolean>;
  verifyYearlyForecast: (
    page: Page,
    expectedAmount: number | null,
  ) => Promise<boolean>;
  formatAmount: (amount: string | null) => string;
};

const statePensionsDetailsPage: StatePensionsDetailsPage = {
  accordionTextAbout:
    "How much you'll get in your State Pensions depends on how many years you've made National Insurance contributions. When you reach State Pension age, you usually need 35 qualifying years to get the full State Pension, and ten qualifying years to get anything. Learn more",
  estimatedIncomeSubheading: 'Estimated income',
  toolTip1Text:
    "The State Pension age is the earliest age you can claim State Pension. You don't have to start taking your State Pension at this age - you can also defer it.Close",
  toolTip2Text:
    'National Insurance (NI) is a type of tax you pay to qualify for State Pension and some types of benefits. You usually need 35 qualifying years of NI contributions to get the full State Pension, and ten qualifying years to get anything. Learn more (opens in a new window) Close',
  toolTipLocator:
    'label[data-testid="tooltip-icon"] span:text-is("Show more information")',
  forecastStatementTitle: 'About your State Pension forecast',

  async waitForPageTitle(page: Page) {
    await page
      .getByTestId('page-title')
      .waitFor({ state: 'visible', timeout: 5000 });
  },

  async getForecastStatement(page: Page) {
    const forecastHeader = page
      .locator('h2')
      .filter({ hasText: 'About your State Pension forecast' });

    const paragraphBelow = forecastHeader.locator(':scope + p');
    return await paragraphBelow.textContent();
  },

  async getCurrentMonthlyAmount(page: Page) {
    return (
      (
        await page.getByTestId('monthly-estimate-today').textContent()
      )?.trim() ?? ''
    );
  },

  async getCurrentAnnualAmount(page: Page) {
    return (
      (await page.getByTestId('yearly-estimate-today').textContent())?.trim() ??
      ''
    );
  },

  async getRetirementAnnualAmount(page: Page) {
    return (
      (await page.getByTestId('yearly-forecast').textContent())?.trim() ?? ''
    );
  },

  async getRetirementMonthlyAmount(page: Page) {
    return (
      (await page.getByTestId('monthly-forecast').textContent())?.trim() ?? ''
    );
  },

  async getCurrentPayableDate(page: Page) {
    return (
      (
        await page.getByTestId('payable-date-estimate-today').textContent()
      )?.trim() ?? ''
    );
  },

  async getRetirementPayableDate(page: Page) {
    return (
      (await page.getByTestId('payable-date-forecast').textContent())?.trim() ??
      ''
    );
  },

  async getAdditionalDataSourceUrl(page: Page) {
    return await page.getByTestId('table-section-content').nth(1).textContent();
  },

  async getIntroInformation(page: Page) {
    const locator = page.getByTestId('tool-intro');
    if ((await locator.count()) === 0) {
      return null;
    }
    return await locator.innerText();
  },

  async getFirstToolTipIcon(page: Page) {
    const locator = page.locator(this.toolTipLocator).first();
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  },

  async getSecondToolTipIcon(page: Page) {
    const locator = page.locator(this.toolTipLocator).nth(1);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  },

  async getContentsOfFirstToolTip(page: Page) {
    const locator = page.locator('span[data-testid="tooltip-content"]').nth(0);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  },

  async getForecastStatementTitle(page: Page) {
    return page
      .locator('.text-gray-800.mt-10.mb-5.text-3xl.font-bold.md\\:text-5xl')
      .textContent();
  },

  async getContentsOfSecondToolTip(page: Page) {
    const locator = page.locator('span[data-testid="tooltip-content"]').nth(1);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  },

  async verifyMonthlyEstimateToday(page: Page, expectedAmount: number | null) {
    const displayedAmount = await this.getCurrentMonthlyAmount(page);
    const formattedAmount = this.formatAmount(displayedAmount);
    if (expectedAmount === null) {
      return formattedAmount === '--';
    }

    return formattedAmount.includes(expectedAmount.toString());
  },

  async verifyYearlyEstimateToday(page: Page, expectedAmount: number | null) {
    const displayedAmount = await this.getCurrentAnnualAmount(page);
    const formattedAmount = this.formatAmount(displayedAmount);
    if (expectedAmount === null) {
      return formattedAmount === '--';
    }
    return formattedAmount.includes(expectedAmount.toString());
  },

  async verifyMonthlyForecast(page: Page, expectedAmount: number | null) {
    const displayedAmount = await this.getRetirementMonthlyAmount(page);
    const formattedAmount = this.formatAmount(displayedAmount);
    if (expectedAmount === null) {
      return formattedAmount === '--';
    }
    return formattedAmount.includes(expectedAmount.toString());
  },

  async verifyYearlyForecast(page: Page, expectedAmount: number | null) {
    const displayedAmount = await this.getRetirementAnnualAmount(page);
    const formattedAmount = this.formatAmount(displayedAmount);
    if (expectedAmount === null) {
      return formattedAmount === '--';
    }
    return formattedAmount.includes(expectedAmount.toString());
  },

  formatAmount(amount: string | null): string {
    // if (!amount) return '';
    if (!amount || amount.trim() === '') return '--';
    return amount
      .replace('£', '')
      .replace(/,/g, '')
      .replace(' a year', '')
      .replace(' a month', '');
  },
};

export default statePensionsDetailsPage;
