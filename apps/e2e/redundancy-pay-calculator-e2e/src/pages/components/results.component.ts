import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  statutoryPayValue(text: string) {
    return this.page.locator('h2').filter({ hasText: text });
  }
  get salary() {
    return this.page
      .getByTestId('notification-box-information')
      .locator('b')
      .first();
  }
  get months() {
    return this.page
      .getByTestId('notification-box-information')
      .locator('b')
      .nth(2);
  }
  get calloutTitle() {
    return this.page.getByTestId('notification-box-information').locator('h3');
  }
  get statutoryMessage() {
    return this.page.locator('h4').first().locator('..').locator('p').first();
  }
  get statutoryTitle() {
    return this.page.locator('h4').first();
  }
}
