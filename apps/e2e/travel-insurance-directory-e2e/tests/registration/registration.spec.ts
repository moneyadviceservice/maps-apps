import { test } from '@playwright/test';

import { MEDICAL_SCENARIOS } from '../../data/medicalScenarios.data';
import { RegistrationPage } from '../../pages/RegistrationPage';

let registrationPage: RegistrationPage;

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.acceptCookiesIfVisible();
  });

  test('Step - 1 - FCA Firm Reference Number', async () => {
    await test.step('Navigate to Registration step 1', async () => {
      await registrationPage.clickStartButton();
      await registrationPage.expectNavigationTo('/register/fca');
    });

    await test.step('Assert heading', async () => {
      await registrationPage.assertHeading(
        'What is your FCA Firm Reference Number?',
      );
    });

    await test.step('FCA FRN validation - Empty', async () => {
      await registrationPage.clickContinueButton();
      await registrationPage.verifyFcaNumberInvalid();
    });

    await test.step('FCA FRN validation - Invalid regex', async () => {
      await registrationPage.fillFcaField('INVALID_NUMBER');
      await registrationPage.clickContinueButton();
      await registrationPage.verifyFcaNumberInvalid();
    });

    await test.step('FCA FRN validation - Not Found', async () => {
      await registrationPage.fillFcaField('404404');
      await registrationPage.clickContinueButton();
      await registrationPage.verifyFcaNumberNotFound();
    });

    await test.step('FCA FRN validation - Not Authorised', async () => {
      await registrationPage.fillFcaField('111111');
      await registrationPage.clickContinueButton();
      await registrationPage.verifyFcaNumberInvalid();
    });

    await test.step('Valid FCA Number - Navigate to Step 2', async () => {
      await registrationPage.fillFcaField('123456');
      await registrationPage.clickContinueButton();
      await registrationPage.expectNavigationTo('/register/user');
    });
  });

  test('Step - 2 - Create your account', async () => {
    await test.step('Navigate to FCA Firm Reference Number page', async () => {
      await registrationPage.clickStartButton();
      await registrationPage.expectNavigationTo('/register/fca');
    });

    await test.step('Navigate to Create your account page', async () => {
      await registrationPage.fillFcaField('123456');
      await registrationPage.clickContinueButton();
      await registrationPage.expectNavigationTo('/register/user');
    });

    await test.step('Assert validation errors - required fields', async () => {
      await registrationPage.clickNextButton();
      await registrationPage.assertValidationErrors([
        {
          message: 'Please enter a valid first name',
          fieldName: 'givenName',
        },
        { message: 'Please enter a valid last name', fieldName: 'surname' },
        {
          message: 'Please enter a valid individual reference number (IRN)',
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
      ]);
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
      await registrationPage.clickNextButton();
      await registrationPage.assertValidationErrors([
        {
          message: 'Please enter a valid individual reference number (IRN)',
          fieldName: 'individualReferenceNumber',
        },
      ]);
    });

    await test.step('Assert existing email error', async () => {
      await registrationPage.fillField('individualReferenceNumber', 'REF00001');
      await registrationPage.fillField('mail', 'exists@example.com');
      await registrationPage.clickNextButton();
      await registrationPage.assertValidationErrors([
        {
          message: 'This email address is already registered.',
          fieldName: 'mail',
        },
      ]);
    });

    await test.step('Valid user details', async () => {
      await registrationPage.fillField('mail', 'newuser@example.com');
      await registrationPage.clickSignUpUserButton();
    });

    await test.step('Invalid OTP - Error handling', async () => {
      await registrationPage.fillOtp('111111');
      await registrationPage.clickConfirmButton();
      await registrationPage.verifyOtpInvalid();
    });

    await test.step('Valid OTP - Successful user registration', async () => {
      await registrationPage.fillOtp('12345678');
      await registrationPage.clickSignUpUserButton();
      await registrationPage.expectNavigationTo('/register/firm/step1');
      await registrationPage.assertHeading('Are your customers covered?');
    });
  });

  test.describe('Firm registration steps', () => {
    test.beforeEach(async () => {
      await registrationPage.goto('fca');
      await registrationPage.fillFcaField('123456');
      await registrationPage.clickContinueButton();
      await registrationPage.fillUserDetails();
      await registrationPage.completeUserRegistration();
    });

    test('Firm registration - Customers fully covered', async () => {
      await test.step('Navigate to Firm registration', async () => {
        await registrationPage.goto('firm/step1');
        await registrationPage.assertHeading('Are your customers covered?');
      });

      await test.step('Selecting Yes for coverage', async () => {
        await registrationPage.clickYesRadioButton();
        await registrationPage.clickContinueButton();
        await registrationPage.expectNavigationTo('/register/firm/step2');
        await registrationPage.assertHeading(
          'How does your firm assess medical risk?',
        );
      });
    });

    test('Firm registration - Customers not fully covered', async () => {
      await test.step('Navigate to Firm registration', async () => {
        await registrationPage.goto('firm/step1');
        await registrationPage.assertHeading('Are your customers covered?');
      });

      await test.step('Selecting No for coverage', async () => {
        await registrationPage.clickNoRadioButton();
        await registrationPage.clickContinueButton();
        await registrationPage.expectNavigationTo('/register/unsuccessful');
        await registrationPage.assertHeading(
          'Your firm is not eligible to be listed',
        );
      });
    });

    test('Medical risk assessment - None of the above', async () => {
      await test.step('Navigate to medical risk assessment page', async () => {
        await registrationPage.goto('firm/step2');
        await registrationPage.assertHeading(
          'How does your firm assess medical risk?',
        );
      });

      await test.step('Select option - None of the above', async () => {
        await registrationPage.clickNoneRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for unsuccessful page', async () => {
        await registrationPage.expectNavigationTo('/register/unsuccessful');
        await registrationPage.assertHeading(
          'Your firm is not eligible to be listed',
        );
      });
    });

    test('Medical risk assessment - Bespoke option', async () => {
      await test.step('Navigate to medical risk assessment page', async () => {
        await registrationPage.goto('firm/step2');
        await registrationPage.assertHeading(
          'How does your firm assess medical risk?',
        );
      });

      await test.step('Select option - Bespoke', async () => {
        await registrationPage.clickBespokeRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for evidence confirmation page', async () => {
        await registrationPage.expectNavigationTo('/register/firm/step3');
        await registrationPage.assertHeading(
          'Confirm you can provide evidence of your capability',
        );
      });
    });

    test('Medical risk assessment - Questionnaire', async () => {
      await test.step('Navigate to medical risk assessment page', async () => {
        await registrationPage.goto('firm/step2');
        await registrationPage.assertHeading(
          'How does your firm assess medical risk?',
        );
      });

      await test.step('Select option - Questionnaire', async () => {
        await registrationPage.clickScreeningQuestionnaireRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for evidence confirmation page', async () => {
        await registrationPage.expectNavigationTo('/register/firm/step3');
        await registrationPage.assertHeading(
          'Confirm you can provide evidence of your capability',
        );
      });
    });

    test('Medical risk assessment - Non-Proprietary', async () => {
      await test.step('Navigate to medical risk assessment page', async () => {
        await registrationPage.goto('firm/step2');
        await registrationPage.assertHeading(
          'How does your firm assess medical risk?',
        );
      });

      await test.step('Select option - Non - Proprietary', async () => {
        await registrationPage.clickNonProprietaryRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for evidence confirmation page', async () => {
        await registrationPage.expectNavigationTo('/register/firm/step3');
        await registrationPage.assertHeading(
          'Confirm you can provide evidence of your capability',
        );
      });
    });

    test('Evidence for medical risk assement', async () => {
      await test.step('Navigate to medical risk assessment page', async () => {
        await registrationPage.goto('firm/step3');
        await registrationPage.assertHeading(
          'Confirm you can provide evidence of your capability',
        );
      });

      await test.step('Select option - No', async () => {
        await registrationPage.clickNoRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for unsuccessful page', async () => {
        await registrationPage.expectNavigationTo('/register/unsuccessful');
        await registrationPage.assertHeading(
          'Your firm is not eligible to be listed',
        );
      });

      await test.step('Back to evidence page', async () => {
        await registrationPage.goto('firm/step3');
        await registrationPage.assertHeading(
          'Confirm you can provide evidence of your capability',
        );
      });

      await test.step('Select option - Yes', async () => {
        await registrationPage.clickYesRadioButton();
        await registrationPage.clickContinueButton();
      });

      await test.step('Wait for medical conditions page', async () => {
        await registrationPage.expectNavigationTo('/register/scenario');
        await registrationPage.assertHeading(
          'Confirm coverage for standard medical scenarios',
        );
      });
    });
  });

  /**
   * @tests Test case 49617
   */
  test('Registration unsuccessful', async () => {
    await registrationPage.goto('fca');
    await registrationPage.fillFcaField('123456');
    await registrationPage.clickContinueButton();
    await registrationPage.fillUserDetails();
    await registrationPage.completeUserRegistration();

    const negativeScenarios = MEDICAL_SCENARIOS.map((scenario) => ({
      ...scenario,
      radioSelection: 'false',
    }));

    await test.step('Navigate to medical conditions coverage', async () => {
      await registrationPage.answerPreMedicalQuestions();
    });

    await test.step('Verify content', async () => {
      await registrationPage.verifyIntroContent();
    });

    await test.step('Navigate to medical scenarios', async () => {
      await registrationPage.clickContinueButton();
      await registrationPage.assertHeading('Metastatic Breast cancer');
    });

    for (let i = 0; i < negativeScenarios.length; i++) {
      const scenario = negativeScenarios[i];
      const isLast = i === negativeScenarios.length - 1;

      await test.step(`Process Scenario: ${scenario.title}`, async () => {
        await registrationPage.assertHeading(scenario.title);
        await registrationPage.completeMedicalScenario(scenario, i, isLast);
      });
    }

    await test.step('Registration unsuccessful', async () => {
      await registrationPage.submitForm();
      await registrationPage.expectNavigationTo('/register/unsuccessful');
      await registrationPage.assertHeading(
        'Your firm is not eligible to be listed',
      );
    });
  });

  /**
   * @tests Test case 48929
   */
  test('Registration successful', async () => {
    await registrationPage.goto('fca');
    await registrationPage.fillFcaField('123456');
    await registrationPage.clickContinueButton();
    await registrationPage.fillUserDetails();
    await registrationPage.completeUserRegistration();

    const positiveScenarios = MEDICAL_SCENARIOS.map((scenario) => ({
      ...scenario,
      radioSelection: 'true',
    }));

    await test.step('Navigate to medical conditions coverage', async () => {
      await registrationPage.answerPreMedicalQuestions();
    });

    await test.step('Verify content', async () => {
      await registrationPage.verifyIntroContent();
    });

    await test.step('Navigate to medical scenarios', async () => {
      await registrationPage.clickContinueButton();
      await registrationPage.assertHeading('Metastatic Breast cancer');
    });

    for (let i = 0; i < positiveScenarios.length; i++) {
      const scenario = positiveScenarios[i];
      const isLast = i === positiveScenarios.length - 1;

      await test.step(`Process Scenario: ${scenario.title}`, async () => {
        await registrationPage.assertHeading(scenario.title);
        await registrationPage.completeMedicalScenario(scenario, i, isLast);
      });
    }

    await test.step('Registration successful', async () => {
      await registrationPage.submitForm();
      await registrationPage.expectNavigationTo('/register/success');
    });
  });

  /**
   * @tests Test cases 49609, 49593, 49589
   */
  test('Save and come back later', async () => {
    await test.step('Enter FCA number', async () => {
      await registrationPage.goto('fca');
      await registrationPage.fillFcaField('123456');
      await registrationPage.clickContinueButton();
    });

    await test.step('Register user', async () => {
      await registrationPage.fillUserDetails();
      await registrationPage.completeUserRegistration();
    });

    await test.step('Save and come back later', async () => {
      await registrationPage.clickSaveAndComeBackButton();
      await registrationPage.expectNavigationTo('/register/save');
      await registrationPage.assertHeading('Save and come back later');
      await registrationPage.clickSaveAndSendButton();
      await registrationPage.expectNavigationTo('/register/save-success');
    });

    await test.step('Resend email', async () => {
      await registrationPage.clickSendAgainButton();
    });
  });
});
