import { BasePage } from '@pages/Base.page';

export class CalculatorType extends BasePage {
  get description() {
    return this.page.getByTestId('paragraph').first();
  }
  get howLongTitle() {
    return this.page.getByTestId('paragraph').nth(1);
  }
  get howMuchTitle() {
    return this.page.getByTestId('paragraph').nth(2);
  }
  get howLong() {
    return this.page.locator('.t-primary-button').first();
  }
  get howMuch() {
    return this.page.locator('.t-primary-button').nth(1);
  }
}
