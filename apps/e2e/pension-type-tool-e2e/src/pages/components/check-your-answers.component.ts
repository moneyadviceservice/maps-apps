import { BasePage } from '@pages/Base.page';

export enum ROWSELECTION {
  setUpBy = '1',
  pensionComeFrom = '2',
  pensionProvider = '3',
  pensionStartDate = '4',
}
export type rowSelectionKey = keyof typeof ROWSELECTION;

export class CheckYourAnswersComponent extends BasePage {
  get answerRows() {
    return this.page.locator('[data-testid^="answer-"]');
  }

  async getAnswerTexts() {
    const answers = await this.answerRows.allTextContents();
    return answers.map((answer) => answer.trim());
  }

  get continueButton() {
    return this.page.getByTestId('next-page-button');
  }

  async continueToResults() {
    await this.continueButton.click();
  }

  async answerTitle(row: rowSelectionKey) {
    return this.page.getByTestId(`q-${ROWSELECTION[row]}`);
  }

  async answerRow(row: rowSelectionKey) {
    return this.page.getByTestId(`answer-${ROWSELECTION[row]}`);
  }

  async editAnswerRow(row: rowSelectionKey) {
    return this.page.getByTestId(`change-question-${ROWSELECTION[row]}`);
  }

  async changeAnswer(row: rowSelectionKey) {
    await (await this.editAnswerRow(row)).click();
  }
}
