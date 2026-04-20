import { expect, test } from '@playwright/test';

import { RegistrationPage } from '../pages/RegistrationPage';

function buildOTPResponse(payload) {
  if (payload.otp === 'INVALID_OTP') {
    return {
      status: 400,
      json: {
        ok: false,
        fields: {
          otp: { error: 'invalid_grant' },
        },
        error: true,
      },
    };
  } else {
    return {
      json: { success: true, id_token: 'RANDOM_ID_TOKEN_FOR_TEST' },
    };
  }
}

function buildFieldValidationResponse(payload) {
  const fields = [
    'givenName',
    'surname',
    'individualReferenceNumber',
    'jobTitle',
    'mail',
    'phone',
    'confirmation',
  ];
  const fieldErrors = {};
  let validResponseState = true;

  for (const field of fields) {
    if (!payload[field]) {
      validResponseState = false;
      fieldErrors[field] = { error: 'required' };
    } else if (
      field === 'individualReferenceNumber' &&
      payload[field] === 'INVALID_REF'
    ) {
      validResponseState = false;
      fieldErrors[field] = { error: 'invalid' };
    } else if (field === 'mail' && payload[field] === 'existing@mail.com') {
      validResponseState = false;
      fieldErrors[field] = { error: 'email_exists' };
    } else {
      fieldErrors[field] = { ok: true };
    }
  }
  return [validResponseState, fieldErrors];
}

