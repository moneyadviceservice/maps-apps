import { type Locator } from '@playwright/test';

import { BasePage } from './basePage';

export class ServiceDetailsPage extends BasePage {
  //selectors
  private readonly telQuoteServiceYesLabel = 'radio-offers_telephone_quote-yes';
  private readonly telQuoteServiceNoLabel = 'radio-offers_telephone_quote-no';
  private readonly specialistMedicalEquipmentYesLabel =
    'radio-will_cover_specialist_equipment-yes';
  private readonly medicalScreeningProviderSelectTestId =
    'select-input-medical_screening_company';
  private readonly howFarInAdvanceSelectTestId =
    'select-input-how_far_in_advance_trip_cover';

  private readonly errorSummaryHeadingTestId = 'error-summary-heading';
  private readonly errorSummaryListElementTestId = 'list-element';

  //locators

  telQuoteServiceYesRadio(): Locator {
    return this.page.locator(`label[for=${this.telQuoteServiceYesLabel}]`);
  }

  telQuoteServiceNoRadio(): Locator {
    return this.page.locator(`label[for=${this.telQuoteServiceNoLabel}]`);
  }

  specialistMedicalEquipmentYesRadio(): Locator {
    return this.page.locator(
      `label[for=${this.specialistMedicalEquipmentYesLabel}]`,
    );
  }

  medicalScreeningProviderSelect(): Locator {
    return this.page.getByTestId(this.medicalScreeningProviderSelectTestId);
  }

  howFarInAdvanceSelect(): Locator {
    return this.page.getByTestId(this.howFarInAdvanceSelectTestId);
  }

  errorSummary(): Locator {
    return this.page.getByTestId(this.errorSummaryHeadingTestId);
  }

  errorSummaryListElement(): Locator {
    return this.page
      .getByTestId(this.errorSummaryListElementTestId)
      .locator('li');
  }

  //actions

  /**
   * Navigates to the Service Details page for the E2E account.
   * @returns A promise that resolves when navigation is complete.
   */
  async gotoServiceDetails(): Promise<void> {
    const firmId = await this.resolveFirmId();
    await this.page.goto(`/account/trip-cover/service-details/${firmId}`);
  }

  /**
   * Selects "Yes" on the Telephone Quote Service radio button option.
   * @returns A promise that resolves when the radio button is selected.
   */
  async checkTelQuoteServiceYes(): Promise<void> {
    await this.telQuoteServiceYesRadio().check({ force: true });
  }

  /**
   * Selects "No" on the Telephone Quote Service radio button option.
   * @returns A promise that resolves when the radio button is selected.
   */
  async checkTelQuoteServiceNo(): Promise<void> {
    await this.telQuoteServiceNoRadio().check({ force: true });
  }

  /**
   * Selects "Yes" on the Specialist Medical Equipment cover radio button option.
   * @returns A promise that resolves when the radio button is selected.
   */
  async checkSpecialistMedicalEquipmentYes(): Promise<void> {
    await this.specialistMedicalEquipmentYesRadio().check({ force: true });
  }

  /**
   * Selects a specific medical screening provider from the dropdown menu.
   * @param value - The provider name value (e.g., 'verisk').
   * @returns A promise that resolves when the option is selected.
   */
  async medicalScreeningProvider(value: string): Promise<void> {
    await this.medicalScreeningProviderSelect().selectOption(value);
  }

  /**
   * Sets how far in advance cover can be purchased via the dropdown menu.
   * @param value - The advance duration option value (e.g., 'up-to-18-months').
   * @returns A promise that resolves when the option is selected.
   */
  async howFarInAdvance(value: string): Promise<void> {
    await this.howFarInAdvanceSelect().selectOption(value);
  }

  /**
   * Populates the entire service details form section using standard default values.
   * @returns A promise that resolves when all service details fields are completed.
   */
  async fillServiceDetails(): Promise<void> {
    await this.checkTelQuoteServiceYes();
    await this.checkSpecialistMedicalEquipmentYes();
    await this.medicalScreeningProvider('verisk');
    await this.howFarInAdvance('up-to-18-months');
  }
}
