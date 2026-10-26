import { CommonComponent } from '@pages/components/common-component.component';

export class Question1Page extends CommonComponent {
  /**
   * English option labels
   */
  get yesOptionLabel() {
    return this.page.locator('label:has-text("Yes")').first();
  }

  get noOptionLabel() {
    return this.page.locator('label:has-text("No")').first();
  }

  get notSureOptionLabel() {
    return this.page.locator('label:has-text("Not sure")').first();
  }

  /**
   * Welsh option labels
   */
  get doOptionLabel() {
    return this.page.locator('label:has-text("Do")').first();
  }

  get naOptionLabel() {
    return this.page.locator('label:has-text("Na")').first();
  }

  get ddimYnSiwrOptionLabel() {
    return this.page.locator('label:has-text("Ddim yn siŵr")').first();
  }

  /**
   * Get all option labels as text
   */
  async getOptionLabels() {
    const labels = this.page.locator('fieldset label');
    const count = await labels.count();
    const optionTexts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await labels.nth(i).textContent();
      if (text) {
        optionTexts.push(text.trim());
      }
    }

    return optionTexts;
  }

  async getAnswerOptions() {
    return this.getOptionLabels();
  }

  /**
   * Verify English options are present
   */
  async verifyEnglishOptions() {
    const options = await this.getOptionLabels();
    return {
      hasYes: options.some((opt) => opt.includes('Yes')),
      hasNo: options.some((opt) => opt.includes('No')),
      hasNotSure: options.some((opt) => opt.includes('Not sure')),
    };
  }

  /**
   * Verify Welsh options are present
   */
  async verifyWelshOptions() {
    const options = await this.getOptionLabels();
    return {
      hasDo: options.some((opt) => opt.includes('Do')),
      hasNa: options.some((opt) => opt.includes('Na')),
      hasDdimYnSiwr: options.some((opt) => opt.includes('Ddim yn siŵr')),
    };
  }
}