let registrationPage: RegistrationPage;

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);

    await test.step('Setup Mocks - FCA Number', async () => {
      await page.route(
        '*/**/api/register/fca-lookup*',
        async (route, request) => {
          const url = request.url();
          const queryParams = url.split('?')[1];
          const fcaNumber = queryParams.split('=')[1];

          if (!fcaNumber || fcaNumber == 'INVALID_NUMBER') {
            await route.fulfill({
              status: 400,
              json: {
                statusCode: 400,
                errorType: 'required',
                message:
                  'The FCA Firm Reference Number (FRN) provided is invalid.',
              },
            });
          } else {
            await route.fulfill({
              json: { success: true },
            });
          }
        },
      );
    });

    await test.step('Setup Mocks - Register User', async () => {
      page.route('*/**/api/register/register-user', async (route, request) => {
        const payload = request.postDataJSON();
        if (payload.otp) {
          await route.fulfill(buildOTPResponse(payload));
        } else {
          const [validResponseState, fields] =
            buildFieldValidationResponse(payload);

          if (validResponseState) {
            await route.fulfill({
              json: {
                success: true,
                otpSent: true,
              },
            });
          } else {
            await route.fulfill({
              status: 400,
              json: {
                ok: false,
                fields,
                error: true,
              },
            });
          }
        }
      });
    });

    await page.goto('/register');

    await test.step('Accept cookies if banner visible', async () => {
      // Accept cookies if banner is visible
      await page
        .getByRole('button', { name: 'Accept all cookies' })
        .click({ timeout: 10000 })
        .catch(() => {
          console.log('Cookie banner not found');
        });
    });
  });

  test('Content', async ({ page }) => {
    await test.step('Assert title', async () => {
      await registrationPage.assertTitle('Travel insurance directory');
    });

    await test.step('Assert content heading', async () => {
      await registrationPage.assertHeading(
        'Register your firm for the Travel Insurance Directory',
      );
    });

    await test.step('Assert content', async () => {
      const paragraph = page.getByTestId('paragraph');
      expect(await paragraph.allTextContents()).toStrictEqual([
        'Firms authorised by the Financial Conduct Authority (FCA) can use this service to register for the Travel Insurance Directory.',
        'We will assess your application to ensure your firm meets the required risk appetite and capability standards for covering travellers with pre-existing medical conditions.',
        'What you will need before beginning your application, please ensure you have the following details to hand:',
      ]);

      const list = page.getByTestId('list-element');
      await list.waitFor();
      await expect(list).toHaveText(
        'FCA Firm Reference Number (FRN)Confirmation of Financial Ombudsman Service (FOS) and FSCS coverageDetails of the specific medical conditions or risk profiles you cover',
      );
    });

    await test.step('Assert button click', async () => {
      const locator = page.getByRole('link', { name: 'Start' });
      await locator.waitFor();
      await locator.click({ force: true });
      await page.waitForURL('/register/fca', { timeout: 5000 });
    });
  });

  test('Step - 1 - FCA Firm Reference Number', async ({ page }) => {
    await test.step('Navigate to Registration step 1', async () => {
      const locator = page.getByRole('link', { name: 'Start' });
      await locator.waitFor();
      await locator.click({ force: true });
      await page.waitForURL('/register/fca', { timeout: 5000 });
    });

    await test.step('Assert content', async () => {
      await registrationPage.assertHeading(
        'What is your FCA Firm Reference Number?',
      );

      await expect(page.getByTestId('paragraph')).toHaveText(
        'You can enter details for one firm. This can be the main authorised firm OR one trading name registered to the FCA Firm Reference Number (FRN) above.',
      );

      await expect(
        page.getByText('FCA Firm Reference Number (FRN)', { exact: true }),
      ).toBeVisible();

      await expect(
        page.getByLabel('FCA Firm Reference Number (FRN)'),
      ).toBeVisible();
    });

    const continueButtonLocator = page.getByRole('button', {
      name: 'Continue',
    });

    await test.step('FCA Firm Reference Number validation', async () => {
      await continueButtonLocator.waitFor();
      await continueButtonLocator.click();

      await expect(page.getByTestId('fcaNumber-error')).toHaveText(
        'The FCA Firm Reference Number (FRN) provided is invalid.',
      );

      await registrationPage.fillField('fcaNumber', 'INVALID_NUMBER');
      await continueButtonLocator.click();

      await expect(page.getByTestId('fcaNumber-error')).toHaveText(
        'The FCA Firm Reference Number (FRN) provided is invalid.',
      );
    });

    await test.step('Valid FCA Number - Navigate to Step 2', async () => {
      await registrationPage.fillField('fcaNumber', 'RKO12345');
      await continueButtonLocator.click();
      await page.waitForURL('/register/user', { timeout: 5000 });
    });
  });

  test('Step - 2 - Create your account', async ({ page }) => {
    await test.step('Navigate to FCA Firm Reference Number page', async () => {
      const locator = page.getByRole('link', { name: 'Start' });
      await locator.waitFor();
      await locator.click({ force: true });
      await page.waitForURL('/register/fca', { timeout: 5000 });
    });

    await test.step('Navigate to Create your account page', async () => {
      const continueButtonLocator = page.getByRole('button', {
        name: 'Continue',
      });
      await continueButtonLocator.waitFor();
      await registrationPage.fillField('fcaNumber', 'RKO12345');
      await continueButtonLocator.click();
      await page.waitForURL('/register/user', { timeout: 5000 });
    });

    const nextButtonLocator = page.getByTestId('signupUser');

    await test.step('Assert page content', async () => {
      await registrationPage.assertHeading('Create your account');

      await expect(page.getByTestId('confirmation-label')).toHaveText(
        `ConfirmationThe Money & Pension Service ("MaPS") is operating this Directory pursuant to rules set out in the Financial Conduct Authority ("FCA") Handbook and anagreement with the FCA. MaPS reserves the right to obtainand maintain complete and continuous verification (including time-to-time at MaPS' discretion) any information provided in whole or in part in connection with a firm's application to be in the Directory. Such verification shall include MaPS seeking corroboration as to such evidence from the applicable firm, the FCA and/or anyother third party.MaPS also reserves the right to pass to the FCA any information from or about a firm that has applied to be in the Directory, including as to whether a firm has failed for any reason to provide complete and accurate information relevant to such application and the firm's appearance in the Directory. [No firm will be considered for the Directory without the electronic signature of a senior manager of the firm on the application. Such signature will constitute (i) the firm's agreement to the terms for being in the Directory, and (ii) the personal warranty of the signatory of their authority to bind the applicable firm to such terms.]and that you have the signatory of their authority to bind the applicable firm to such terms.`,
      );
    });

    await test.step('Assert validation errors - required fields', async () => {
      await nextButtonLocator.click();

      expect(
        await registrationPage.checkValidationErrors([
          {
            message: 'Please enter a valid first name',
            fieldName: 'givenName',
          },
          { message: 'Please enter a valid last name', fieldName: 'surname' },
          {
            message: 'Please enter a valid individual reference number (irn)',
            fieldName: 'individualReferenceNumber',
          },
          { message: 'Please enter a valid job title', fieldName: 'jobTitle' },
          { message: 'Please enter a valid email address', fieldName: 'mail' },
          {
            message: 'Please enter a valid telephone number',
            fieldName: 'phone',
          },
          {
            message: 'Please enter a valid confirmation',
            fieldLevelMessage: 'Confirmation is required',
            fieldName: 'confirmation',
          },
        ]),
      ).toBe(true);
    });

    await test.step('Assert Invalid Reference Number error', async () => {
      await registrationPage.fillField('givenName', 'Reshma');
      await registrationPage.fillField('surname', 'Kommineni');
      await registrationPage.fillField(
        'individualReferenceNumber',
        'INVALID_REF',
      );
      await registrationPage.fillField('jobTitle', 'Tester');
      await registrationPage.fillField('phone', '+441234567890');
      await registrationPage.clickCheckbox('confirmation');
      await nextButtonLocator.click();

      expect(
        await registrationPage.checkValidationErrors([
          {
            message: 'Please enter a valid individual reference number (irn)',
            fieldName: 'individualReferenceNumber',
          },
        ]),
      ).toBe(true);
    });

    await test.step('Assert existing email error', async () => {
      await registrationPage.fillField('individualReferenceNumber', 'REF00001');
      await registrationPage.fillField('mail', 'existing@mail.com');
      await nextButtonLocator.click();
      expect(
        await registrationPage.checkValidationErrors([
          {
            message: 'This email address is already registered.',
            fieldName: 'mail',
          },
        ]),
      ).toBe(true);
    });

    await test.step('Valid user details', async () => {
      await registrationPage.fillField('mail', 'non-existing@mail.com');
      await nextButtonLocator.click();
    });

    const confirmButtonLocator = page.getByTestId('signupUser');

    await test.step('Assert OTP Details', async () => {
      await expect(page.getByTestId('otp-heading')).toHaveText(
        'One-time passcode',
      );
      await expect(page.getByTestId('enter-passcode-text')).toHaveText(
        'Please enter the One-Time passcode which has been sent to:non-existing@mail.com',
      );
    });

    await test.step('Invalid OTP - Error handling', async () => {
      await registrationPage.fillField('otp', 'INVALID_OTP');
      await confirmButtonLocator.click();

      expect(
        await registrationPage.checkValidationErrors([
          {
            message:
              'Incorrect one-time passcode. Please check the code and try again.',
          },
        ]),
      ).toBe(true);
      await expect(
        page
          .getByTestId('otp-errors')
          .getByText('Incorrect one-time passcode.'),
      ).toHaveText(
        'Incorrect one-time passcode. Please check the code and try again.',
      );
    });

    await test.step('Valid OTP - Successful user registration', async () => {
      await registrationPage.fillField('otp', '12345678');
      await confirmButtonLocator.click();

      await page.waitForURL('/register/firm/step1', { timeout: 5000 });
      await registrationPage.assertHeading('Are your customers covered?');
    });
  });

  test('Firm registration - Customers fully covered', async ({ page }) => {
    await test.step('Navigate to Firm registration', async () => {
      await page.goto('/register/firm/step1');
      await registrationPage.assertHeading('Are your customers covered?');
    });

    await test.step('Content', async () => {
      await expect(page.getByTestId('copyItemContent-1')).toHaveText(
        `Are the firm's customers fully covered by the UK Financial Ombudsman Service (FOS) and the UK Financial Services Compensation Scheme (FSCS)?`,
      );
      await expect(page.getByText('Yes')).toBeVisible();
      await expect(page.getByText('No', { exact: true })).toBeVisible();
    });

    await test.step('Selecting Yes for coverage', async () => {
      await page.getByText('Yes').click();
      await page.getByTestId('submit-button').click();
      await page.waitForURL('/register/firm/step2', { timeout: 5000 });
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });
  });

  test('Firm registration - Customers not fully covered', async ({ page }) => {
    await test.step('Navigate to Firm registration', async () => {
      await page.goto('/register/firm/step1');
      await registrationPage.assertHeading('Are your customers covered?');
    });

    await test.step('Selecting No for coverage', async () => {
      await page.getByText('No', { exact: true }).click();
      await page.getByTestId('submit-button').click();
      await page.waitForURL('/register/unsuccessful', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Your firm is not eligible to be listed',
      );
    });

    await test.step('Firm not eligible content', async () => {
      await expect(page.getByTestId('copyItemContent-0')).toHaveText(
        'Based on the information you have supplied, your firm is not eligible to be listed on the Money & Pensions Service Travel Insurance Directory.',
      );
      await expect(page.getByTestId('copyItemContent-1')).toHaveText(
        'If you would like to discuss this with us, please contact us in the first instance at: traveldirectory@maps.org.uk',
      );
    });
  });

  test('Medical risk assessment - content', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step2');
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });

    await test.step('Verify content', async () => {
      await expect(page.getByTestId('copyItemContent-0')).toHaveText(
        'Please state whether such capability and appetite is demonstrated by one or more of the following means:',
      );
      await expect(page.getByTestId('copyItemContent-1')).toHaveText(
        "Please note that 'Risk Data' means 'data as to the nature and severity of an applicant's medical condition(s)', and 'Underwriting Decision' means 'your firm's decision - or that of an insurer where your firm does not have direct or other underwriting authority - whether or not to agree policy terms with the applicant'.",
      );

      await expect(page.getByTestId('radio-button-label').first()).toHaveText(
        'Your firm, or someone on its behalf, undertakes a bespoke consultation with the applicant from which Risk Data is obtained and then assessed in the Underwriting Decision',
      );
      await expect(page.getByTestId('radio-button-label').nth(1)).toHaveText(
        "Your firm, or someone on its behalf, uses your firm's own proprietary medical screening questionnaire, software or other pre-prepared methodology in communicating with the applicant by which means Risk Data is obtained and then assessed in the Underwriting Decision",
      );
      await expect(page.getByTestId('radio-button-label').nth(2)).toHaveText(
        'Your firm, or someone on its behalf, uses in communicating with the applicant a medical screening questionnaire, software or pre-prepared methodology that is not proprietary to your firm but by which Risk Data is obtained and then assessed in the Underwriting Decision',
      );
      await expect(page.getByTestId('radio-button-label').last()).toHaveText(
        'None of the above',
      );
    });
  });

  test('Medical risk assessment - None of the above', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step2');
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });

    await test.step('Select option - None of the above', async () => {
      await registrationPage.selectRadio(
        'radio-risk_profile_approach_question-neither',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for unsuccessful page', async () => {
      await page.waitForURL('/register/unsuccessful', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Your firm is not eligible to be listed',
      );
    });
  });

  test('Medical risk assessment - Bespoke option', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step2');
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });

    await test.step('Select option - Bespoke', async () => {
      await registrationPage.selectRadio(
        'radio-risk_profile_approach_question-bespoke',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for evidence confirmation page', async () => {
      await page.waitForURL('/register/firm/step3', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Confirm you can provide evidence of your capability',
      );
    });
  });

  test('Medical risk assessment - Questionnaire', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step2');
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });

    await test.step('Select option - Questionnaire', async () => {
      await registrationPage.selectRadio(
        'radio-risk_profile_approach_question-questionaire',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for evidence confirmation page', async () => {
      await page.waitForURL('/register/firm/step3', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Confirm you can provide evidence of your capability',
      );
    });
  });

  test('Medical risk assessment - Non-Proprietary', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step2');
      await registrationPage.assertHeading(
        'How does your firm assess medical risk?',
      );
    });

    await test.step('Select option - Non - Proprietary', async () => {
      await registrationPage.selectRadio(
        'radio-risk_profile_approach_question-non-proprietary',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for evidence confirmation page', async () => {
      await page.waitForURL('/register/firm/step3', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Confirm you can provide evidence of your capability',
      );
    });
  });

  test('Evidence for medical risk assement', async ({ page }) => {
    await test.step('Navigate to medical risk assessment page', async () => {
      await page.goto('/register/firm/step3');
      await registrationPage.assertHeading(
        'Confirm you can provide evidence of your capability',
      );
    });

    await test.step('Verify content', async () => {
      await expect(page.getByTestId('copyItemContent-0')).toHaveText(
        "Does your firm undertake to produce to MaPS on demand any of the following evidence to demonstrate your firm's Relevant Capability and Relevant Risk Appetite, and in particular a clear track record or objectively realistic plan for effecting, carrying out and distributing travel insurance policies that cover more serious medical conditions:",
      );
      await expect(
        page.getByTestId('list-element').locator('li').first(),
      ).toHaveText('regulatory returns or submissions;');
      await expect(
        page.getByTestId('list-element').locator('li').nth(1),
      ).toHaveText(
        'delegated authority or other insurance distribution agreements, plus performance data arising from the operation thereof;',
      );
      await expect(
        page.getByTestId('list-element').locator('li').last(),
      ).toHaveText(
        'copy policy and other customer-facing compliance documentation (eg IPID)',
      );
    });

    await test.step('Select option - No', async () => {
      await registrationPage.selectRadio(
        'radio-supplies_document_when_needed_question-false',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for unsuccessful page', async () => {
      await page.waitForURL('/register/unsuccessful', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Your firm is not eligible to be listed',
      );
    });

    await test.step('Back to evidence page', async () => {
      await page.goto('/register/firm/step3');
      await registrationPage.assertHeading(
        'Confirm you can provide evidence of your capability',
      );
    });

    await test.step('Select option - Yes', async () => {
      await registrationPage.selectRadio(
        'radio-supplies_document_when_needed_question-true',
      );
      await page.getByTestId('submit-button').click();
    });

    await test.step('Wait for medical conditions page', async () => {
      await page.waitForURL('/register/scenario', { timeout: 10000 });
      await registrationPage.assertHeading(
        'Confirm coverage for standard medical scenarios',
      );
    });
  });

  test('Medical scenarios - Registration unsuccessful', async ({ page }) => {
    await test.step('Navigate to medical conditions coverage', async () => {
      await page.goto('/register/scenario');
      await registrationPage.assertHeading(
        'Confirm coverage for standard medical scenarios',
      );
    });

    await test.step('Verify content', async () => {
      await expect(page.getByTestId('paragraph').first()).toHaveText(
        'You have confirmed that you will offer travel insurance to people with any/most types of serious medical conditions. Please now confirm in which of the fifteen hypothetical scenarios on the following pages your firm would offer single trip cover (without medical exclusions).',
      );
      await expect(page.getByTestId('paragraph').last()).toHaveText(
        "Please select 'yes' or 'no' for the following scenarios.",
      );
    });

    await test.step('Navigate to medical scenarios', async () => {
      await page.getByRole('link', { name: 'Continue' }).click();
      await page.waitForURL('/register/scenario/step1', { timeout: 5000 });
      await registrationPage.assertHeading('Metastatic Breast cancer');
    });

    const submitButton = page.getByTestId('submit-button');
    const scenarios = [
      {
        title: 'Metastatic Breast cancer',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'metastatic_breast_cancer',
        radioSelection: 'true',
      },
      {
        title: 'Ulcerative Colitis and anaemia',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'ulceritive_colitis_and_anaemia',
        radioSelection: 'true',
      },
      {
        title: 'Heart attack with High Blood Pressure and High Cholesterol',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'heart_attack_with_hbp_and_high_cholesterol',
        radioSelection: 'true',
      },
      {
        title: 'COPD with recent respiratory infection',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'copd_with_respiratory_infection',
        radioSelection: 'true',
      },
      {
        title: 'Motor neurone disease',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'motor_neurone_disease',
        radioSelection: 'true',
      },
      {
        title: 'Hodgkin Lymphoma',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'hodgkin_lymphoma',
        radioSelection: 'true',
      },
      {
        title: 'Acute Myeloid Leukaemia',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'acute_myeloid_leukaemia',
        radioSelection: 'false',
      },
      {
        title: 'Guillain-Barré Syndrome',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'guillain_barre_syndrome',
        radioSelection: 'false',
      },
      {
        title: 'Heart Failure and arrhythmia',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'heart_failure_and_arrhytmia',
        radioSelection: 'true',
      },
      {
        title: 'Stroke with High Blood Pressure and High Cholesterol',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'stroke_with_hbp',
        radioSelection: 'true',
      },
      {
        title:
          'Peripheral Vascular Disease with High Blood Pressure and High Cholesterol',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'peripheral_vascular_disease',
        radioSelection: 'true',
      },
      {
        title: 'Schizophrenia',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'schizophrenia',
        radioSelection: 'true',
      },
      {
        title: 'Lupus with pericarditis and Neuropathy',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'lupus',
        radioSelection: 'true',
      },
      {
        title: 'Sickle cell anaemia and renal disease',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'sickle_cell_and_renal',
        radioSelection: 'true',
      },
      {
        title: 'Sub-arachnoid haemorrhage with epilepsy',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'sub_arachnoid_haemorrhage_and_epilepsy',
        radioSelection: 'false',
      },
      {
        title: 'Prostate Cancer',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'prostate_cancer',
        radioSelection: 'true',
      },
      {
        title: 'Type 1 Diabetes',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'type_one_diabetes',
        radioSelection: 'true',
      },
      {
        title: "Parkinson's Disease",
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'parkinsons_disease',
        radioSelection: 'false',
      },
      {
        title: 'HIV',
        errorMessage: 'Please select an option',
        fieldErrorMessage: 'Please select an option',
        fieldName: 'hiv',
        radioSelection: 'false',
      },
    ];

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];

      await test.step(`Validation for ${scenario.title}`, async () => {
        await submitButton.click();
        await registrationPage.checkValidationErrors([
          {
            message: scenario.errorMessage,
            fieldLevelMessage: scenario.fieldErrorMessage,
            fieldName: scenario.fieldName,
          },
        ]);
      });

      await test.step(`Select radio-${scenario.fieldName}-${scenario.radioSelection}`, async () => {
        await registrationPage.selectRadio(
          `radio-${scenario.fieldName}-${scenario.radioSelection}`,
        );
        await submitButton.click();
        const nextScenario = scenarios[i + 1];

        await page.waitForURL(
          nextScenario
            ? `/register/scenario/step${i + 2}`
            : '/register/confirm-details',
          {
            timeout: 5000,
          },
        );
        await registrationPage.assertHeading(
          nextScenario ? nextScenario.title : 'Confirm details',
        );
      });
    }

    await test.step('Registration unsuccessful', async () => {
      await submitButton.click();
      await page.waitForURL('/register/unsuccessful', { timeout: 5000 });
      await registrationPage.assertHeading(
        'Your firm is not eligible to be listed',
      );
    });
  });
});
