import { BasePage } from '@pages/Base.page';

export class FailedResultsComponent extends BasePage {
  get overstretchedTitle() {
    return this.page.getByTestId('notification-box-warning');
  }
  get overstretchedPargraphOne() {
    return this.page.getByTestId('paragraph').first();
  }
  get overstretchedPargraphTwo() {
    return this.page.getByTestId('paragraph').nth(1);
  }
  get overstretchedPargraphThree() {
    return this.page.getByTestId('paragraph').nth(2);
  }
}
