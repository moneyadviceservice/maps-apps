import { type Locator, type Page } from '@playwright/test';
export class BasePage {
  readonly page: Page;
  protected firmId?: string;

  // #region SELECTORS
  private readonly acceptCookiesName = 'Accept all cookies';

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

  backButton(): Locator {
    return this.page.getByTestId('tool-nav-prev');
  }

  continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  // ACTIONS

  async getSessionID(): Promise<string> {
    await this.page.goto('/en/about-you');

    const currentUrl = new URL(this.page.url());
    const sessionId = currentUrl.searchParams.get('sessionId');
    if (!sessionId) {
      throw new Error('Failed to capture a valid sessionId from the URL.');
    }
    return sessionId;
  }

  /**
   * Submits page data to the specified API endpoint with customizable query parameters.
   *
   * @param page - The name of the target page/endpoint (e.g., 'your-income', 'pensions').
   * @param pageData - An object containing the payload data to send for the page.
   * @param existingSessionId - Optional existing session ID; if omitted, a new one will be fetched.
   * @param queryParams - Optional query parameters to include in the request URL (defaults to `{ action: 'continue' }`).
   * @returns A promise that resolves to the active session ID.
   * @throws Throws an error if the HTTP response is not successful.
   */
  async postPageData(
    page: string,
    pageData: Record<string, any>,
    existingSessionId?: string,
    queryParams: Record<string, string> = {},
  ): Promise<string> {
    const sessionId = existingSessionId || (await this.getSessionID());

    const finalQueryParams = { action: 'continue', ...queryParams };
    const queryString = new URLSearchParams(finalQueryParams).toString();
    const queryPart = queryString ? `?${queryString}` : '';
    const url = `/api/${page}${queryPart}`;

    const response = await this.page.request.post(url, {
      data: {
        language: 'en',
        sessionId: sessionId,
        ...pageData,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to submit page data for ${page}: ${await response.text()}`,
      );
    }

    return sessionId;
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
   * Clicks the back button to navigate to the previous page or step.
   * @returns {Promise<void>} A promise that resolves when the click action is complete.
   */
  async clickBackButton(): Promise<void> {
    await this.backButton().click();
  }

  /**
   * Clicks the continue button to proceed to the next page or step.
   * @returns {Promise<void>} A promise that resolves when the click action is complete.
   */
  async clickContinueButton(): Promise<void> {
    await this.continueButton().click();
  }
}
