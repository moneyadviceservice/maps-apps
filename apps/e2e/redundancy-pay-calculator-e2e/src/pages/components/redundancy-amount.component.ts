import { BasePage } from '@pages/Base.page';

export class RedundancyAmountComponent extends BasePage {
  get redundancyAmount() {
    return this.page.getByTestId('input-7');
  }
  get dontKnowCheckbox() {
    return this.page.getByTestId('checkbox-7');
  }
}
