import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';
export class RegistrationPage extends BasePage {
  //#region SELECTORS
  private readonly startButtonName = 'Start';
  private readonly continueButtonTestId = 'submit-button';
  private readonly confirmButtonName = 'Confirm';
  private readonly signupUserButtonTestId = 'signupUser';
  private readonly radioButtonTestId = 'radio-button-label';
  private readonly fcaNumberName = 'FCA Firm Reference Number (FRN)';
  private readonly fcaNumberErrorTestId = 'fcaNumber-error';
  private readonly introParagraphTestId = 'paragraph';
  private readonly otpHeadingTestId = 'otp-heading';
  private readonly otpTestId = 'otp';
  private readonly otpErrorTestId = 'otp-errors';
  private readonly saveButtonTestId = 'save-button';
  private readonly saveAndSendButtonTestId = 'save-and-send-button';
  private readonly resendButtonTestId = 'resend-button';

  //#endregion

  constructor(page: Page) {
    super(page);
  }

  //#region LOCATORS

  private startButton(): Locator {
    return this.page.getByRole('button', { name: this.startButtonName });
  }

  protected continueButton(): Locator {
    return this.page.getByTestId(this.continueButtonTestId);
  }

  private nextButton(): Locator {
    return this.signUpUserButton();
  }

  private confirmButton(): Locator {
    return this.page.getByRole('button', { name: this.confirmButtonName });
  }

  private signUpUserButton(): Locator {
    return this.page.getByTestId(this.signupUserButtonTestId);
  }

  private yesRadioButton(): Locator {
    return this.page
      .getByTestId(this.radioButtonTestId)
      .filter({ hasText: 'Yes' });
  }

  private noRadioButton(): Locator {
    return this.page
      .getByTestId(this.radioButtonTestId)
      .filter({ hasText: 'No' });
  }

  private fcaNumberField(): Locator {
    return this.page.getByRole('textbox', { name: this.fcaNumberName });
  }

  private fcaNumberError(): Locator {
    return this.page.getByTestId(this.fcaNumberErrorTestId);
  }

  private otpField(): Locator {
    return this.page.getByTestId(this.otpTestId);
  }

  private otpError(): Locator {
    return this.page.getByTestId(this.otpErrorTestId);
  }

  private saveButton(): Locator {
    return this.page.getByTestId(this.saveButtonTestId);
  }

  private saveAndSendButton(): Locator {
    return this.page.getByTestId(this.saveAndSendButtonTestId);
  }

  private resendButton(): Locator {
    return this.page.getByTestId(this.resendButtonTestId);
  }

  //#endregion

  //#region ACTIONS

  /**
   * Navigates directly to a sub-route under the registration path.
   * @param {string} [url=''] - The target sub-route relative path (e.g., 'firm/step1').
   * @returns {Promise<void>} Resolves when the initial page navigation has completed.
   */
  async goto(url = ''): Promise<void> {
    await this.page.goto(`/register/${url}`);
  }

  /**
   * Clicks the initial 'Start' registration button.
   * @returns {Promise<void>}
   */
  async clickStartButton(): Promise<void> {
    await this.startButton().click();
  }

  /**
   * Clicks the primary application form 'Continue' submission button.
   * @returns {Promise<void>}
   */
  async clickContinueButton(): Promise<void> {
    await this.continueButton().click();
  }

  /**
   * Clicks the 'Next' step button.
   * @returns {Promise<void>}
   */
  async clickNextButton(): Promise<void> {
    await this.nextButton().click();
  }
  /**
   * Clicks the 'Sign up user' button that has 'Next' or 'Confirm' text.
   * @returns {Promise<void>}
   */
  async clickSignUpUserButton(): Promise<void> {
    await this.signUpUserButton().click();
  }

  /**
   * Clicks the final application summary 'Confirm' button.
   * @returns {Promise<void>}
   */
  async clickConfirmButton(): Promise<void> {
    await this.confirmButton().click();
  }

  /**
   * Selects the universal 'Yes' radio option context.
   * @returns {Promise<void>}
   */
  async clickYesRadioButton(): Promise<void> {
    await this.yesRadioButton().click();
  }

