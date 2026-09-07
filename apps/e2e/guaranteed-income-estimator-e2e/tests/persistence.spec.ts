import { expect, test } from '../lib/test.lib';

test.describe('Persistence', () => {
  const data = {
    pot: '123',
    age: '60',
  };

  /**
   * @tests 47933 - Calculator pre-populates fields when loading from a static url (pot param)
   */

  test('Calculator pre-populates fields when loading from a static URL (pot param)', async ({
    app,
  }) => {
    await app.goto(`?pot=${data.pot}`);
    await expect(app.potField).toHaveAttribute('value', data.pot);
  });

  /**
   * @tests 47934 - Calculator pre-populates fields when loading from a static url (age param)
   */
  test('Calculator pre-populates fields when loading from a static URL (age param)', async ({
    app,
  }) => {
    await app.goto(`?age=${data.age}`);
    await expect(app.ageField).toHaveAttribute('value', data.age);

    await expect(app.submitButton).toHaveText('Calculate');
  });

  /**
   * @tests 47935 - Calculator pre-populates fields when loading from a static url (pot and age param)
   */
  test('Calculator pre-populates fields when loading from a static URL (income and pot param)', async ({
    app,
  }) => {
    await app.goto(`?age=${data.age}&pot=${data.pot}`);
    await expect(app.ageField).toHaveAttribute('value', data.age);
    await expect(app.potField).toHaveAttribute('value', data.pot);
    await expect(app.submitButton).toHaveText('Recalculate');
  });
});
