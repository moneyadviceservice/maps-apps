import { expect, test } from '@lib/test.lib';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ app, setCookieControl }) => {
    await setCookieControl();
    await app.goto();
  });

  /**
   * @tests 48354 - Attempting to calculate without populating any fields, shows the correct error messages
   */
  test('input empty', async ({ app }) => {
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage3).toHaveText(
      'How much do you want to take as your first cash chunk? - Enter a figure',
    );
    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
    await expect(app.potErrorLabel).toHaveText('Enter a figure');
    await expect(app.chunkErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(3);
  });

  /**
   * @tests 48355 - Attempting to calculate without populating income field, shows the correct error messages
   */
  test('Attempting to calculate without populating income field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('');
    await app.potField.fill('123');
    await app.chunkField.fill('123');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );

    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });

  /**
   * @tests 48356 - Attempting to calculate without populating pot field, shows the correct error messages
   */
  test('Attempting to calculate without populating pot field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('123,456');
    await app.potField.fill('');
    await app.chunkField.fill('1,000');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );

    await expect(app.potErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });

  /**
   * @tests 48357 - Attempting to calculate without populating chunk field, shows the correct error messages
   */
  test('Attempting to calculate without populating chunk field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('123,456');
    await app.potField.fill('15,000');
    await app.chunkField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much do you want to take as your first cash chunk? - Enter a figure',
    );

    await expect(app.chunkErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });

  /**
   * @tests 48358 - Attempting to calculate without populating income and pot field, shows the correct error messages
   */
  test('Attempting to calculate without populating income and pot field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('');
    await app.potField.fill('');
    await app.chunkField.fill('15,000');
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
    await expect(app.allErrorMessageLinks).toHaveCount(2);
  });

  /**
   * @tests 48359 - Attempting to calculate without populating income and chunk field, shows the correct error messages
   */
  test('Attempting to calculate without populating income and chunk field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('');
    await app.potField.fill('15,000');
    await app.chunkField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'What is your yearly income? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much do you want to take as your first cash chunk? - Enter a figure',
    );

    await expect(app.incomeErrorLabel).toHaveText('Enter a figure');
    await expect(app.chunkErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(2);
  });

  /**
   * @tests 48360 - Attempting to calculate without populating pot and chunk field, shows the correct error messages
   */
  test('Attempting to calculate without populating pot and chunk field, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('15,000');
    await app.potField.fill('');
    await app.chunkField.fill('');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much do you want to take as your first cash chunk? - Enter a figure',
    );

    await expect(app.potErrorLabel).toHaveText('Enter a figure');
    await expect(app.chunkErrorLabel).toHaveText('Enter a figure');
    await expect(app.allErrorMessageLinks).toHaveCount(2);
  });

  /**
   * @tests 48361 - Attempting to calculate with £50,000 income, £15,000 pot, and £20,000 chunk, shows the correct error messages
   */
  test('Attempting to calculate with £50,000 income, £15,000 pot, and £20,000 chunk, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('50,000');
    await app.potField.fill('15,000');
    await app.chunkField.fill('20,000');
    await app.submitButton.click();

    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much do you want to take as your first cash chunk? - Amount must be less than your pension pot value',
    );

    await expect(app.chunkErrorLabel).toHaveText(
      'Amount must be less than your pension pot value',
    );
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });

  /**
   * @tests 48362 - Attempting to calculate with £0 income, £0 pot, and £0 chunk, shows the correct error messages
   */
  test('Attempting to calculate with £0 income, £0 pot, and £0 chunk, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('0');
    await app.potField.fill('0');
    await app.chunkField.fill('0');
    await app.submitButton.click();

    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );
    await expect(app.errorMessageLinks.errorMessage2).toHaveText(
      'How much do you want to take as your first cash chunk? - Amount must be at least £1',
    );

    await expect(app.potErrorLabel).toHaveText('Amount must be at least £1');
    await expect(app.chunkErrorLabel).toHaveText('Amount must be at least £1');
    await expect(app.allErrorMessageLinks).toHaveCount(2);
  });

  /**
   * @tests 48363 - Attempting to calculate with £0 income, £0 pot, and £100 chunk, shows the correct error messages
   */
  test('Attempting to calculate with £0 income, £0 pot, and £100 chunk, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('0');
    await app.potField.fill('0');
    await app.chunkField.fill('100');
    await app.submitButton.click();

    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );

    await expect(app.potErrorLabel).toHaveText('Amount must be at least £1');
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });

  /**
   * @tests 48366 - Attempting to calculate with £0 income, £0 pot, and £100 chunk, shows the correct error messages
   */
  test('Attempting to calculate with £52,000 income, £1 pot, and £0 chunk, shows the correct error messages', async ({
    app,
  }) => {
    await app.incomeField.fill('52,000');
    await app.potField.fill('1');
    await app.chunkField.fill('0');
    await app.submitButton.click();

    await expect(app.errorMessageLinks.errorMessage1).toHaveText(
      'How much do you want to take as your first cash chunk? - Amount must be at least £1',
    );

    await expect(app.chunkErrorLabel).toHaveText('Amount must be at least £1');
    await expect(app.allErrorMessageLinks).toHaveCount(1);
  });
});