  /**
   * Selects the universal 'No' radio option context.
   * @returns {Promise<void>}
   */
  async clickNoRadioButton(): Promise<void> {
    await this.noRadioButton().click();
  }

  //#region MEDICAL RISK ASSESSMENT QUESTIONS

  /**
   * Selects the medical assessment model matching 'bespoke consultation'.
   * @returns {Promise<void>}
   */
  async clickBespokeRadioButton(): Promise<void> {
    await this.page
      .getByTestId(this.radioButtonTestId)
      .filter({ hasText: /bespoke consultation/ })
      .click();
  }

  /**
   * Selects the medical assessment model matching the firm's own proprietary screening option.
   * @returns {Promise<void>}
   */
  async clickScreeningQuestionnaireRadioButton(): Promise<void> {
    await this.page
      .getByTestId(this.radioButtonTestId)
      .filter({
        hasText: /your firm's own proprietary medical screening questionnaire/,
      })
      .click();
  }

  /**
   * Selects the medical assessment model matching a non-proprietary structure.
   * @returns {Promise<void>}
   */
  async clickNonProprietaryRadioButton(): Promise<void> {
    await this.page
      .getByTestId(this.radioButtonTestId)
      .filter({ hasText: /not proprietary/ })
      .click();
  }

  /**
   * Selects the fallback 'None of the above' option within the medical module workspace.
   * @returns {Promise<void>}
   */
  async clickNoneRadioButton(): Promise<void> {
    await this.page
      .getByTestId(this.radioButtonTestId)
      .filter({ hasText: /None of the above/ })
      .click();
  }
  //#endregion

  /**
   * Fills out the financial reference input field.
   * @param {string} text - The standard Financial Conduct Authority (FCA) Firm Reference Number.
   * @returns {Promise<void>}
   */
  async fillFcaField(text: string): Promise<void> {
    await this.fcaNumberField().fill(text);
  }

  /**
   * Seeds full mocked identity fields, processes user flow activation,
   * and blocks execution until a temporary security passcode input is populated.
   * @returns {Promise<void>}
   */
  async fillUserDetails(): Promise<void> {
    await this.fillField('givenName', 'Reshma');
    await this.fillField('surname', 'Kommineni');
    await this.fillField('individualReferenceNumber', 'REF00001');
    await this.fillField('jobTitle', 'Tester');
    await this.fillField('phone', '+441234567890');
    await this.fillField('mail', 'non-existing@mail.com');
    await this.clickCheckbox('confirmation');
    await this.clickSignUpUserButton();
    await expect(this.page.getByTestId(this.otpHeadingTestId)).toBeVisible();
    await this.fillField('otp', '12345678');
  }

  /**
   * Submits the OTP, waits for firm creation in session (`db_id`), and lands on
   * the first firm registration step. Required before firm/scenario pages now
   * that registration GSSP guards deep-links without a firm id.
   * @returns {Promise<void>}
   */
  async completeUserRegistration(): Promise<void> {
    await this.clickSignUpUserButton();
    await this.expectNavigationTo('/register/firm/step1');
    await this.assertHeading('Are your customers covered?');
  }

  /**
   * Directly inputs an activation or security text string to the OTP form box.
   * @param {string} text - The alpha-numeric authorization code string.
   * @returns {Promise<void>}
   */
  async fillOtp(text: string): Promise<void> {
    await this.otpField().fill(text);
  }

  /**
   * Saves progress and triggers an action to return to the dashboard or step landing hub.
   * @returns {Promise<void>}
   */
  async clickSaveAndComeBackButton(): Promise<void> {
    await this.saveButton().click();
  }

  //ANSWERS

  /**
   * Executes a sequential programmatic run answering the primary baseline firm qualification gate checks.
   * @returns {Promise<void>}
   */
  async answerPreMedicalQuestions(): Promise<void> {
    await this.expectNavigationTo('/register/firm/step1');
    await this.assertHeading('Are your customers covered?');
    await this.clickYesRadioButton();
    await this.clickContinueButton();
    await this.clickBespokeRadioButton();
    await this.clickContinueButton();
    await this.clickYesRadioButton();
    await this.clickContinueButton();
  }

