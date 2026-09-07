import { expect, type Locator, type Page } from '@playwright/test';

import type { FormFieldData, ValidationErrorOption } from '../data/types';

export class ApplyToUsePage {
  readonly page: Page;
  readonly submitOrgButton: Locator;
  readonly submitUserButton: Locator;
  readonly confirmationCallout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitOrgButton = page.getByTestId('signupOrg');
    this.submitUserButton = page.getByTestId('signupUser');
    this.confirmationCallout = page.getByTestId('callout-information-blue');
  }

  /**
   * Selects a radio option via its associated label.
   *
   * @param inputId - Radio input `id` (e.g. `new`, `false`)
   */
  async selectRadioButton(inputId: string): Promise<void> {
    await this.page.locator(`label[for="${inputId}"]`).click();
  }

  /**
   * Asserts a page heading is visible.
   *
   * @param text - Partial heading text
   */
  async expectHeading(text: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: text })).toBeVisible();
  }

  /**
   * Fills a text input by `name`.
   *
   * @param name - Input name attribute
   * @param value - Value to enter
   */
  async fillInput(name: string, value: string): Promise<void> {
    await this.page.locator(`input[name="${name}"]`).fill(value);
  }

  /**
   * Verifies an input is programmatically linked to its hint text via aria-describedby.
   * @param labelText - The exact visible text of the input's label
   * @param expectedHintId - The ID of the element containing the hint text
   */
  async assertAriaDescribedBy(
    labelText: string,
    expectedHintId: string,
  ): Promise<void> {
    const input = this.page.getByLabel(labelText, { exact: true });

    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy?.split(/\s+/)).toContain(expectedHintId);

    const hintElement = this.page.locator(`#${expectedHintId}`);
    await expect(hintElement).toBeVisible();
  }

  /**
   * Selects an option from a named `<select>` element.
   *
   * @param name - Select name attribute
   * @param value - Option value
   */
  async selectOption(name: string, value: string): Promise<void> {
    await this.page.locator(`select[name="${name}"]`).selectOption(value);
  }

  /**
   * Toggles a checkbox by name and value.
   *
   * @param name - Checkbox group name
   * @param value - Checkbox value
   */
  async selectCheckbox(name: string, value: string): Promise<void> {
    const checkbox = this.page.locator(
      `input[name="${name}"][value="${value}"] + div`,
    );
    await checkbox.click({ position: { x: 5, y: 5 } });
  }

  /**
   * Toggles multiple checkboxes in the same group.
   *
   * @param name - Checkbox group name
   * @param values - Checkbox values to select
   */
  async selectMultipleCheckbox(name: string, values: string[]): Promise<void> {
    for (const value of values) {
      await this.selectCheckbox(name, value);
    }
  }

  /** Submits Part 1 (organisation registration). */
  async submitPart1(): Promise<void> {
    await this.submitOrgButton.click();
  }

  /** Fills Part 1 with valid new-organisation data. */
  async fillValidNewOrgPart1(): Promise<void> {
    await this.fillInput('organisationName', 'org-name');
    await this.fillInput(
      'organisationWebsite',
      'https://www.test-org-website.com',
    );
    await this.fillInput('organisationStreet', 'business park');
    await this.fillInput('organisationCity', 'city');
    await this.fillInput('organisationPostcode', 'PO1 1CD');
    await this.selectOption('organisationType', 'Software provider');
    await this.selectMultipleCheckbox('geoRegions', [
      'north-west',
      'south-west',
    ]);
    await this.selectOption('organisationUse', 'Provide debt advice');
    await this.selectMultipleCheckbox('debtAdvice', ['online', 'telephone']);
    await this.selectRadioButton('field-sfslive-false');
    await this.fillInput('sfsLaunchDate', '2027-01-04');
    await this.fillInput('caseManagementSoftware', 'Unknown');
    await this.selectRadioButton('field-fcaReg-fca-yes');
    await this.fillInput('fcaRegNumber', 'Unknown');
    await this.selectMultipleCheckbox('memberships', ['none']);
  }

  /** Submits Part 2 (user registration / OTP). */
  async submitPart2(): Promise<void> {
    await this.submitUserButton.click();
  }

  /**
   * Asserts validation errors appear in the summary and beside fields.
   *
   * @param options - Expected summary and field-level messages
   */
  async expectValidationErrors(
    options: ValidationErrorOption[],
  ): Promise<void> {
    const summary = this.page.getByTestId('error-summary-container');
    await expect(summary).toBeVisible();

    const errorRecords = this.page.locator('[data-testid=error-records] li a');
    for (const option of options) {
      await expect(
        errorRecords.filter({ hasText: option.message }).first(),
      ).toBeVisible();

      const fieldError: Locator = this.page
        .locator(`#${option.fieldName}-error`)
        .filter({ hasText: option.fieldLevelMessage });

      await fieldError.scrollIntoViewIfNeeded();
      await expect(fieldError).toBeVisible();
    }
  }

  /**
   * Asserts that focus is moved to the expected form field element when ErrorSummary item links are activated
   *
   * @param fieldsData: Expected IDs and selectors for form fields (NOTE: "fields" are not necessarily the inputs themselves, eg. may be a wrapping fieldset for a11y reasons)
   */
  async verifyErrorSummaryLinksFocusFields(
    fieldsData: FormFieldData[],
    isPart2?: boolean,
  ): Promise<void> {
    for (const field of fieldsData) {
      const errorSummaryLink = this.page.locator(
        `a[href="/en/apply-to-use-the-sfs${isPart2 ? '?user=true' : ''}#${
          field.id
        }"]`,
      );
      await expect(errorSummaryLink).toBeVisible();

      errorSummaryLink.click();

      const errorField = this.page
        .locator(`#${field.id}`)
        .and(this.page.locator(field.selector));
      await expect(errorField).toBeFocused();
    }
  }

  /** Waits for the application success callout to be visible. */
  async expectConfirmationVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Thank you for your application',
      }),
    ).toBeVisible();
    await expect(this.confirmationCallout).toBeVisible();
  }
}
