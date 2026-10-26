import { BasePage } from '@pages/Base.page';

export class CommonComponent extends BasePage {
  get title() {
    return this.page.locator('h1').first();
  }

  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }

  getCheckbox(checkBox: string) {
    return this.page.locator(`label[for="id-${checkBox}"]:visible`);
  }

  async selectAnswerAndContinue(answer: string) {
    await this.getCheckbox(answer).click();
    await this.continueButton.click();
  }
}
