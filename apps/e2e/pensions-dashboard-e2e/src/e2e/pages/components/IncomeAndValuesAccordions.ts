import { Locator, Page } from '@playwright/test';

class IncomeAndValuesAccordions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAccordionLocator(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"] details`);
  }

  getLabelLocator(testId: string): Locator {
    return this.getAccordionLocator(testId).locator('summary');
  }

  getListItemsLocator(testId: string): Locator {
    return this.getAccordionLocator(testId).locator('ul > li');
  }

  getCalculationContentLocator(testId: string): Locator {
    return this.getAccordionLocator(testId).locator(
      '[data-testid="calculation-content"]',
    );
  }

  async toggle(testId: string): Promise<void> {
    await this.getLabelLocator(testId).click();
  }

  async getListItemsText(testId: string): Promise<string[]> {
    return this.getListItemsLocator(testId).allTextContents();
  }

  async getCalculationText(testId: string): Promise<string> {
    return (await this.getCalculationContentLocator(testId).innerText())
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export default IncomeAndValuesAccordions;
