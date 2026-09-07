import {
  expect,
  type Locator,
  type Page,
  type Response,
} from '@playwright/test';

export type ErrorOption = {
  fieldName?: string;
  message: string;
  fieldLevelMessage?: string;
};

const FIRM_ID_AFTER_SECTION =
  /\/account\/trip-cover\/(?:regions|service-details|confirm)\/([^/]+)/;
const FIRM_ID_BEFORE_TRIP_REGION =
  /\/account\/trip-cover\/([^/]+)\/(?:uk_and_europe|worldwide_excluding_us_canada|worldwide_including_us_canada)(?:\/|$)/;
const FIRM_ID_FROM_COVER_HREF = /\/account\/trip-cover\/regions\/([^/?#]+)/;

export class BasePage {
  readonly page: Page;
  protected firmId?: string;

  // #region SELECTORS
  private readonly titleTestId = 'toolpage-span-title';
  private readonly acceptCookiesName = 'Accept all cookies';
  private readonly headerTestId = 'header';
  private readonly footerTestId = 'footer';
  private readonly backButtonTestId = 'tool-nav-prev';

  // #endregion

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS

  /**
   * Returns the locator for the cookie acceptance button.
   * @returns {Locator} The locator for the accept cookies button.
   */
  protected acceptCookiesButton(): Locator {
    return this.page.getByRole('button', { name: this.acceptCookiesName });
  }

  /**
   * Returns a locator for a heading element by its exact text content.
   * @param text - The exact text of the heading to find.
   * @returns {Locator} The locator for the heading.
   */
  headingLocator(text: string): Locator {
    return this.page.getByRole('heading', { name: text, exact: true });
  }

  /**
   * Returns the locator for the page title element based on its test ID.
   * @returns {Locator} The locator for the title.
   */
  protected titleLocator(): Locator {
    return this.page.getByTestId(this.titleTestId);
  }

  /**
   * Returns the locator for an input field by its name attribute.
   * @param name - The 'name' attribute value of the input.
   * @returns {Locator} The locator for the generic input.
   */
  protected genericInput(name: string): Locator {
    return this.page.locator(`input[name="${name}"]`);
  }

  /**
   * Returns the locator for a custom checkbox's associated label paragraph.
   * @param name - The 'name' attribute of the checkbox.
   * @returns {Locator} The locator for the custom checkbox element.
   */
  protected customCheckbox(name: string): Locator {
    return this.page.locator(`input[name="${name}"] + div`);
  }

  /**
   * Returns the locator for a radio button's label based on the 'for' attribute.
   * @param labelFor - The value of the 'for' attribute on the label.
   * @returns {Locator} The locator for the radio button label.
   */
  protected radioLabel(labelFor: string): Locator {
    return this.page.locator(`label[for="${labelFor}"]`);
  }

  header(): Locator {
    return this.page.getByTestId(this.headerTestId);
  }

  footer(): Locator {
    return this.page.getByTestId(this.footerTestId);
  }

  backButton(): Locator {
    return this.page.getByTestId(this.backButtonTestId);
  }

  // ACTIONS

  /**
   * Helper to verify navigation
   * @param {string|RegExp} url - The expected URL or pattern
   */
  async expectNavigationTo(url: string | RegExp, timeout = 20000) {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Attempts to accept cookies if the banner appears, otherwise logs and continues.
   * Useful for handling cookie banners that do not appear in every test run.
   */
  async acceptCookiesIfVisible(): Promise<void> {
    try {
      await this.acceptCookiesButton().click({ timeout: 5000 });
    } catch {
      console.log('Cookie banner not found, continuing...');
    }
  }

  /**
   * Asserts that a heading with the specific text is visible on the page.
   * @param expectedText - The expected text of the heading.
   */
  async assertHeading(expectedText: string): Promise<void> {
    await expect(this.headingLocator(expectedText)).toBeVisible();
  }

  /**
   * Asserts that the page title matches the expected text.
   * @param expectedText - The expected text of the title element.
   */
  async assertTitle(expectedText: string): Promise<void> {
    await expect(this.titleLocator()).toHaveText(expectedText);
  }

  /**
   * Checks for the presence of specific validation error messages in the error summary
   * and, optionally, at the individual field level.
   * @param options - An array of objects containing the error message and optional field name.
   * @returns {Promise<boolean>} True if all expected errors are present and visible.
   */
  async assertValidationErrors(options: ErrorOption[]): Promise<void> {
    const summaryContainer = this.page.getByTestId('error-summary-container');

    await expect(summaryContainer).toBeVisible({ timeout: 5000 });

    const summaryLinks = this.page.locator('[data-testid=error-records] li a');

    for (const option of options) {
      const summaryError = summaryLinks.filter({ hasText: option.message });
      await expect
        .soft(summaryError, `Summary error for "${option.message}" not found`)
        .toBeVisible();

      if (option.fieldName) {
        const fieldError = this.page.getByTestId(`${option.fieldName}-error`);
        const expectedText = option.fieldLevelMessage || option.message;

        await expect
          .soft(
            fieldError,
            `Field-level error for "${option.fieldName}" not found`,
          )
          .toContainText(expectedText);
      }
    }
  }

  /**
   * Fills a specific form input field by name.
   * @param name - The 'name' attribute of the input field.
   * @param value - The value to fill into the field.
   */
  async fillField(name: string, value: string): Promise<void> {
    await this.genericInput(name).fill(value);
  }

  /**
   * Clicks a custom checkbox component.
   * @param name - The 'name' attribute of the checkbox.
   */
  async clickCheckbox(name: string): Promise<void> {
    await this.customCheckbox(name).click();
  }

  /**
   * Selects a radio button by clicking its associated label.
   * @param labelFor - The 'for' attribute value of the label.
   */
  async selectRadio(labelFor: string): Promise<void> {
    await this.radioLabel(labelFor).click();
  }

  selectInput(): Locator {
    return this.page.locator('select');
  }

  /**
   * Returns the locator for the Back link.
   */
  protected backLink(): Locator {
    return this.page.getByRole('link', { name: 'Back', exact: true });
  }

  /**
   * Returns the locator for the Continue button.
   */
  protected continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue', exact: true });
  }

  protected saveChangesButton(): Locator {
    return this.page.getByRole('button', { name: 'Save changes', exact: true });
  }

  protected confirmButton(): Locator {
    return this.page.getByRole('button', { name: 'Confirm', exact: true });
  }

  protected submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit', exact: true });
  }

  /**
   * Clicks the Back link and waits for navigation.
   */
  async clickBack(): Promise<void> {
    await this.backLink().click();
  }

  /**
   * Clicks Continue and waits for the matching form POST to finish.
   */
  async clickContinueAndWaitForPostResponse(
    apiPath: string,
  ): Promise<Response> {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes(apiPath) &&
        response.request().method() === 'POST',
    );
    await this.continueButton().click();
    return responsePromise;
  }

  /**
   * Clicks Continue and waits for a form API save to finish, then for the next
   * page to be ready. Pass `ready` to wait for a DOM signal instead of URL
   * (SPA transitions do not fire a document `load` event).
   */
  async clickContinueAndWaitForApi(
    apiPath: string,
    ready?: Locator,
  ): Promise<void> {
    const response = await this.clickContinueAndWaitForPostResponse(apiPath);

    if (!response.ok()) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `POST ${apiPath} failed with ${response.status()}: ${body}`,
      );
    }

    if (ready) {
      await expect(ready).toBeVisible();
      return;
    }

    let nextPath: string | undefined;
    try {
      const body = (await response.json()) as { nextPath?: string };
      nextPath = body?.nextPath;
    } catch {
      // Non-JSON responses fall through to a lightweight DOM wait.
    }

    if (nextPath) {
      await this.page.waitForURL((url) => url.pathname.includes(nextPath));
      return;
    }

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks Continue without waiting for a full page load (SPA validation stays on-page).
   */
  async clickContinue(): Promise<void> {
    await this.continueButton().click();
  }

  async clickSaveChanges(): Promise<void> {
    await this.saveChangesButton().click();
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton().click();
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton().click();
  }

  /**
   * Clicks the Back button and waits for navigation.
   */
  async clickBackButton(): Promise<void> {
    await this.backButton().click();
  }

  protected async resolveFirmId(): Promise<string> {
    if (!this.firmId) {
      this.firmId = await this.lookupFirmId();
    }
    return this.firmId;
  }

  private firmIdFromPath(path: string): string | undefined {
    return (
      FIRM_ID_AFTER_SECTION.exec(path)?.[1] ??
      FIRM_ID_BEFORE_TRIP_REGION.exec(path)?.[1]
    );
  }

  private async lookupFirmId(): Promise<string> {
    const path = new URL(this.page.url()).pathname;
    const fromPath = this.firmIdFromPath(path);
    if (fromPath) {
      return fromPath;
    }

    if (!/\/account\/?$/.test(path)) {
      await this.page.goto('/account');
    }

    const href = await this.page
      .getByTestId('account-section-link-label')
      .first()
      .getAttribute('href');
    const firmId = href ? FIRM_ID_FROM_COVER_HREF.exec(href)?.[1] : undefined;

    if (!firmId) {
      throw new Error(
        `Could not resolve firm id. href=${
          href ?? '(missing)'
        }, url=${this.page.url()}`,
      );
    }

    return firmId;
  }
}
