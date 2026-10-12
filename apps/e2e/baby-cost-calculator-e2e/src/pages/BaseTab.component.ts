import { BasePage } from './Base.page';

export class BaseTabComponent extends BasePage {
  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  get saveAndComeBackLaterButton() {
    return this.page.getByRole('button', { name: /save and come back later/i });
  }

  get text() {
    return this.page.getByTestId('paragraph');
  }
}
