import { BasePage } from '@pages/Base.page';

export class RedundancyOptionComponent extends BasePage {
  async redundancySelect(option: string) {
    return this.page
      .locator(`input[aria-label="${option}"]`)
      .locator('..')
      .getByTestId('radio-button-label');
  }

  async redundancyHighlighted(option: string) {
    return this.page.locator(`[aria-label="${option}"]`);
  }
}
