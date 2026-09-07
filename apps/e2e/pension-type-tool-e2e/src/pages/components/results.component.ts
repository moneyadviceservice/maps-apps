import { BasePage } from '@pages/Base.page';

export class ResultsComponent extends BasePage {
  get bookAppointmentButton() {
    return this.page.locator('#pension-appointment-button');
  }
}
