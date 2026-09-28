import { BasePage } from '@pages/Base.page';

export class ErrorComponent extends BasePage {
  private get errorContainer() {
    return this.page.getByTestId('error-records');
  }
  get errorTitle() {
    return this.errorContainer.getByTestId('error-summary-heading');
  }
  get errorMessage() {
    return this.errorContainer.getByTestId('error-link-0').first();
  }
}
