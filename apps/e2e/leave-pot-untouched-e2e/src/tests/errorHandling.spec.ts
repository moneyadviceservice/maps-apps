import { expect, test } from 'lib/test.lib';

test.describe('Leave Pot Untouched Calculator validation logic', () => {
  /**
   * @tests 47485 - When zero is submitted as the pot value, the correct error shows up
   */
  test('input £0', async ({ app }) => {
    await app.goto();
    await app.potField.fill('0');
    await app.monthlyField.fill('');
    await app.submitButton.click();
    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorHeaderMessage).toHaveText(
      'How much is your pension currently worth? - Amount must be at least £1',
    );
  });

  /**
   * @tests 47486 - When no values are populated in the fields and it's submitted, the correct error shows up
   */
  test('no input', async ({ app }) => {
    await app.goto();
    await app.potField.fill('');
    await app.monthlyField.fill('');
    await app.submitButton.click();
    await expect(app.errorHeader).toBeVisible();
    await expect(app.errorHeaderMessage).toHaveText(
      'How much is your pension currently worth? - Enter a figure',
    );
    await expect(app.errorHeaderLink).toHaveAttribute('href', /.*#pot$/);
  });
});
