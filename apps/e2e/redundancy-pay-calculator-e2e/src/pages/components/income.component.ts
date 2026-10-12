import { BasePage } from '@pages/Base.page';

export class IncomeComponent extends BasePage {
  get salaryInput() {
    return this.page.locator('input#input-5');
  }
  get frequency() {
    return this.page.locator('select#select-5');
  }
}
