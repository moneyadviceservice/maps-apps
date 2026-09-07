import { expect, Locator, Page } from '@playwright/test';

import {
  AGE_ABOVE_MAXIMUM,
  AGE_BELOW_MINIMUM,
  AGE_ERROR_ID,
  ARIA_DESCRIBEDBY,
  BASE_PATH,
  POT_ABOVE_MAXIMUM,
  POT_ERROR_ID,
  VALID_AGE,
  VALID_POT,
} from '../data/adjustableIncome';

export class AdjustableIncomePage {
  constructor(private readonly page: Page) {}

  potInput(): Locator {
    return this.page.locator('#pot');
  }

  ageInput(): Locator {
    return this.page.locator('#age');
  }

  potError(): Locator {
    return this.page.locator(`#${POT_ERROR_ID}`);
  }

  ageError(): Locator {
    return this.page.locator(`#${AGE_ERROR_ID}`);
  }

  potLabel(): Locator {
    return this.page.locator('label[for=pot]');
  }

  ageLabel(): Locator {
    return this.page.locator('label[for=age]');
  }

  resultsSection(): Locator {
    return this.page.locator('#results');
  }

  locatorById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  async goto(): Promise<void> {
    await this.page.goto(BASE_PATH);
  }

  async gotoWithPotRequiredError(): Promise<void> {
    await this.page.goto(`${BASE_PATH}?pot=&age=${VALID_AGE}#results`);
  }

  async gotoWithPotMaxError(): Promise<void> {
    await this.page.goto(
      `${BASE_PATH}?pot=${POT_ABOVE_MAXIMUM}&age=${VALID_AGE}#results`,
    );
  }

  async gotoWithAgeMinError(): Promise<void> {
    await this.page.goto(
      `${BASE_PATH}?pot=${VALID_POT}&age=${AGE_BELOW_MINIMUM}#results`,
    );
  }

  async gotoWithAgeMaxError(): Promise<void> {
    await this.page.goto(
      `${BASE_PATH}?pot=${VALID_POT}&age=${AGE_ABOVE_MAXIMUM}#results`,
    );
  }

  async gotoWithBothErrors(): Promise<void> {
    await this.page.goto(`${BASE_PATH}?pot=&age=#results`);
  }

  /**
   * Navigates to the page with valid inputs and waits for the results section
   * to be visible, ensuring the page is fully in the valid (error-free) state
   * before any assertions run.
   */
  async gotoWithValidInputs(): Promise<void> {
    await this.page.goto(
      `${BASE_PATH}?pot=${VALID_POT}&age=${VALID_AGE}#results`,
    );
    await expect(this.resultsSection()).toBeVisible();
  }

  async assertReferencedErrorExistsAndIsNonEmpty(
    input: Locator,
  ): Promise<void> {
    const describedBy = await input.getAttribute(ARIA_DESCRIBEDBY);
    expect(describedBy).not.toBeNull();
    const errorElement = this.page.locator(`#${describedBy}`);
    await expect(errorElement).toBeAttached();
    const text = await errorElement.textContent();
    expect(text?.trim()).not.toBe('');
  }
}
