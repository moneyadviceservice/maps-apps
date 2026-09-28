// src/pages/lookup.page.ts
import { BasePage } from './base.page';

export class LookupPage extends BasePage {
  async open() {
    await this.goto('/en/pension-wise-appointment/find-appointment');
  }

  urnInput() {
    return this.page.locator("input[name='urn']");
  }

  findButton() {
    return this.page.getByTestId('find-urn');
  }

  urnError() {
    return this.page.getByTestId('urn-error');
  }

  async submit(urn: string) {
    await this.urnInput().fill(urn);
    await this.findButton().click();
  }
}
