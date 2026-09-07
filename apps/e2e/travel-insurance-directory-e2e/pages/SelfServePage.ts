import { expect, type Locator, type Page } from '@playwright/test';

import { AccountDashboardPage } from './AccountDashboardPage';

export class SelfServePage extends AccountDashboardPage {
  //SELECTORS
  //login
  private readonly emailFieldTestId = 'email';
  private readonly loginButtonTestId = 'account-login-submit';
  private readonly otpFieldTestId = 'otp';
  private readonly headerEndSlotTestId = 'header-end-slot';
  private readonly signOutLinkTestId = 'account-header-sign-out';
  private readonly errorSummaryHeadingTestId = 'error-summary-heading';
  private readonly errorSummaryLinkTestId = 'error-link-0';
  private readonly inlineEmailErrorTestId = 'email-error';
  private readonly inlineOtpErrorTestId = 'otp-error';

  //account details
  private readonly registeredNameRowTestId = 'registered-name-row';
  private readonly registeredNameValueTestId = 'registered-name-value';

  private readonly frnRowTestId = 'frn-row';
  private readonly frnValueTestId = 'frn-value';

  private readonly accountStatusRowTestId = 'account-directory-status-row';
  private readonly accountStatusValueTestId = 'account-directory-status-value';

  private readonly accountSectionLinkLabelTestId = 'account-section-link-label';
  private readonly accountSectionLinkRowTestId = 'account-section-link-row';
  private readonly accountSectionLinkValueTestId = 'account-section-link-value';

  private readonly availableTradingNameSearchTestId =
    'available-trading-names-search';
  private readonly tradingNameNoResultsTestId = 'no-results';
  private readonly tradingNameRowTestId = 'available-trading-name-row';
  private readonly tradingNameLabelTestId = 'available-trading-name-label';
  private readonly tradingNameAddToDirectoryTestId = 'add-to-directory-button';
  private readonly removeTradingNameButtonTestId = 'remove-trading-name-button';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  emailField(): Locator {
    return this.page.getByTestId(this.emailFieldTestId);
  }

  loginButton(): Locator {
    return this.page.getByTestId(this.loginButtonTestId);
  }

  otpField(): Locator {
    return this.page.getByTestId(this.otpFieldTestId);
  }

  signOutLink(): Locator {
    return this.page
      .getByTestId(this.headerEndSlotTestId)
      .getByTestId(this.signOutLinkTestId);
  }

  errorSummaryHeading(): Locator {
    return this.page.getByTestId(this.errorSummaryHeadingTestId);
  }

  errorSummaryLink(): Locator {
    return this.page.getByTestId(this.errorSummaryLinkTestId);
  }

  inlineEmailError(): Locator {
    return this.page.getByTestId(this.inlineEmailErrorTestId);
  }

  inlineOtpError(): Locator {
    return this.page.getByTestId(this.inlineOtpErrorTestId);
  }

  registeredNameValue(name: string): Locator {
    return this.page
      .getByTestId(this.registeredNameRowTestId)
      .getByTestId(this.registeredNameValueTestId)
      .filter({ hasText: name });
  }

  reregistrationHeading(): Locator {
    return this.page.getByRole('heading', {
      name: 'You need to reregister your firm',
    });
  }

  reregistrationGetStartedLink(): Locator {
    return this.page.getByRole('link', { name: 'Get started', exact: true });
  }

  reregistrationResumeLink(): Locator {
    return this.page.getByRole('link', {
      name: 'Resume your reregistration',
      exact: true,
    });
  }

  reregistrationExpiryText(): Locator {
    return this.page.getByText(/Your firm's registration expires on/);
  }

  registeredNameRow(name: string): Locator {
    return this.page
      .getByTestId(this.registeredNameRowTestId)
      .filter({ hasText: name });
  }

  frnValue(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.frnRowTestId)
      .getByTestId(this.frnValueTestId);
  }

