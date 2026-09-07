import { Locator, Page } from '@maps/playwright';

class IncomeAndValuesTab {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get legacyLabel(): Locator {
    return this.page.getByTestId('income-values-legacy-label');
  }

  get alternativeLabel(): Locator {
    return this.page.getByTestId('income-values-alternative-label');
  }

  get subText(): Locator {
    return this.page.getByTestId('income-values-multiplicity');
  }

  get mccloudSection(): Locator {
    return this.page.getByTestId('income-values-mccloud');
  }
  get heading(): Locator {
    return this.page.getByTestId('heading');
  }

  getIncomeItem(year: string, section: 'legacy' | 'alternative') {
    const list = this.page.getByTestId(`income-values-${section}-list`);
    return list.getByTestId(`income-item-${year}`);
  }

  getIncomeMonthly(year: string, section: 'legacy' | 'alternative') {
    return this.getIncomeItem(year, section).getByTestId('income-monthly');
  }

  getIncomeLumpSum(year: string, section: 'legacy' | 'alternative') {
    return this.getIncomeItem(year, section).getByTestId('income-lump-sum');
  }

  getIncomeDifference(year: string, section: 'legacy' | 'alternative') {
    return this.getIncomeItem(year, section).getByTestId('income-difference');
  }

  getBarLabel(year: string, label: string, barHeading: string) {
    const chartType = barHeading.includes('Lump') ? 'donut' : 'bar';

    return this.page
      .getByTestId(new RegExp(`^${year}-db-${chartType}`))
      .filter({
        has: this.page
          .getByTestId('mccloud-heading')
          .filter({ hasText: label }),
      })
      .getByTestId('mccloud-heading');
  }
}

export default IncomeAndValuesTab;
