import { BasePage } from '@pages/Base.page';

export class DateOfBirthComponent extends BasePage {
  get dayInput() {
    return this.page.locator('#day');
  }
  get monthInput() {
    return this.page.locator('#month');
  }
  get yearInput() {
    return this.page.locator('#year');
  }
}
