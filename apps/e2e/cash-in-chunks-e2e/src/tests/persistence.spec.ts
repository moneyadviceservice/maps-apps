import { expect, test } from '@lib/test.lib';

test.describe('Persistence', () => {
  const data = {
    income: '123',
    pot: '456',
    chunk: '5,000',
  };

  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 48338 - Calculator pre-populates fields when loading from a static url (income param)
   */
  test('Calculator pre-populates fields when loading from a static URL (income param)', async ({
    app,
  }) => {
    await app.goto(`?income=${data.income}`);
    await expect(app.incomeField).toHaveAttribute('value', data.income);
  });

  /**
   * @tests 48339 - Calculator pre-populates fields when loading from a static url (pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (pot param)', async ({
    app,
  }) => {
    await app.goto(`?pot=${data.pot}`);
    await expect(app.potField).toHaveAttribute('value', data.pot);
  });

  /**
   * @tests 48340 - Calculator pre-populates fields when loading from a static url (chunk param)
   */
  test('Calculator pre-populates fields when loading from a static url (chunk param)', async ({
    app,
  }) => {
    await app.goto(`?pot=${data.chunk}`);
    await expect(app.potField).toHaveAttribute('value', data.chunk);
  });

  /**
   * @tests 48341 - Calculator pre-populates fields when loading from a static url (income and pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (income and pot param)', async ({
    app,
  }) => {
    await app.goto(`?income=${data.income}&pot=${data.pot}`);
    await expect(app.incomeField).toHaveAttribute('value', data.income);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.submitButton).toHaveText('Calculate');
  });

  /**
   * @tests 48342 - Calculator pre-populates fields when loading from a static url (income and chunk param)
   */
  test('Calculator pre-populates fields when loading from a static url (income and chunk param)', async ({
    app,
  }) => {
    await app.goto(`?income=${data.income}&chunk=${data.chunk}`);
    await expect(app.incomeField).toHaveAttribute('value', data.income);
    await expect(app.chunkField).toHaveAttribute('value', data.chunk);
    await expect(app.submitButton).toHaveText('Calculate');
  });

  /**
   * @tests 48343 - Calculator pre-populates fields when loading from a static url (income and chunk param)
   */
  test('Calculator pre-populates fields when loading from a static url (pot and chunk param)', async ({
    app,
  }) => {
    await app.goto(`?pot=${data.pot}&chunk=${data.chunk}`);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.chunkField).toHaveAttribute('value', data.chunk);
    await expect(app.submitButton).toHaveText('Calculate');
  });

  /**
   * @tests 48344 - Calculator pre-populates fields when loading from a static url (income and chunk param)
   */
  test('Calculator pre-populates fields when loading from a static url (income, pot and chunk param)', async ({
    app,
  }) => {
    await app.goto(
      `?income=${data.income}&chunk=${data.chunk}&pot=${data.pot}`,
    );
    await expect(app.incomeField).toHaveAttribute('value', data.income);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.chunkField).toHaveAttribute('value', data.chunk);
    await expect(app.submitButton).toHaveText('Calculate');
  });
});
