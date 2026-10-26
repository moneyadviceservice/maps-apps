import { CommonComponent } from '@pages/components/common-component.component';

export class PensionStartDatePage extends CommonComponent {
  get answerLabels() {
    return this.page.locator('main fieldset label');
  }

  answerInput(value: string) {
    return this.page.locator(`#id-${value}`);
  }

  async openQuestion(startPath: string) {
    await this.goto(startPath);
  }

  async progressToQuestion(startPath: string) {
    await this.openQuestion(startPath);

    for (const answer of ['0', '1', '1']) {
      await this.getCheckbox(answer).click();
      await this.continueButton.click();
    }
  }

  async selectAnswerAndContinue(answer: string) {
    await this.getCheckbox(answer).click();
    await this.continueButton.click();
  }

  async getBrowserTitle() {
    return this.page.title();
  }

  async getAnswerLabels() {
    const labels = await this.answerLabels.allTextContents();
    return labels.map((label) => label.trim());
  }
}
