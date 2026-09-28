import { expect, test } from '@lib/test.lib';

test.describe('error handling', () => {
  /**
   * @tests 47942 - When fields are not populated and user attempts to calculate, the correct error should appear
   */
  test('input empty', async ({ app }) => {
    await app.goto();
    await app.potField.fill('');
    await app.ageField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'What age do you want the income to start? - Enter a figure',
    );
    await expect(app.potErrorLabel).toHaveText('Enter a figure');
    await expect(app.ageErrorLabel).toHaveText('Enter a figure');
  });

  /**
   * @tests 47943 - When the pot field is populated but there is no age field value, the correct error should appear
   */
  test('age input empty', async ({ app }) => {
    await app.goto();
    await app.potField.fill('150');
    await app.ageField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What age do you want the income to start? - Enter a figure',
    );
    await expect(app.ageErrorLabel).toHaveText('Enter a figure');
  });

  /**
   * @tests 47944 - When the pot field is populated but there is no age field value, the correct error should appear
   */
  test('pot input empty', async ({ app }) => {
    await app.goto();
    await app.potField.fill('');
    await app.ageField.fill('55');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.potErrorLabel).toHaveText('Enter a figure');
  });

  /**
   * @tests 47945 - When the age field is not within valid range (54), the correct error should appear
   */
  test('age input invalid', async ({ app }) => {
    await app.goto();
    await app.potField.fill('150');
    await app.ageField.fill('54');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What age do you want the income to start? - you can compare annuities on the MoneyHelper website',
    );
    await expect(app.ageErrorLabel).toHaveText(
      'You must be aged 55 to 75 - you can compare annuities on the MoneyHelper website (opens in a new window) ',
    );
  });

  /**
   * @tests 47946 - When the age field is not within valid range (76), the correct error should appear
   */
  test('age input invalid #2', async ({ app }) => {
    await app.goto();
    await app.potField.fill('150');
    await app.ageField.fill('76');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What age do you want the income to start? - you can compare annuities on the MoneyHelper website',
    );
    await expect(app.ageErrorLabel).toHaveText(
      'You must be aged 55 to 75 - you can compare annuities on the MoneyHelper website (opens in a new window) ',
    );
  });
});
