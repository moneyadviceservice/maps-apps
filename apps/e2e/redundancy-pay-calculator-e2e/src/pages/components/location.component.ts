import { BasePage } from '@pages/Base.page';

export class LocationComponent extends BasePage {
  async locationCheckbox(country: string) {
    return this.page
      .locator(`[aria-label="${country}"]`)
      .locator('..')
      .getByTestId('radio-button-label');
  }

  async locationHighlighted(country: string) {
    return this.page.locator(`[aria-label="${country}"]`);
  }
}
