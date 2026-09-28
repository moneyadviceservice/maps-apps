import { Page } from '@lib/test.lib';

export class CalculatorPage {
  constructor(private readonly page: Page) {}

  private readonly TEST_IDS = {
    FIRST_ERROR_MESSAGE: 'error-link-0',
    SECOND_ERROR_MESSAGE: 'error-link-1',
    THIRD_ERROR_MESSAGE: 'error-link-2',
  };

  async goto(endpoint = '') {
    await this.page.goto('/en/cash-in-chunks' + endpoint);
  }

  get incomeField() {
    return this.page.locator('input#income');
  }

  get potField() {
    return this.page.locator('input#pot');
  }

  get chunkField() {
    return this.page.locator('input#chunk');
  }

  get submitButton() {
    return this.page.locator('button#submit');
  }

  get updateField() {
    return this.page.locator('input#updateChunk');
  }

  get updateLabel() {
    return this.page.locator('label', {
      hasText: 'See what happens if you take a different amount:',
    });
  }

  get tableLabel() {
    return this.page.locator('#results dl dt').first();
  }

  get tableData() {
    return {
      takeValue: this.page.locator('#results dd').nth(0).innerText(),
      taxValue: this.page.locator('#results dd').nth(1).innerText(),
      remainingPotValue: this.page.locator('#results dd').nth(2).innerText(),
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
      errorMessage3: this.page.getByTestId(this.TEST_IDS.THIRD_ERROR_MESSAGE),
    };
  }

  get allErrorMessageLinks() {
    return this.page.getByTestId(/^error-link-/);
  }

  get incomeErrorLabel() {
    return this.page.locator('#income-error');
  }

  get potErrorLabel() {
    return this.page.locator('#pot-error');
  }

  get chunkErrorLabel() {
    return this.page.locator('#chunk-error');
  }

  get pageHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get resultsContainer() {
    return this.page.locator('div#results');
  }

  async getHeadingText() {
    return await this.pageHeading.evaluate((el) => el.textContent?.trim());
  }

  async getResultsText() {
    // Get the full results section content
    const resultsContent = await this.resultsContainer.textContent();
    return resultsContent;
  }

  async getTableHeaders() {
    // Get table header row (thead th elements)
    const headerTexts = await this.page
      .locator('#results > table > thead > tr > th')
      .allTextContents();
    return headerTexts;
  }

  async getInstructionText() {
    // Get instruction/guidance text from the entire results section (EN and CY)
    const resultsContent = await this.resultsContainer.textContent();
    // Extract text that contains instruction keywords (English or Welsh)
    if (
      resultsContent?.includes('See what happens') ||
      resultsContent?.includes('Gweler beth fydd')
    ) {
      return resultsContent;
    }
    return '';
  }

  async getFormLabels() {
    // Get all form field labels
    const labels = await this.page.locator('label').allTextContents();
    return labels;
  }

  async getDescriptionText() {
    // Get description/intro text before form (if present)
    const introTexts = await this.page
      .locator(
        'div[class*="description"], p[class*="intro"], div[class*="intro"]',
      )
      .allTextContents();
    return introTexts.join(' ');
  }

  async getDisclaimerText() {
    // Get disclaimer text from results section
    const disclaimers = await this.resultsContainer
      .locator('p, div[class*="disclaimer"], small')
      .allTextContents();
    return disclaimers.join(' ');
  }

  async getAdvisoryLinks() {
    // Get links to financial advisers or related content
    const links = await this.resultsContainer.locator('a').allTextContents();
    return links;
  }

  async fillForm(formValues: { income: string; pot: string; chunk: string }) {
    await this.incomeField.fill(formValues.income);
    await this.potField.fill(formValues.pot);
    await this.chunkField.fill(formValues.chunk);
    await this.submitButton.click();
  }
}
