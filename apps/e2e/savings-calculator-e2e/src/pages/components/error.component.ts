import { BasePage } from '@pages/Base.page';

export class ErrorComponent extends BasePage {
  get errorContainer() {
    return this.page.locator('#error-summary-container');
  }

  errorMessage(listNum: number) {
    return this.errorContainer.getByTestId(`error-link-${listNum}`);
  }
}
