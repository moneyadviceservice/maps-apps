import { BasePage } from '@pages/Base.page';

export class EmployerDateComponent extends BasePage {
  get monthInput() {
    return this.page.locator('#month');
  }
  get yearInput() {
    return this.page.locator('#year');
  }
}
