import { expect, test } from '@lib/test.lib';

test.describe('Persistence', () => {
  const data = {
    pot: '456',
    age: '60',
  };

  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 50814 - Calculator pre-populates fields when loading from a static url (pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (pot param)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(`?pot=${data.pot}`);
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'value',
      data.pot,
    );
  });

  /**
   * @tests 50948 - Calculator pre-populates fields when loading from a static url (age param)
   */
  test('Calculator pre-populates fields when loading from a static url (age param)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(`?pot=${data.pot}`);
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'value',
      data.pot,
    );
  });

  /**
   * @tests 48341 - Calculator pre-populates fields when loading from a static url (age and pot param)
   */
  test('Calculator pre-populates fields when loading from a static URL (pot and age param)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(`?age=${data.age}&pot=${data.pot}`);
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'value',
      data.age,
    );
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'value',
      data.pot,
    );
  });
});
