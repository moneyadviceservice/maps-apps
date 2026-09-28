import { Page } from '@maps/playwright';

class StatePensionsDetailsPage {
  constructor(private readonly page: Page) {}

  readonly accordionTextAbout =
    "How much you'll get in your State Pensions depends on how many years you've made National Insurance contributions. When you reach State Pension age, you usually need 35 qualifying years to get the full State Pension, and ten qualifying years to get anything. Learn more";
  readonly estimatedIncomeSubheading = 'Estimated income';
  readonly toolTip1Text =
    "The State Pension age is the earliest age you can claim State Pension. You don't have to start taking your State Pension at this age - you can also defer it.Close";
  readonly toolTip2Text =
    'National Insurance (NI) is a type of tax you pay to qualify for State Pension and some types of benefits. You usually need 35 qualifying years of NI contributions to get the full State Pension, and ten qualifying years to get anything. Learn more (opens in a new window) Close';
  readonly toolTipLocator =
    'label[data-testid="tooltip-icon"] span:text-is("Show more information")';
  readonly forecastStatementTitle = 'About your State Pension forecast';

  async waitForPageTitle() {
    await this.page
      .getByTestId('page-title')
      .waitFor({ state: 'visible', timeout: 5000 });
  }

  async getForecastStatement() {
    const forecastHeader = this.page
      .locator('h2')
      .filter({ hasText: 'About your State Pension forecast' });

    const paragraphBelow = forecastHeader.locator(':scope + p');
    return await paragraphBelow.textContent();
  }

  async getCurrentMonthlyAmount() {
    return (
      (
        await this.page.getByTestId('monthly-estimate-today').textContent()
      )?.trim() ?? ''
    );
  }

  async getGuideTextOnAPIncome() {
    return (
      (
        await this.page.getByTestId('sp-estimated-income-ap').textContent()
      )?.trim() ?? ''
    );
  }

  async getDisplayedAPAmount() {
    return (
      (
        await this.page.getByTestId('sp-progress-bar-ap').textContent()
      )?.trim() ?? ''
    );
  }

  async getGuideTextOnERIIncome() {
    return (
      (
        await this.page.getByTestId('sp-estimated-income-eri').textContent()
      )?.trim() ?? ''
    );
  }

  async getDisplayedERIAmount() {
    return (
      (
        await this.page.getByTestId('sp-progress-bar-eri').textContent()
      )?.trim() ?? ''
    );
  }

  async getCurrentAnnualAmount() {
    return (
      (
        await this.page.getByTestId('yearly-estimate-today').textContent()
      )?.trim() ?? ''
    );
  }

  async getRetirementAnnualAmount() {
    return (
      (await this.page.getByTestId('yearly-forecast').textContent())?.trim() ??
      ''
    );
  }

  async getRetirementMonthlyAmount() {
    return (
      (await this.page.getByTestId('monthly-forecast').textContent())?.trim() ??
      ''
    );
  }

  async getCurrentPayableDate() {
    return (
      (
        await this.page.getByTestId('payable-date-estimate-today').textContent()
      )?.trim() ?? ''
    );
  }

  async getRetirementPayableDate() {
    return (
      (
        await this.page.getByTestId('payable-date-forecast').textContent()
      )?.trim() ?? ''
    );
  }

  async getAdditionalDataSourceUrl() {
    return await this.page
      .getByTestId('table-section-content')
      .nth(1)
      .textContent();
  }

  async getIntroInformation() {
    const locator = this.page.getByTestId('tool-intro');
    if ((await locator.count()) === 0) {
      return null;
    }
    return await locator.innerText();
  }

  async getFirstToolTipIcon() {
    const locator = this.page.locator(this.toolTipLocator).first();
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  }

  async getSecondToolTipIcon() {
    const locator = this.page.locator(this.toolTipLocator).nth(1);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  }

  async getContentsOfFirstToolTip() {
    const locator = this.page
      .locator('span[data-testid="tooltip-content"]')
      .nth(0);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  }

  async getForecastStatementTitle() {
    return this.page
      .locator('.text-gray-800.mt-10.mb-5.text-3xl.font-bold.md\\:text-5xl')
      .textContent();
  }

  async getContentsOfSecondToolTip() {
    const locator = this.page
      .locator('span[data-testid="tooltip-content"]')
      .nth(1);
    if ((await locator.count()) === 0) {
      return null;
    }
    return locator.innerText();
  }

  formatAmount(amount: string | null): string {
    // if (!amount) return '';
    if (!amount || amount.trim() === '') return '--';
    return amount
      .replace('£', '')
      .replace(/,/g, '')
      .replace(' a year', '')
      .replace(' a month', '');
  }
}

export default StatePensionsDetailsPage;
