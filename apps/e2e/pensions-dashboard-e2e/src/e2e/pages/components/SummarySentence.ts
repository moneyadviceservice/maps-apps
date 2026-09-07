import { Locator, type Page } from '@maps/playwright';

class ConfirmedPensionsSummary {
  private readonly accordion: ReturnType<Page['locator']>;
  readonly specificYearAccordionTitle: ReturnType<Page['locator']>;
  readonly specificYearAccordion: ReturnType<Page['locator']>;
  readonly potValueTitle: ReturnType<Page['locator']>;
  readonly potValueToolTipIconState: ReturnType<Page['locator']>;
  readonly potValueToolTipText: ReturnType<Page['locator']>;
  readonly potValueAmount: ReturnType<Page['locator']>;
  readonly potValueAmountText: ReturnType<Page['locator']>;
  readonly potValueAccordion: ReturnType<Page['locator']>;
  readonly tooltipIcon: Locator;
  readonly linkPageHeading: Locator;
  readonly isMobile: boolean;

  constructor(private readonly page: Page, isMobile?: boolean) {
    this.isMobile = isMobile ?? false;
    this.accordion = this.page.locator('[data-testid="summary-accordion"]');
    const suffix = this.isMobile ? 'mobile' : 'desktop';
    this.specificYearAccordionTitle = page
      .getByTestId(`specific-year-accordion-${suffix}`)
      .getByTestId('summary-block-title');
    this.specificYearAccordion = page.getByTestId(
      `specific-year-accordion-${suffix}`,
    );
    this.potValueTitle = page.getByTestId('pot-value-title');
    this.potValueToolTipIconState = page.locator(
      'p[data-testid="pot-value-title"] label[data-testid="tooltip-icon"]',
    );
    this.potValueToolTipText = page.locator(
      'p[data-testid="pot-value-title"] span[data-testid="tooltip-content"]',
    );
    this.potValueAmount = page.getByTestId('pot-value-amount');
    this.potValueAmountText = page.getByTestId('pot-value-text');
    this.potValueAccordion = page.getByTestId('pot-value-accordion');
    this.tooltipIcon = page
      .getByTestId('pension-detail-type')
      .locator('[data-testid="tooltip-icon"]');
    this.linkPageHeading = page.getByRole('heading', {
      name: 'Understand your pensions',
      exact: true,
    });
  }

  async getExplainer(type: string) {
    return {
      container: this.page.getByTestId(`callout-default-warning-${type}`),
      heading: this.page.getByTestId(`warning-title-${type}`),
      description: this.page.getByTestId(`warning-description-${type}`),
    };
  }

  get mcCloudAccordion() {
    const suffix = this.isMobile ? 'mobile' : 'desktop';
    return this.page.getByTestId(`mccloud-accordion-${suffix}`);
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

  async getPotValueAmount() {
    return this.potValueAmount.innerText();
  }

  async getTooltipText() {
    return (await this.page.getByTestId('tooltip-content').innerText())
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  async getPensionTypeTooltipText() {
    // Targets the tooltip content text block associated with the pension type element
    return (
      await this.page
        .getByTestId('pension-detail-type')
        .getByTestId('tooltip-content')
        .innerText()
    )
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  async clickPensionTypeTooltipLink() {
    await this.page
      .getByTestId('pension-detail-type')
      .getByTestId('tooltip-content')
      .locator('a')
      .click();
  }

  async getMonthlyAmount() {
    return this.page
      .getByTestId('summary-sentence-monthly-standard')
      .innerText();
  }

  async getYearlyAmount() {
    return this.page
      .getByTestId('summary-sentence-annual-standard')
      .innerText();
  }

  async getSummarySentenceTitle() {
    return this.page.getByTestId('summary-sentence-mccloud-title').innerText();
  }

  async getLegacyLabel() {
    return this.page.getByTestId('summary-sentence-label-legacy').innerText();
  }

  async getLegacyMonthlyAmount() {
    return this.page.getByTestId('summary-sentence-monthly-legacy').innerText();
  }

  async getLegacyYearlyAmount() {
    return this.page.getByTestId('summary-sentence-annual-legacy').innerText();
  }

  async getAlternativeLabel() {
    return this.page
      .getByTestId('summary-sentence-label-alternative')
      .innerText();
  }

  async getAlternativeMonthlyAmount() {
    return this.page
      .getByTestId('summary-sentence-monthly-alternative')
      .innerText();
  }

  async getAlternativeYearlyAmount() {
    return this.page
      .getByTestId('summary-sentence-annual-alternative')
      .innerText();
  }

  async getPayableDate() {
    return this.page.getByTestId('summary-sentence-snapshot').innerText();
  }

  async getTimelineLinkText() {
    return this.page.getByTestId('timeline-link').innerText();
  }

  get timelineLink() {
    return this.page.getByTestId('timeline-link');
  }

  async clickTimelineLink(page: Page) {
    await page.getByTestId('timeline-link').click();
    await page.waitForURL('**/your-pensions-timeline?income=legacy');
  }

  async clickTimelineLinkNonMcCloud(page: Page) {
    await page.getByTestId('timeline-link').click();
    await page.waitForURL('**/your-pensions-timeline');
  }

  async getAccordionTitle() {
    return this.accordion
      .locator('[data-testid="summary-block-title"]')
      .innerText();
  }

  async getSpecificYearAccordionTitle() {
    return this.specificYearAccordionTitle.innerText();
  }

  async getOptionsAccordionTitle() {
    return this.mcCloudAccordion
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

  async getSpecificYearAccordionText() {
    const suffix = this.isMobile ? 'mobile' : 'desktop';
    const specificYearParagraphLocator = this.page
      .getByTestId(`specific-year-accordion-${suffix}`)
      .getByTestId('paragraph');
    await specificYearParagraphLocator.waitFor({ state: 'visible' });
    return specificYearParagraphLocator.innerText();
  }

  async getAccordionSecondParagraph() {
    const secondParagraphLocator = this.accordion
      .locator('p.mb-4[data-testid="paragraph"]')
      .nth(1);
    await secondParagraphLocator.waitFor({ state: 'visible' });

    return secondParagraphLocator.textContent();
  }

  async getMcCloudAccordionFirstParagraph() {
    const firstParagraphLocator = this.mcCloudAccordion
      .locator('p.mb-4[data-testid="paragraph"]')
      .nth(0);
    await firstParagraphLocator.waitFor({ state: 'visible' });

    return firstParagraphLocator.innerText();
  }

  async getMcCloudAccordionSecondParagraph() {
    const secondParagraphLocator = this.mcCloudAccordion
      .locator('p.mb-4[data-testid="paragraph"]')
      .nth(1);
    await secondParagraphLocator.waitFor({ state: 'visible' });

    return secondParagraphLocator.textContent();
  }

  async getSummaryTextNoSP() {
    return (
      await this.page.getByTestId('summary-sentence-no-sp').innerText()
    ).trim();
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
    await this.accordion.click();
  }

  async clickSpecificYearAccordion() {
    await this.specificYearAccordionTitle.click();
  }

  async clickMcCloudAccordion() {
    await this.mcCloudAccordion.click();
  }

  async clickPensionTypeTooltip() {
    await this.page
      .getByTestId('pension-detail-type')
      .getByTestId('tooltip-icon')
      .click();
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
