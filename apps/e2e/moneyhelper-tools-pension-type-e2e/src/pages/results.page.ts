import { Page } from '@lib/test.lib';

export class ResultsPage {
  constructor(private readonly page: Page) {}

  get header() {
    return this.page.locator('main h1');
  }

  get bookAppointmentButton() {
    return this.page.locator('#pension-appointment-button');
  }
}
