import { expect, test } from '@lib/test.lib';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ app, setCookieControl }) => {
    await setCookieControl();
    await app.goto();
  });

  /**
   * @tests 47835 - When fields are not populated and user attempts to calculate, the correct error should appear
   */
  test('input empty', async ({ app }) => {
    await app.incomeField.fill('');
    await app.potField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.potErrorLabel).toHaveText('Enter a figure');
    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
  });

  /**
   * @tests 47836 - When yearly income field is not populated and there is 0 in the pot field, the correct error should appear
   */
  test('pot input £0, income input empty', async ({ app }) => {
    await app.incomeField.fill('');
    await app.potField.fill('0');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );
    await expect(app.potErrorLabel).toHaveText('Amount must be at least £1');
    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
  });

  /**
   * @tests 47837 - When both fields are populated with 0, the correct error should appear
   */
  test('both inputs £0', async ({ app }) => {
    await app.incomeField.fill('0');
    await app.potField.fill('0');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );
    await expect(app.potErrorLabel).toHaveText('Amount must be at least £1');
  });

  /**
   * @tests 47838 - When only the pot field is populated, the correct error should appear
   */
  test('pot input £1, income input empty', async ({ app }) => {
    await app.incomeField.fill('');
    await app.potField.fill('1');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );
    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
  });
});