  /**
   * Asserts failure feedback, processes dynamic radio selection for a structured medical risk layout case,
   * and manages contextual wizard routing tracking to step views or a summary dashboard.
   * @param {any} scenario - Context configuration containing target string text for UI errors and targets.
   * @param {number} index - Active step item sequence indicator.
   * @param {boolean} isLast - Specifies whether this task node concludes the dynamic wizard segment context.
   * @returns {Promise<void>}
   */
  async completeMedicalScenario(scenario: any, index: number, isLast: boolean) {
    await this.clickContinueButton();
    await this.assertValidationErrors([
      {
        message: scenario.errorMessage,
        fieldLevelMessage: scenario.fieldErrorMessage,
        fieldName: scenario.fieldName,
      },
    ]);

    await this.selectRadio(
      `radio-${scenario.fieldName}-${scenario.radioSelection}`,
    );
    await this.clickContinueButton();

    const nextUrl = isLast
      ? '/register/confirm-details'
      : `/register/scenario/step${index + 2}`;
    await this.page.waitForURL(nextUrl, { timeout: 5000 });
  }

  //#endregion

  //#region ASSERTIONS

  /**
   * Verifies that the introductory headers and structural instructional context text
   * blocks are displayed properly on the onboarding layout view.
   * @returns {Promise<void>}
   */
  async verifyIntroContent() {
    await expect(
      this.page.getByTestId(this.introParagraphTestId).first(),
    ).toHaveText(/You have confirmed/);
    await expect(
      this.page.getByTestId(this.introParagraphTestId).last(),
    ).toHaveText(/Please select 'yes' or 'no'/);
  }

  /**
   * Validates that the UI handles formatting errors gracefully by displaying an
   * invalid format message on the FCA Firm Reference Number field.
   * @returns {Promise<void>}
   */
  async verifyFcaNumberInvalid() {
    await expect(this.fcaNumberError()).toHaveText(
      'The FCA Firm Reference Number (FRN) provided is invalid.',
    );
  }

  /**
   * Validates that the UI handles missing directory items by displaying a
   * record-not-found error message on the FCA Reference Number element.
   * @returns {Promise<void>}
   */
  async verifyFcaNumberNotFound() {
    await expect(this.fcaNumberError()).toHaveText(
      'No records found for the provided FCA Firm Reference Number (FRN).',
    );
  }

  /**
   * Asserts that a safety warning message appears indicating that an invalid
   * or expired one-time passcode (OTP) string was input.
   * @returns {Promise<void>}
   */
  async verifyOtpInvalid() {
    await expect(this.otpError()).toContainText(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
  }

  /**
   * Sets up an async network interceptor, triggers the save action, captures the background
   * transaction, and ensures it issues the expected HTTP status redirection sequence.
   * @returns {Promise<import('@playwright/test').Response>} The intercepted backend network response object.
   */
  async clickSaveAndSendButton() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/register/save-progress') &&
        response.status() === 303,
    );

    await this.saveAndSendButton().click();
    const response = await responsePromise;
    return response;
  }

  /**
   * Sets up an async network interceptor, triggers the save action, captures the background
   * transaction, and ensures it issues the expected HTTP status redirection sequence.
   * Clicks the 'Send again' button
   */
  async clickSendAgainButton() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/register/save-progress') &&
        response.status() === 303,
    );

    await this.resendButton().click();
    const response = await responsePromise;
    return response;
  }

  /**
   * Submits the registration form by clicking the continue button
   * and waiting for the specific confirmation API response.
   * * @async
   * @method submitForm
   * @returns {Promise<import('@playwright/test').Response>} A promise that resolves to the HTTP response object from the confirmation API.
   */
  async submitForm() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/register/confirm') &&
        response.status() === 303,
    );

    await this.clickContinueButton();
    const response = await responsePromise;
    return response;
  }
  //#endregion
}
