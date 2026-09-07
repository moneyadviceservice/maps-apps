import { expect, test } from 'lib/test.lib';

/**
 * @tests 47460 - Calculator pre-populates fields when loading from a static URL
 */
test.describe('Persistence', () => {
  test('Calculator pre-populates fields when loading from a static URL', async ({
    app,
  }) => {
    const data = {
      pot: '123',
      monthly: '456',
    };

    await app.goto(`?pot=${data.pot}&month=${data.monthly}#results`);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.monthlyField).toHaveAttribute('value', data.monthly);
    await expect(app.updateField).toHaveAttribute('value', data.monthly);

    expect(await app.resultsTableData).toStrictEqual([
      '£5,599',
      '£11,239',
      '£17,048',
      '£23,031',
      '£29,194',
    ]);
  });
});
