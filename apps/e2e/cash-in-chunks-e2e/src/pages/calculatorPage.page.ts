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
      hasText: 'or try a different cash chunk:',
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

  async fillForm(formValues: { income: string; pot: string; chunk: string }) {
    await this.incomeField.fill(formValues.income);
    await this.potField.fill(formValues.pot);
    await this.chunkField.fill(formValues.chunk);
    await this.submitButton.click();
  }
}
