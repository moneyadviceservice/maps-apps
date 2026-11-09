import { type Locator } from '@playwright/test';

import { BasePage } from './basePage';

export class MedicalSpecialismPage extends BasePage {
  private readonly coversAllConditionsYesLabel =
    'radio-specialised_medical_conditions_covers_all-yes';
  private readonly coversAllConditionsNoLabel =
    'radio-specialised_medical_conditions_covers_all-no';
  private readonly specialisedConditionsTitleTestId =
    'specialised_medical_conditions_cover-title';
  private readonly errorSummaryHeadingTestId = 'error-summary-heading';
  private readonly errorSummaryListElementTestId = 'list-element';

  coversAllConditionsYesRadio(): Locator {
    return this.page.locator(`label[for=${this.coversAllConditionsYesLabel}]`);
  }

  coversAllConditionsNoRadio(): Locator {
    return this.page.locator(`label[for=${this.coversAllConditionsNoLabel}]`);
  }

  specialisedConditionsTitle(): Locator {
    return this.page.getByTestId(this.specialisedConditionsTitleTestId);
  }

  errorSummary(): Locator {
    return this.page.getByTestId(this.errorSummaryHeadingTestId);
  }

  errorSummaryListElement(): Locator {
    return this.page
      .getByTestId(this.errorSummaryListElementTestId)
      .locator('li');
  }

  /**
   * Navigates to the Medical Specialism page for the E2E account.
   */
  async gotoMedicalSpecialism(): Promise<void> {
    const firmId = await this.resolveFirmId();
    await this.page.goto(`/account/trip-cover/medical-specialism/${firmId}`);
  }

  /**
   * Selects "Yes" on the covers any/most medical conditions radio option.
   */
  async checkCoversAllConditionsYes(): Promise<void> {
    await this.coversAllConditionsYesRadio().check({ force: true });
  }

  /**
   * Selects "No" on the covers any/most medical conditions radio option.
   */
  async checkCoversAllConditionsNo(): Promise<void> {
    await this.coversAllConditionsNoRadio().check({ force: true });
  }

  async getMedicalSpecialismOptions(): Promise<string[]> {
    const options = await this.page
      .locator('[data-testid="medical-specialism-radios"] label')
      .allTextContents();
    return options.map((option) => option.trim());
  }

  /**
   * Answers the Medical Specialism page with the default covers-all Yes.
   */
  async fillMedicalSpecialism(): Promise<void> {
    await this.checkCoversAllConditionsYes();
  }

  /**
   * Selects a specific medical condition radio button on the form based on its data-testid suffix.
   *
   * @param radioValue - The unique identifier/value matching the test ID suffix of the radio input (e.g., 'cancer', 'respiratory_problems').
   * @returns A promise that resolves when the radio input has been checked.
   */
  async checkMedicalConditions(radioValue: string): Promise<void> {
    await this.page
      .locator(`[data-testid="radio-input-${radioValue}"]`)
      .check({ force: true });
  }
}
