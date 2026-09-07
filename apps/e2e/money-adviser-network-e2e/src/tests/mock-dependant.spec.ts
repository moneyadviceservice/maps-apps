/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
import { errorMessages, pageLoads, toolCompletion } from '@data/analytics.json';
import { expect, test } from '@lib/test.lib';
import { isInOfficeHours } from '@utils/dates.util';

const user = {
  firstName: 'John',
  lastName: 'Doe',
  telephone: '07961555555',
  postcode: 'dd21qq',
  securityQuestion: {
    option: 'city',
    text: 'In what city were you born?',
  },
  securityAnswer: 'London',
};

/**
 * These tests depend on the MockApiServer.
 *
 * If they run in parallel, the mock server may not be in an expected state, causing failures.
 * These tests will run sequentially to avoid that, the down side is that it's messier to organise.
 *
 * If you test dependends on booking slots or booking an appointment of any kind, put them in here.
 */
test.describe.serial('Debt Advice Referral', { tag: ['@usesMock'] }, () => {
  test.beforeEach(
    async ({ setCookieControl, loginPage, page, mockServerUtils }) => {
      await mockServerUtils.reset();
      await setCookieControl();

      await loginPage.goto();
      await loginPage.loginWithId('1234567890');
      await expect(page).toHaveURL(/\/start\/q-1$/);
    },
  );

  /**
   * @tests 41302 - Ensuring the structure of the question has a legend as the strict first child of fieldset
   */

  test('fieldset has legend as first child', async ({ page, questions }) => {
    const { customerNeedsPage } = questions;
    await customerNeedsPage.goto();
    const fieldset = customerNeedsPage.fieldset.first();
    const firstChildTagName = await fieldset.evaluate((element) => {
      return element.firstElementChild?.tagName;
    });
    expect(firstChildTagName).toBe('LEGEND');
  });

  /**
   * @tests 56049 - Debt Advice - Customer Living in England
   * This test relies on the mock api server, so it's in this feature block.
   * These tests run sequentially and the mock resets every new test.
   */
  test('Online form - customer living in england', async ({
    page,
    confirmDetailsPage,
    questions,
    resources,
    inputs,
  }) => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
    };

    const {
      customerNeedsPage,
      doesCustomerLiveInEnglandPage,
      isSelfEmployedPage,
      preferredContactMethodPage,
      customerConsentPage,
    } = questions;

    const {
      referCustomerToBusinessPage,
      referCustomerToDaltPage,
      youNeedCustomerConsentPage,
    } = resources;

    const { yourReferencesForUpdatesPage, customersEmailDetailsPage } = inputs;
    /**
     * Not checking content/options/titles since they're in the above tests.
     */
    await customerNeedsPage.option('Debt advice').click();
    await customerNeedsPage.continueButton.click();
    await doesCustomerLiveInEnglandPage.option('Yes').click();
    await doesCustomerLiveInEnglandPage.continueButton.click();

    await expect(isSelfEmployedPage).toHaveExpectedPageTitles();
    await expect(isSelfEmployedPage).toHaveExpectedOptions();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.isSelfEmployed);

    await isSelfEmployedPage.option('Yes').click();
    await isSelfEmployedPage.continueButton.click();

    await expect(referCustomerToBusinessPage).toHaveExpectedPageTitles();
    await expect(referCustomerToBusinessPage).toHaveExpectedContent();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.referCustomerToBusinessDebtline,
    );

    await referCustomerToBusinessPage.backButton.click();

    /**
     * Make sure the navigations work correctly.
     */
    await expect(isSelfEmployedPage).toHaveExpectedPageTitles();
    await expect(isSelfEmployedPage).toHaveExpectedOptions();

    await isSelfEmployedPage.option('No').click();
    await isSelfEmployedPage.continueButton.click();

    await expect(preferredContactMethodPage).toHaveExpectedPageTitles();
    await expect(preferredContactMethodPage).toHaveExpectedOptions();

    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.preferredContactMethod,
    );

    const noSelectionError =
      'Select whether the customer wants help online, by phone or face to face.';

    await preferredContactMethodPage.continueButton.click();

    await expect(page).toHaveURL(/&q-3=1&error=q-4$/);
    await expect(preferredContactMethodPage.errorLabel).toHaveText(
      noSelectionError,
    );
    await expect(preferredContactMethodPage.errorSummary).toHaveText(
      noSelectionError,
    );
    await expect(page).toHavePartialDataLayerEvent(
      errorMessages.contactMethodNoSelection,
    );

    await preferredContactMethodPage.option('Face to face').click();
    await preferredContactMethodPage.continueButton.click();

    /**
     * A face to face meeting requires referring the customer to DALT.
     */
    await expect(page).toHaveURL(/\/in-person\/debt-advice-locator\?/);
    await expect(referCustomerToDaltPage).toHaveExpectedPageTitles();

    await referCustomerToDaltPage.backButton.click();

    /**
     * Double check that we're back on the right page and navigation is working correctly.
     */
    await expect(preferredContactMethodPage).toHaveExpectedPageTitles();
    await expect(preferredContactMethodPage).toHaveExpectedOptions();

    const onlineCheckbox = preferredContactMethodPage.optionCheckbox('Online');
    const telephoneCheckbox =
      preferredContactMethodPage.optionCheckbox('Telephone');
    const faceToFaceCheckbox =
      preferredContactMethodPage.optionCheckbox('Face to face');

    /**
     * Ensure selection persistence is still working.
     */
    await expect(onlineCheckbox).not.toBeChecked();
    await expect(telephoneCheckbox).not.toBeChecked();
    await expect(faceToFaceCheckbox).toBeChecked();

    await preferredContactMethodPage.option('Online').click();
    await preferredContactMethodPage.continueButton.click();

    /**
     * At this point in the test, the question pages are little bit different.
     * However the base question page should accomadate that.
     */
    await expect(customerConsentPage).toHaveExpectedPageTitles();
    await expect(customerConsentPage).toHaveExpectedOptions();
    await expect(customerConsentPage).toHaveExpectedContent();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.customerConsent);

    const noConsentSelectionError =
      'Select whether the customer gives their consent or not.';

    await customerConsentPage.continueButton.click();

    await expect(page).toHaveURL(/&q-4=0&error=o-1$/);
    await expect(customerConsentPage.errorLabel).toHaveText(
      noConsentSelectionError,
    );
    await expect(customerConsentPage.errorSummary).toHaveText(
      noConsentSelectionError,
    );
    await expect(page).toHavePartialDataLayerEvent(
      errorMessages.customerConsentNoSelection,
    );

    await customerConsentPage.option('No').click();
    await customerConsentPage.continueButton.click();

    await expect(youNeedCustomerConsentPage).toHaveExpectedPageTitles();
    await expect(youNeedCustomerConsentPage).toHaveExpectedContent();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.youNeedCustomersConsent,
    );

    await youNeedCustomerConsentPage.backButton.click();
    await expect(customerConsentPage).toHaveExpectedPageTitles();
    await expect(customerConsentPage).toHaveExpectedOptions();
    await expect(customerConsentPage).toHaveExpectedContent();

    const yesCheckbox = customerConsentPage.optionCheckbox('Yes');
    const noCheckbox = customerConsentPage.optionCheckbox('No');

    await expect(yesCheckbox).not.toBeChecked();
    await expect(noCheckbox).toBeChecked();

    await customerConsentPage.option('Yes').click();
    await customerConsentPage.continueButton.click();

    await expect(yourReferencesForUpdatesPage).toHaveExpectedPageTitles();
    await expect(yourReferencesForUpdatesPage).toHaveExpectedContent();
    await expect(yourReferencesForUpdatesPage).toHaveExpectedFields();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.yourReferencesForUpdates,
    );

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');
    await yourReferencesForUpdatesPage.continueButton.click();

    await expect(customersEmailDetailsPage).toHaveExpectedPageTitles();
    await expect(customersEmailDetailsPage).toHaveExpectedFields();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.customerEmailDetails,
    );

    await customersEmailDetailsPage.field('firstName').fill(user.firstName);
    await customersEmailDetailsPage.field('lastName').fill(user.lastName);
    await customersEmailDetailsPage.field('email').fill(user.email);
    await customersEmailDetailsPage.continueButton.click();

    await expect(page).toHavePartialDataLayerEvent(pageLoads.confirmDetails);

    const tableCells = confirmDetailsPage.tableCells.onlineForm;

    await expect(confirmDetailsPage.subHeader).toHaveText('Confirm Details');
    await expect(tableCells.advicePreference).toHaveText('Online');
    await expect(tableCells.firstName).toHaveText(user.firstName);
    await expect(tableCells.lastName).toHaveText(user.lastName);
    await expect(tableCells.email).toHaveText(user.email);

    await confirmDetailsPage.submitButton.click();

    await expect(page).toHaveURL(/\/online\/details-sent$/);
    await expect(page).toHavePartialDataLayerEvent(pageLoads.detailsSent);
    await expect(page).toHavePartialDataLayerEvent(toolCompletion.detailsSent);
  });

  /**
   * @tests 56126 - Schedule a call for later: Happy path ending with call scheduled success screen
   */
  test('Schedule a call for later: Happy path ending with call scheduled success screen', async ({
    page,
    questions,
    inputs,
    confirmDetailsPage,
  }) => {
    const {
      preferredContactMethodPage,
      telephoneConsentPage,
      outcomeShareConsentPage,
      telephoneCallbackPage,
      timeBookingPage,
    } = questions;

    const {
      yourReferencesForUpdatesPage,
      customersTelephoneDetailsPage,
      securityQuestionsPage,
    } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await expect(telephoneConsentPage).toHaveExpectedPageTitles();
    await expect(telephoneConsentPage).toHaveExpectedOptions();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.telephoneConsent);

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await expect(outcomeShareConsentPage).toHaveExpectedPageTitles();
    await expect(outcomeShareConsentPage).toHaveExpectedOptions();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.outcomeConsent);

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await expect(yourReferencesForUpdatesPage).toHaveExpectedPageTitles();
    await expect(yourReferencesForUpdatesPage).toHaveExpectedFields();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.yourReferencesForUpdatesTelephone,
    );

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');

    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await yourReferencesForUpdatesPage.continueButton.click();

    await expect(telephoneCallbackPage).toHaveExpectedPageTitles();
    await expect(telephoneCallbackPage).toHaveExpectedOptions();
    await expect(telephoneCallbackPage).toHaveExpectedContent();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.telephoneCallback);

    await telephoneCallbackPage.option('Schedule a call for later').click();
    await telephoneCallbackPage.continueButton.click();

    await expect(timeBookingPage).toHaveExpectedPageTitles();
    await expect(timeBookingPage).toHaveExpectedOptions();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.timeslots);

    await timeBookingPage.option('Wednesday 15 January - 9am to 12pm').click();
    await timeBookingPage.continueButton.click();

    await expect(customersTelephoneDetailsPage).toHaveExpectedPageTitles();
    await expect(customersTelephoneDetailsPage).toHaveExpectedFields();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.customerTelephoneDetails,
    );

    await customersTelephoneDetailsPage.field('firstName').fill(user.firstName);
    await customersTelephoneDetailsPage.field('lastName').fill(user.lastName);
    await customersTelephoneDetailsPage.field('telephone').fill(user.telephone);
    await customersTelephoneDetailsPage.continueButton.click();

    await expect(securityQuestionsPage).toHaveExpectedPageTitles();
    await expect(securityQuestionsPage).toHaveExpectedFields();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.securityQuestions);

    await securityQuestionsPage.field('postcode').fill(user.postcode);
    await securityQuestionsPage
      .field('securityQuestion')
      .selectOption(user.securityQuestion.option);
    await securityQuestionsPage
      .field('securityAnswer')
      .fill(user.securityAnswer);
    await securityQuestionsPage.continueButton.click();

    const tableCells = confirmDetailsPage.tableCells.telephoneForm;
    const formattedTelephone = user.telephone.replace(/^0/, '+44');

    await expect(confirmDetailsPage.subHeader).toHaveText('Confirm Details');
    await expect(tableCells.advicePreference).toHaveText('Telephone');
    await expect(tableCells.firstName).toHaveText(user.firstName);
    await expect(tableCells.lastName).toHaveText(user.lastName);
    await expect(tableCells.telephone).toHaveText(formattedTelephone);
    await expect(tableCells.postCode).toHaveText(user.postcode);
    await expect(tableCells.securityQuestion).toHaveText(
      user.securityQuestion.text,
    );
    await expect(tableCells.securityAnswer).toHaveText(user.securityAnswer);
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.confirmDetailsTelephone,
    );

    await confirmDetailsPage.submitButton.click();
    await expect(page).toHaveURL(/\/telephone\/call-scheduled$/);
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.detailsSentTelephone,
    );
    await expect(page).toHavePartialDataLayerEvent(
      toolCompletion.detailsSentTelephone,
    );
  });

  /**
   * @tests 56127 - Telephone option enabled/disabled when no slots available, based on being in/out of office hours
   */
  test('Telephone option enabled/disabled when no slots available, based on being in/out of office hours', async ({
    questions,
    mockServerUtils,
  }) => {
    const { telephoneCallbackPage } = questions;

    await mockServerUtils.toggleBookingSlots('empty-array');
    await telephoneCallbackPage.goto();

    const immediateCallbackCheckbox = telephoneCallbackPage.optionCheckbox(
      'Get an immediate call back',
    );

    if (isInOfficeHours()) {
      await expect(immediateCallbackCheckbox).toBeEnabled();
    } else {
      await expect(immediateCallbackCheckbox).toBeDisabled();
    }
  });

  /**
   * @tests 56128 - Get an immediate call back option enabled/disabled, based on in/out of office hours and test flag
   */
  test('Get an immediate call back option enabled/disabled, based on in/out of office hours and test flag', async ({
    page,
    questions,
    inputs,
  }) => {
    const {
      telephoneConsentPage,
      outcomeShareConsentPage,
      preferredContactMethodPage,
      telephoneCallbackPage,
    } = questions;

    const { yourReferencesForUpdatesPage } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await yourReferencesForUpdatesPage.continueButton.click();

    const immediateCallbackCheckbox = telephoneCallbackPage.optionCheckbox(
      'Get an immediate call back',
    );

    if (isInOfficeHours()) {
      await expect(immediateCallbackCheckbox).toBeEnabled();
    } else {
      await expect(immediateCallbackCheckbox).toBeDisabled();

      // Check testing override query param works
      const params = '/en/telephone/t-4?q-1=1&q-2=0&q-3=1&q-4=1&test=immediate';
      await page.goto(params);

      await expect(immediateCallbackCheckbox).toBeEnabled();
    }
  });

  /**
   * @tests 56190 - Schedule a call for later option disabled when no slots available
   */
  test('Schedule a call for later option disabled when no slots available', async ({
    questions,
    inputs,
    mockServerUtils,
  }) => {
    const {
      preferredContactMethodPage,
      telephoneConsentPage,
      telephoneCallbackPage,
      outcomeShareConsentPage,
    } = questions;

    const { yourReferencesForUpdatesPage } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await mockServerUtils.toggleBookingSlots('empty-array');
    await yourReferencesForUpdatesPage.continueButton.click();

    const scheduleACallbackCheckbox = telephoneCallbackPage.optionCheckbox(
      'Schedule a call for later',
    );

    await expect(scheduleACallbackCheckbox).toBeDisabled();
    await expect(telephoneCallbackPage).toHaveExpectedPageTitles();
    await expect(telephoneCallbackPage).toHaveExpectedContent();
    await expect(telephoneCallbackPage).toHaveExpectedOptions();
  });

  /**
   * @tests 56191 - Get an immediate call: Trying to submit at 3:30pm and should take to schedule a call for later options
   */
  test('Get an immediate call: Trying to submit at 3:30pm and should take to schedule a call for later options', async ({
    page,
    confirmDetailsPage,
    questions,
    inputs,
    mockServerUtils,
  }) => {
    const {
      telephoneConsentPage,
      outcomeShareConsentPage,
      preferredContactMethodPage,
      telephoneCallbackPage,
    } = questions;

    const {
      yourReferencesForUpdatesPage,
      customersTelephoneDetailsPage,
      securityQuestionsPage,
    } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await yourReferencesForUpdatesPage.continueButton.click();

    const immediateCallbackCheckbox = telephoneCallbackPage.optionCheckbox(
      'Get an immediate call back',
    );

    /** Cannot continue with the test out of hours. */
    if (!isInOfficeHours())
      return await expect(immediateCallbackCheckbox).toBeDisabled();

    await expect(immediateCallbackCheckbox).toBeEnabled();

    await telephoneCallbackPage.option('Get an immediate call back').click();
    await telephoneCallbackPage.continueButton.click();

    await customersTelephoneDetailsPage.field('firstName').fill(user.firstName);
    await customersTelephoneDetailsPage.field('lastName').fill(user.lastName);
    await customersTelephoneDetailsPage.field('telephone').fill(user.telephone);
    await customersTelephoneDetailsPage.continueButton.click();

    await securityQuestionsPage.field('postcode').fill(user.postcode);
    await securityQuestionsPage
      .field('securityQuestion')
      .selectOption(user.securityQuestion.option);
    await securityQuestionsPage
      .field('securityAnswer')
      .fill(user.securityAnswer);
    await securityQuestionsPage.continueButton.click();

    const tableCells = confirmDetailsPage.tableCells.telephoneForm;
    const formattedTelephone = user.telephone.replace(/^0/, '+44');

    await expect(confirmDetailsPage.subHeader).toHaveText('Confirm Details');
    await expect(tableCells.advicePreference).toHaveText('Telephone');
    await expect(tableCells.firstName).toHaveText(user.firstName);
    await expect(tableCells.lastName).toHaveText(user.lastName);
    await expect(tableCells.telephone).toHaveText(formattedTelephone);
    await expect(tableCells.postCode).toHaveText(user.postcode);
    await expect(tableCells.securityQuestion).toHaveText(
      user.securityQuestion.text,
    );
    await expect(tableCells.securityAnswer).toHaveText(user.securityAnswer);

    await mockServerUtils.toggleAppointmentResponse('out-of-hours');

    await confirmDetailsPage.submitButton.click();
    await expect(page).toHaveURL(/telephone\/t-9/);
    await expect(page).toHaveTitle(/^Service not available/);
  });

  /**
   * @tests 56192 - Schedule a call for later: Last available slot gets taken before form is submitted: User gets taken to call could not be scheduled page
   */
  test('Schedule a call for later: Last available slot gets taken before form is submitted: User gets taken to call could not be scheduled page', async ({
    page,
    questions,
    inputs,
    mockServerUtils,
    confirmDetailsPage,
  }) => {
    const {
      telephoneConsentPage,
      outcomeShareConsentPage,
      preferredContactMethodPage,
      telephoneCallbackPage,
      timeBookingPage,
    } = questions;

    const {
      yourReferencesForUpdatesPage,
      customersTelephoneDetailsPage,
      securityQuestionsPage,
    } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await yourReferencesForUpdatesPage.continueButton.click();

    await telephoneCallbackPage.option('Schedule a call for later').click();
    await telephoneCallbackPage.continueButton.click();

    await timeBookingPage.option('Wednesday 15 January - 9am to 12pm').click();
    await timeBookingPage.continueButton.click();

    await customersTelephoneDetailsPage.field('firstName').fill(user.firstName);
    await customersTelephoneDetailsPage.field('lastName').fill(user.lastName);
    await customersTelephoneDetailsPage.field('telephone').fill(user.telephone);
    await customersTelephoneDetailsPage.continueButton.click();

    await securityQuestionsPage.field('postcode').fill(user.postcode);
    await securityQuestionsPage
      .field('securityQuestion')
      .selectOption(user.securityQuestion.option);
    await securityQuestionsPage
      .field('securityAnswer')
      .fill(user.securityQuestion.text);
    await securityQuestionsPage.continueButton.click();

    await mockServerUtils.toggleBookingSlots('no-availability');
    await mockServerUtils.toggleAppointmentResponse('no-slots-available');

    await confirmDetailsPage.submitButton.click();
    await expect(page).toHaveURL(/\/telephone\/call-could-not-be-scheduled/);
    await expect(page).toHaveTitle(/^Call could not be scheduled/);
  });

  /**
   * @tests 56193 - Schedule a call for later: Selected slot gets taken: User gets taken to call could not be scheduled page to select other available slots
   */
  test('Schedule a call for later: Selected slot gets taken: User gets taken to call could not be scheduled page to select other available slots', async ({
    page,
    questions,
    inputs,
    confirmDetailsPage,
    mockServerUtils,
  }) => {
    const {
      telephoneConsentPage,
      outcomeShareConsentPage,
      preferredContactMethodPage,
      telephoneCallbackPage,
      timeBookingPage,
    } = questions;

    const {
      yourReferencesForUpdatesPage,
      customersTelephoneDetailsPage,
      securityQuestionsPage,
    } = inputs;

    await preferredContactMethodPage.goto();

    await preferredContactMethodPage.option('Telephone').click();
    await preferredContactMethodPage.continueButton.click();

    await telephoneConsentPage.option('Yes').click();
    await telephoneConsentPage.continueButton.click();

    await outcomeShareConsentPage.option('Yes').click();
    await outcomeShareConsentPage.continueButton.click();

    await yourReferencesForUpdatesPage
      .field('customerReference')
      .fill('test reference');
    await yourReferencesForUpdatesPage
      .field('departmentName')
      .fill('test department name');

    await yourReferencesForUpdatesPage.continueButton.click();

    await telephoneCallbackPage.option('Schedule a call for later').click();
    await telephoneCallbackPage.continueButton.click();

    await timeBookingPage.option('Wednesday 15 January - 9am to 12pm').click();
    await timeBookingPage.continueButton.click();

    await customersTelephoneDetailsPage.field('firstName').fill(user.firstName);
    await customersTelephoneDetailsPage.field('lastName').fill(user.lastName);
    await customersTelephoneDetailsPage.field('telephone').fill(user.telephone);
    await customersTelephoneDetailsPage.continueButton.click();

    await securityQuestionsPage.field('postcode').fill(user.postcode);
    await securityQuestionsPage
      .field('securityQuestion')
      .selectOption(user.securityQuestion.option);
    await securityQuestionsPage
      .field('securityAnswer')
      .fill(user.securityQuestion.text);
    await securityQuestionsPage.continueButton.click();

    await mockServerUtils.toggleBookingSlots('limited-availability');
    await mockServerUtils.toggleAppointmentResponse('capacity-full');

    await confirmDetailsPage.submitButton.click();
    await expect(page).toHaveURL(/\/telephone\/t-8/);
    await expect(page).toHaveTitle(/^Call could not be scheduled/);
  });
});
