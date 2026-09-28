import { expect, Page } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class App {
  constructor(private readonly page: Page) {}

  private readonly TEST_IDS = {
    FIRST_ERROR_MESSAGE: 'error-link-0',
    SECOND_ERROR_MESSAGE: 'error-link-1',
  };

  /**
   * Navigate to the Leave Pot Untouched calculator page.
   *
   * @param endpoint - Optional path suffix to navigate to a specific route under the page.
   * @param options - Navigation options.
   * @param options.ignoreCookiesBanner - If true, skips accepting the cookies banner after navigation.
   */
  async goto(endpoint = '', options: GotoOptions = {}) {
    const { ignoreCookiesBanner = false } = options;
    await this.page.goto('/en/guaranteed-income-estimator' + endpoint);
    if (!ignoreCookiesBanner) {
      await this.acceptAllCookiesButton.click();
    }
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  get potField() {
    return this.page.locator('input#pot');
  }

  get ageField() {
    return this.page.locator('input#age');
  }

  get submitButton() {
    return this.page.locator('button#submit');
  }

  get taxFreeText() {
    return this.page.locator('#results dd').nth(0);
  }

  get resultsSection() {
    return this.page.locator('#results');
  }

  get resultsHeading() {
    return this.page.locator('#results dl dt').first();
  }

  async getResultsText() {
    return (await this.resultsSection.innerText()) ?? '';
  }

  get tableData() {
    return {
      potValue: this.page.locator('#results dd').nth(0).innerText(),
      taxValue: this.page.locator('#results dd').nth(1).innerText(),
    };
  }

  get errorHeader() {
    return this.page.getByRole('heading', {
      name: 'Unable to submit the form',
    });
  }

  get errorMessageLinks() {
    return {
      errorMessage1: this.page.getByTestId(this.TEST_IDS.FIRST_ERROR_MESSAGE),
      errorMessage2: this.page.getByTestId(this.TEST_IDS.SECOND_ERROR_MESSAGE),
    };
  }

  get ageErrorLabel() {
    return this.page.locator('[data-testid="errors"]').locator('#age-error');
  }

  get potErrorLabel() {
    return this.page.locator('[data-testid="errors"]').locator('#pot-error');
  }

  get pageHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  async getHeadingText() {
    return await this.pageHeading.evaluate((el) => el.textContent?.trim());
  }

  async getFormLabels() {
    // Get all form field labels
    const labels = await this.page.locator('label').allTextContents();
    return labels;
  }

  async getDisclaimerText() {
    // Get disclaimer text from results section
    const disclaimers = await this.resultsSection
      .locator('p, div[class*="disclaimer"], small')
      .allTextContents();
    return disclaimers.join(' ');
  }

  async getAdvisoryLinks() {
    // Get links to financial advisers or related content
    const links = await this.resultsSection.locator('a').allTextContents();
    return links;
  }

  /**
   * Verify English heading and form labels match expected content
   */
  async verifyEnglishHeadingAndLabels() {
    await expect(this.pageHeading).toBeVisible();
    const headingText = await this.getHeadingText();
    expect(headingText).toContain('Estimate how much guaranteed income');
    expect(headingText).toContain('you could get');
    const formLabelText = (await this.getFormLabels()).join(' ');
    expect(formLabelText).toContain('pension currently worth');
    expect(formLabelText).toContain('income to start');
  }

  /**
   * Verify English results section contains all expected content
   * Including: tax-free lump sum, 25% percentage, fixed income, annuity details, LSA info
   */
  async verifyEnglishResults() {
    const resultsContent = await this.getResultsText();
    expect(resultsContent).toContain('tax-free lump sum');
    expect(resultsContent).toContain('25% of your pension');
    expect(resultsContent).toContain('fixed');
    expect(resultsContent).toContain('each year');
    expect(resultsContent).toContain('single-life annuity');
    expect(resultsContent).toContain('This estimate assumes:');
    expect(resultsContent).toContain('25%');
    expect(resultsContent).toContain('annuity');
    expect(resultsContent).toContain('lump sum allowance');
    expect((await this.getDisclaimerText()).length).toBeGreaterThan(0);
    expect((await this.getAdvisoryLinks()).length).toBeGreaterThan(0);
  }

  /**
   * Verify Welsh results section contains all expected content
   * Including: 25% percentage, income references, tax-free details, assumptions, and mutation forms
   */
  async verifyWelshResults() {
    const resultsContent = await this.getResultsText();
    expect(resultsContent).toContain('25%');
    expect(resultsContent).toContain('incwm');
    expect(resultsContent).toContain('blwydd');
    expect(resultsContent).toContain('di-dreth');
    const hasAssumptions =
      resultsContent.includes('tybio') ||
      resultsContent.includes('assumes') ||
      resultsContent.includes('Assumption');
    expect(hasAssumptions).toBeTruthy();
    const hasTakeOrGive =
      resultsContent.includes('gymryd') ||
      resultsContent.includes('cymryd') ||
      resultsContent.includes('rhoi');
    expect(hasTakeOrGive).toBeTruthy();
    expect((await this.getDisclaimerText()).length).toBeGreaterThan(0);
    expect((await this.getAdvisoryLinks()).length).toBeGreaterThan(0);
  }

  /**
   * Verify Welsh heading and form labels match expected content
   */
  async verifyWelshHeadingAndLabels() {
    await expect(this.pageHeading).toBeVisible();
    const headingText = await this.getHeadingText();
    expect(headingText).toContain('Amcangyfrif faint o');
    expect(headingText).toContain('incwm gwarantedig');
    expect(headingText).toContain('gallwch');
    const formLabelText = (await this.getFormLabels()).join(' ');
    expect(formLabelText).toContain('pensiwn');
    expect(formLabelText).toContain('gwerth');
    expect(formLabelText).toContain('oedran');
  }
}