  accountStatusValue(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.accountStatusRowTestId)
      .getByTestId(this.accountStatusValueTestId);
  }

  coverAndServiceLink(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.accountSectionLinkRowTestId)
      .first()
      .getByTestId(this.accountSectionLinkLabelTestId);
  }

  customerContactDetailsLink(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.accountSectionLinkRowTestId)
      .nth(1)
      .getByTestId(this.accountSectionLinkLabelTestId);
  }

  coverAndServiceLinkValue(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.accountSectionLinkRowTestId)
      .first()
      .getByTestId(this.accountSectionLinkValueTestId);
  }

  customerContactDetailsLinkValue(): Locator {
    return this.mainAuthorisedFirmSection()
      .getByTestId(this.accountSectionLinkRowTestId)
      .nth(1)
      .getByTestId(this.accountSectionLinkValueTestId);
  }

  async assertCoverAndServiceCompleted(): Promise<void> {
    await expect(this.coverAndServiceLinkValue()).toHaveText('completed');
  }

  async assertCustomerContactDetailsCompleted(): Promise<void> {
    await expect(this.customerContactDetailsLinkValue()).toHaveText(
      'completed',
    );
  }

  availableTradingNameRow(): Locator {
    return this.page.getByTestId(this.tradingNameRowTestId);
  }

  availableTradingNameLabel(tradingName: string): Locator {
    return this.page
      .getByTestId(this.tradingNameRowTestId)
      .filter({ hasText: tradingName })
      .getByTestId(this.tradingNameLabelTestId);
  }

  availableTradingNameSearchField(): Locator {
    return this.page.getByTestId(this.availableTradingNameSearchTestId);
  }

  addTradingNameButton(tradingName: string): Locator {
    return this.availableTradingNameRow()
      .filter({ hasText: tradingName })
      .getByTestId(this.tradingNameAddToDirectoryTestId);
  }

  removeTradingNameButton(tradingName: string): Locator {
    return this.registeredNameRow(tradingName).getByTestId(
      this.removeTradingNameButtonTestId,
    );
  }

  tradingNameStatusValue(tradingName: string): Locator {
    return this.registeredNameRow(tradingName)
      .locator('+ [data-testid="account-directory-status-row"]')
      .getByTestId(this.accountStatusValueTestId);
  }

  tradingNameCoverAndServiceLink(tradingName: string): Locator {
    return this.registeredNameRow(tradingName)
      .locator(
        '+ [data-testid="account-directory-status-row"] + [data-testid="account-section-link-row"]',
      )
      .getByTestId(this.accountSectionLinkLabelTestId);
  }

  tradingNameCustomerContactDetailsLink(tradingName: string): Locator {
    return this.registeredNameRow(tradingName)
      .locator(
        '+ [data-testid="account-directory-status-row"] + [data-testid="account-section-link-row"] + [data-testid="account-section-link-row"]',
      )
      .getByTestId(this.accountSectionLinkLabelTestId);
  }

  noResultsText(): Locator {
    return this.page.getByTestId(this.tradingNameNoResultsTestId);
  }

  //ACTIONS

  /**
   * Navigates the browser to the account login page.
   * @returns A promise that resolves when navigation is complete.
   */
  async goto(): Promise<void> {
    await this.page.goto('/account/login');
  }

  /**
   * Resets test data and redirects to the account page '/account'
   * (redirect is controlled within the app).
   * User MUST be logged in with a valid session or it will redirect
   * them to the login screen without resetting any data.
   * @returns A promise that resolves when navigation is complete.
   */
  async resetTestDataAndReturnToAccountPage(
    state = 'setEmptySelfServeState',
  ): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/account\/?$/),
      this.page.goto(
        `/ci/self-serve/initialise-e2e-firm-state?accountMock=${state}`,
        {
          waitUntil: 'commit',
        },
      ),
    ]);
    await this.assertHeading('Main authorised firm');
  }

  async clickReregistrationGetStarted(): Promise<void> {
    await this.reregistrationGetStartedLink().click();
  }

  async clickReregistrationResume(): Promise<void> {
    await this.reregistrationResumeLink().click();
  }

  /**
   * Fills the email input field with the provided email address.
   * @param email - The email address to enter into the field.
   * @returns A promise that resolves once the field is filled.
   */
  async fillEmailField(email: string): Promise<void> {
    await this.emailField().fill(email);
  }

  /**
   * Clicks the login submit button.
   * @returns A promise that resolves after the click action is executed.
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton().click();
  }

  /**
   * Fills the One-Time Password (OTP) input field.
   * @param otp - The one-time password code to enter.
   * @returns A promise that resolves once the field is filled.
   */
  async fillOtpField(otp: string): Promise<void> {
    await this.otpField().fill(otp);
  }

  /**
   * Clicks the sign-out link to log the user out of their session.
   * @returns A promise that resolves after the click action is executed.
   */
  async clickSignOutLink(): Promise<void> {
    await this.signOutLink().click();
  }

  /**
   * Fills in the search field to filter the list of available trading names.
   * * @param {string} tradingName - The name of the trading entity to search for.
   * @returns {Promise<void>} Resolves when the text has been successfully filled.
   */
  async fillAvailableTradingNameSearchField(
    tradingName: string,
  ): Promise<void> {
    await this.availableTradingNameSearchField().fill(tradingName);
  }

  async clickCoverAndServiceLink(): Promise<void> {
    await this.coverAndServiceLink().click();
  }

  async clickCustomerContactDetailsLink(): Promise<void> {
    await this.customerContactDetailsLink().click();
  }

  /**
   * Clicks the "Add to directory" button for a specific trading name within the table.
   * * @param {string} tradingName - The specific trading name row to target.
   * @returns {Promise<void>} Resolves once the click action is completed.
   */
  async clickAddToDirectoryButton(tradingName: string): Promise<void> {
    await this.addTradingNameButton(tradingName).click();
  }

  /**
   * Clicks the "Remove" button for a specific trading name to remove it from the directory.
   * * @param {string} tradingName - The specific trading name row to target for removal.
   * @returns {Promise<void>} Resolves once the click action is completed.
   */
  async clickRemoveTradingNameButton(tradingName: string): Promise<void> {
    await this.removeTradingNameButton(tradingName).click();
  }

  /**
   * Retrieves the text content of all visible trading name labels in the table.
   * * @note This method does not automatically wait for elements to load. Ensure
   * the table or rows are visible before calling this to avoid receiving an empty array.
   * * @returns {Promise<string[]>} A promise that resolves to an array of trading name strings.
   */
  async getAvailableTradingNames(): Promise<string[]> {
    return await this.page
      .getByTestId(this.tradingNameLabelTestId)
      .allTextContents();
  }
}
