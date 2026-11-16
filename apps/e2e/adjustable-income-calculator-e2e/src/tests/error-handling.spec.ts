import { expect, test } from '@lib/test.lib';

test.describe('error handling', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 50971 - Attempting to calculate without populating any fields, shows the correct error messages
   */
  test('Attempting to calculate without populating any fields, shows the correct error messages', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('');
    await adjustableIncomePage.potInput.fill('');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage1,
    ).toHaveText('How much is your pension currently worth? - Enter a figure');
    await expect(adjustableIncomePage.potErrorLabel).toHaveText(
      'Enter a figure',
    );
  });

  /**
   * @tests 50972 - Attempting to calculate without populating pot field, shows the correct error messages
   */
  test('Attempting to calculate without populating pot field, shows the correct error messages', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.potInput.fill('');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage1,
    ).toHaveText('How much is your pension currently worth? - Enter a figure');
    await expect(adjustableIncomePage.potErrorLabel).toHaveText(
      'Enter a figure',
    );
  });

  /**
   * @tests 50976 - Attempting to calculate with an age of 66 and a pot value of £0, shows the correct error message (pot too low)
   */
  test('Attempting to calculate with an age of 66 and a pot value of £0, shows the correct error message (pot too low)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('66');
    await adjustableIncomePage.potInput.fill('0');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage1,
    ).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );

    await expect(adjustableIncomePage.potErrorLabel).toHaveText(
      'Amount must be at least £1',
    );
  });

  /**
   * @tests 50974 - Attempting to calculate with an age of 25 and a pot value of £0, shows the correct error message (age too low, pot value too low)
   */
  test('Attempting to calculate with an age of 25 and a pot value of £0, shows the correct error message (age too low, pot value too low)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('25');
    await adjustableIncomePage.potInput.fill('0');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage1,
    ).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage2,
    ).toHaveText(
      'What age do you want to start taking money? - Enter the age you’d like to retire, from 55 to 99',
    );
    await expect(adjustableIncomePage.potErrorLabel).toHaveText(
      'Amount must be at least £1',
    );
    await expect(adjustableIncomePage.ageErrorLabel).toHaveText(
      'Enter the age you’d like to retire, from 55 to 99',
    );
  });

  /**
   * @tests 50975 - Attempting to calculate with an age of 25 and a pot value of £50,000, shows the correct error message (age too low)
   */
  test('Attempting to calculate with an age of 25 and a pot value of £50,000, shows the correct error message (age too low)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('25');
    await adjustableIncomePage.potInput.fill('50000');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(adjustableIncomePage.ageErrorLabel).toHaveText(
      'Enter the age you’d like to retire, from 55 to 99',
    );
  });

  /**
   * @tests 50978 - Attempting to calculate with an age of 75 and a pot value of £5,000,001 shows the correct error message (pot value too high)
   */
  test('Attempting to calculate with an age of 75 and a pot value of £5,000,001 shows the correct error message (pot value too high)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.ageInput.fill('75');
    await adjustableIncomePage.potInput.fill('5000001');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.errorHeader).toBeVisible();
    await expect(
      adjustableIncomePage.errorMessageLinks.errorMessage1,
    ).toHaveText(
      'How much is your pension currently worth? - Amount must be less than £5,000,000',
    );
    await expect(adjustableIncomePage.potErrorLabel).toHaveText(
      'Amount must be less than £5,000,000',
    );
  });
});
