import { Page } from '@lib/test.lib';

export class CheckAnswersPage {
  constructor(private readonly page: Page) {}

  get continueButton() {
    return this.page.getByTestId('next-page-button');
  }

  get header() {
    return this.page.locator('main h1');
  }
  get changeAnswerLinks() {
    return this.page.locator('[formaction="/api/form-actions/change-answer"]');
  }

  getChangeButtonByIndex(index: number) {
    return this.page.locator(`[data-testid="change-question-${index}"]`);
  }
}
