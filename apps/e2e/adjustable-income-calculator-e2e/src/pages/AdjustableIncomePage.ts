import { Page } from '@lib/test.lib';

export class AdjustableIncomePage {
  constructor(private readonly page: Page) {}

  private readonly TEST_IDS = {
    FIRST_ERROR_MESSAGE: 'error-link-0',
    SECOND_ERROR_MESSAGE: 'error-link-1',
    THIRD_ERROR_MESSAGE: 'error-link-2',
  };

  async goto(endpoint = '') {
    await this.page.goto(endpoint);
  }

  get ageInput() {
    return this.page.locator('input#age');
  }

  get potInput() {
    return this.page.locator('input#pot');
  }

  get ageInputParent() {
    return this.page.locator('input#age').locator('..');
  }

  get potInputParent() {
    return this.page.locator('input#pot').locator('..');
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

  get resultsSection() {
    return this.page.locator('#results');
  }

  get allowanceNote() {
    return this.resultsSection.locator('p').filter({ hasText: '£1,073,100' });
  }

  get allowanceLink() {
    return this.allowanceNote.locator('a').nth(0);
  }

  get adviserLink() {
    return this.allowanceNote.locator('a').nth(1);
  }

  get tableLabel() {
    return this.page.locator('#results dl dt').first();
  }

  get tableData() {
    return {
      taxFreeValue: this.page.locator('#results dd').nth(0).innerText(),
      incomeValue: this.page.locator('#results dd').nth(1).innerText(),
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

  get potErrorLabel() {
    return this.page.locator('#pot-error[data-testid="error-label"]');
  }

  get ageErrorLabel() {
    return this.page.locator('#age-error[data-testid="error-label"]');
  }

  get potLabel() {
    return this.page.locator('label[for=pot]');
  }

  get ageLabel() {
    return this.page.locator('label[for=age]');
  }

  async fillForm(formValues: { age: string; pot: string }) {
    await this.ageInput.fill(formValues.age);
    await this.potInput.fill(formValues.pot);
    await this.submitButton.click();
  }
}
