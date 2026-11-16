import { BasePage } from '@pages/Base.page';

export class ErrorComponent extends BasePage {
  get errorBox() {
    return this.page.getByTestId('error-records');
  }
  get errorTitle() {
    return this.page.getByTestId('error-summary-heading');
  }
  get errorMessage() {
    return this.page.getByTestId('error-link-0');
  }
}
