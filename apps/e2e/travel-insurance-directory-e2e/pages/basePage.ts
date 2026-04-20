import { expect, type Locator, type Page } from '@playwright/test';

export type ErrorOption = {
  fieldName?: string;
  message: string;
  fieldLevelMessage?: string;
};

export class BasePage {
  readonly page: Page;

  // #region SELECTORS
  private readonly titleTestId = 'toolpage-span-title';
  private readonly acceptCookiesName = 'Accept all cookies';

  // #endregion

  constructor(page: Page) {
    this.page = page;
  }

  //LOCATORS

  protected acceptCookiesButton(): Locator {
    return this.page.getByRole('button', { name: this.acceptCookiesName });
  }

  protected headingLocator(text: string): Locator {
    return this.page.getByRole('heading', { name: text, exact: true });
  }

  protected titleLocator(): Locator {
    return this.page.getByTestId(this.titleTestId);
  }

  protected genericInput(name: string): Locator {
    return this.page.locator(`input[name="${name}"]`);
  }

  protected customCheckbox(name: string): Locator {
    return this.page.locator(`input[name="${name}"] ~ p`);
  }

  protected radioLabel(labelFor: string): Locator {
    return this.page.locator(`label[for="${labelFor}"]`);
  }

  //ACTIONS

  async assertURL(expectedURL: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async acceptCookiesIfVisible(): Promise<void> {
    try {
      await this.acceptCookiesButton().click({ timeout: 5000 });
    } catch {
      console.log('Cookie banner not found, continuing...');
    }
  }

  async assertHeading(expectedText: string): Promise<void> {
    await expect(this.headingLocator(expectedText)).toBeVisible();
  }

  async assertTitle(expectedText: string): Promise<void> {
    await expect(this.titleLocator()).toHaveText(expectedText);
  }

  async checkValidationErrors(options: ErrorOption[]): Promise<boolean> {
    const container: Locator = this.page.getByTestId('error-summary-container');
    await container.waitFor();

    let isValid = true;
    const errorRecords = this.page.locator('[data-testid=error-records] li a');

    for (const option of options) {
      const matchingErrors = errorRecords
        .filter({ hasText: option.message })
        .first();

      await matchingErrors.waitFor();
      isValid = isValid && (await matchingErrors.isVisible());

      if (option.fieldName) {
        const fieldError = this.page
          .getByTestId(`${option.fieldName}-error`)
          .filter({ hasText: option.fieldLevelMessage || option.message });

        await fieldError.waitFor();
        isValid = isValid && (await fieldError.isVisible());
      }
    }
    return isValid;
  }

  async fillField(name: string, value: string): Promise<void> {
    await this.genericInput(name).fill(value);
  }

  async clickCheckbox(name: string): Promise<void> {
    await this.customCheckbox(name).click({ position: { x: 5, y: 5 } });
  }

  async selectRadio(labelFor: string): Promise<void> {
    await this.radioLabel(labelFor).click();
  }
}
