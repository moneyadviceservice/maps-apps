import { BasePage } from './Base.page';

export class StartCalculatorPage extends BasePage {
  get startPageTitle() {
    return this.page.locator('h1').first();
  }

  get startPageIntro() {
    return this.page.getByTestId('tool-intro');
  }

  get introParagraphs() {
    return this.page.getByTestId('paragraph');
  }

  get introListItems() {
    return this.page.getByTestId('list-element').locator('li');
  }

  get startCalculatorButton() {
    return this.page.getByTestId('landing-page-button');
  }

  get startCalculatorHelpText() {
    return this.page.getByTestId('urgent-callout');
  }
}
