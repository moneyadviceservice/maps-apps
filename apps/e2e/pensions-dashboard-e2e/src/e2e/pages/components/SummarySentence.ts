import { type Page } from '@playwright/test';

class ConfirmedPensionsSummary {
  private readonly accordion: ReturnType<Page['locator']>;

  constructor(private readonly page: Page) {
    this.accordion = this.page.locator('[data-testid="summary-accordion"]');
  }

  async getHeading() {
    return this.page.getByTestId('summary-title').innerText();
  }

  async getStatePensionAge() {
    const pElement = this.page.getByTestId(
      'summary-sentence-state-pension-age',
    );

    // Use page.evaluate() to run a function in the browser
    const textContent = await pElement.evaluate((pNode) => {
      // Clone the element to avoid modifying the actual page
      const clone = pNode.cloneNode(true) as HTMLElement;
      // Select all span elements within the clone and remove them
      for (const span of Array.from(clone.querySelectorAll('span'))) {
        span.remove();
      }
      // Return the text content of the modified clone
      return clone.textContent?.trim();
    });

    return textContent;
  }

  async getTooltipText() {
    return this.page.getByTestId('tooltip-content').innerText();
  }

  async getMonthlyAmount() {
    return this.page.getByTestId('summary-sentence-monthly').innerText();
  }

  async getYearlyAmount() {
    return this.page.getByTestId('summary-sentence-annual').innerText();
  }

  async getPayableDate() {
    return this.page.getByTestId('summary-sentence-snapshot').innerText();
  }

  async getTimelineLinkText() {
    return this.page.getByTestId('timeline-link').innerText();
  }

  async getAccordionTitle() {
    return this.accordion
      .locator('[data-testid="summary-block-title"]')
      .innerText();
  }

  async getAccordionFirstParagraph() {
    const firstParagraphLocator = this.accordion
      .locator('p.mb-4[data-testid="paragraph"]')
      .nth(0);
    await firstParagraphLocator.waitFor({ state: 'visible' });

    return firstParagraphLocator.innerText();
  }

  async getAccordionSecondParagraph() {
    const secondParagraphLocator = this.accordion
      .locator('p.mb-4[data-testid="paragraph"]')
      .nth(1);
    await secondParagraphLocator.waitFor({ state: 'visible' });

    return secondParagraphLocator.textContent();
  }

  async getSummaryTextNoSP() {
    return this.page.getByTestId('summary-sentence-no-sp').innerText();
  }

  async getEstimatedIncome(page, schemeName) {
    const locator = page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName })
      .getByTestId('pension-card-monthly-amount');

    const incomeString = await locator.textContent();

    if (incomeString === null) {
      throw new Error(
        `Could not find income string for scheme: ${schemeName}. Locator returned null.`,
      );
    }

    const cleanString = incomeString.trim().replace('a month', '').trim();

    return cleanString;
  }

  async clickAccordion() {
    this.accordion.click();
  }

  async clickTooltip() {
    const tooltipInputLocator = this.page.getByTestId('tooltip-input');

    const tooltipInputId = await tooltipInputLocator.getAttribute('id');

    await this.page.locator(`label[for="${tooltipInputId}"]`).click();
  }

  async clickTaxAndPensionsLink() {
    const linkLocator = this.page.getByRole('link', {
      name: 'tax and pensions',
    });
    await linkLocator.click();
  }

  /**
   * Calculates the total monthly and yearly income by summing individual pension amounts.
   * @param {string[]} pensionSchemes - An array of pension scheme names.
   * @returns {Promise<{monthly: number, yearly: number}>} The calculated totals.
   */
  async calculateTotalsFromPensions(pensionSchemes) {
    const numericIncomes = await Promise.all(
      pensionSchemes.map(async (scheme) => {
        const currencyString = await this.getEstimatedIncome(this.page, scheme);
        if (!/\d/.test(currencyString)) {
          return 0;
        }
        return Number.parseInt(currencyString.replaceAll(/[£,]/g, ''), 10);
      }),
    );
    const monthlyTotal = numericIncomes.reduce(
      (sum, income) => sum + income,
      0,
    );
    const yearlyTotal = monthlyTotal * 12;

    return {
      monthly: monthlyTotal,
      yearly: yearlyTotal,
    };
  }
}

export default ConfirmedPensionsSummary;
