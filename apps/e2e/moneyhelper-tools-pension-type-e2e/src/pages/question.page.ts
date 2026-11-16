import { Page } from '@lib/test.lib';

export class QuestionPage {
  constructor(private readonly page: Page) {}

  private getOptionByText(text: string) {
    return this.page.locator('label').getByText(text, { exact: true });
  }

  get continueButton() {
    return this.page.getByTestId('step-container-submit-button');
  }

  get header() {
    return this.page.locator('main h1');
  }

  async selectOptionAndContinue(text: string) {
    await this.getOptionByText(text).click();
    await this.continueButton.click();
  }

  async answerQuestions(listOfAnswersInOrder: string[]) {
    for (const answer of listOfAnswersInOrder) {
      // Ignoring SonarQube here since this is an acceptable pattern in Playwright.
      await this.selectOptionAndContinue(answer); // NOSONAR
    }
  }
}
