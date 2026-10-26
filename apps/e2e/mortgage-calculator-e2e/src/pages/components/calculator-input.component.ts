import { BasePage } from '@pages/Base.page';

export class CalculatorInput extends BasePage {
  get interestOnlyCheckbox() {
    return this.page.locator('#interest').locator('..');
  }

  get propertyPrice() {
    return this.page.locator('#price');
  }

  get deposit() {
    return this.page.locator('#deposit');
  }

  get mortgageTerm() {
    return this.page.locator('#termYears');
  }

  get interestRate() {
    return this.page.locator('#rate');
  }

  get calculateButton() {
    return this.page.getByTestId('calculate-submit-button');
  }
}
