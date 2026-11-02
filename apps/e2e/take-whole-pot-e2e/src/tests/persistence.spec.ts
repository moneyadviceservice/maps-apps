import { expect, test } from '@lib/test.lib';

test.describe('Persistence', () => {
  const data = {
    income: '123',
    pot: '456',
  };

  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 47832 - Calculator pre-populates fields when loading from a static url (pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (income param)', async ({
    app,
  }) => {
    await app.goto(`?income=${data.income}`);
    await expect(app.incomeField).toHaveAttribute('value', data.income);
  });

  /**
   * @tests 47831 - Calculator pre-populates fields when loading from a static url (income param)
   */
  test('Calculator pre-populates fields when loading from a static URL (pot param)', async ({
    app,
  }) => {
    await app.goto(`?pot=${data.pot}`);
    await expect(app.potField).toHaveAttribute('value', data.pot);
  });

  /**
   * @tests 47830 - Calculator pre-populates fields when loading from a static url (income and pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (income and pot param)', async ({
    app,
  }) => {
    await app.goto(`?income=${data.income}&pot=${data.pot}`);
    await expect(app.incomeField).toHaveAttribute('value', data.income);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.submitButton).toHaveText('Recalculate');
  });
});
