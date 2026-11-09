import { expect, test } from '@lib/test.lib';

test.describe('calculations', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 50955 - Calculator produces correct results when submitted (£1 pot, age of 55)
   */
  test('Calculator produces correct results when submitted (£1 pot, age of 55)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('1');
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£0 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£0 as a taxable monthly income until you’re 120');
  });

  /**
   * @tests 50958 - Calculator produces correct results when submitted (£10,000 pot, age of 55)
   */
  test('Calculator produces correct results when submitted (£10,000 pot, age of 55)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('10000');
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£2,500 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£25 as a taxable monthly income until you’re 101');
  });

  /**
   * @tests 50959 - Calculator produces correct results when submitted (£250,000 pot, age of 55)
   */
  test('Calculator produces correct results when submitted (£250,000 pot, age of 55)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('250000');
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£62,500 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£791 as a taxable monthly income until you’re 85');
  });

  /**
   * @tests 50960 - Calculator produces correct results when submitted (£5,000,000 pot, age of 55)
   */
  test('Calculator produces correct results when submitted (£5,000,000 pot, age of 55)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('5000000');
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£1,250,000 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£15,941 as a taxable monthly income until you’re 85');
  });

  /**
   * @tests 50961 - Calculator produces correct results when submitted (£1 pot, age of 67)
   */
  test('Calculator produces correct results when submitted (£1 pot, age of 67)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('1');
    await adjustableIncomePage.ageInput.fill('67');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£0 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£0 as a taxable monthly income until you’re 120');
  });

  /**
   * @tests 50962 - Calculator produces correct results when submitted (£10,000 pot, age of 67)
   */
  test('Calculator produces correct results when submitted (£10,000 pot, age of 67)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('10000');
    await adjustableIncomePage.ageInput.fill('67');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£2,500 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£41 as a taxable monthly income until you’re 87');
  });

  /**
   * @tests 50963 - Calculator produces correct results when submitted (£250,000 pot, age of 67)
   */
  test('Calculator produces correct results when submitted (£250,000 pot, age of 67)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('250000');
    await adjustableIncomePage.ageInput.fill('67');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£62,500 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£1,133 as a taxable monthly income until you’re 85');
  });

  /**
   * @tests 50964 - Calculator produces correct results when submitted (£5,000,000 pot, age of 67)
   */
  test('Calculator produces correct results when submitted (£5,000,000 pot, age of 67)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('5000000');
    await adjustableIncomePage.ageInput.fill('67');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£1,250,000 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£22,716 as a taxable monthly income until you’re 85');
  });

  /**
   * @tests 50966 - Calculator produces correct results when submitted (£1 pot, age of 99)
   */
  test('Calculator produces correct results when submitted (£1 pot, age of 99)', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto();

    await adjustableIncomePage.potInput.fill('1');
    await adjustableIncomePage.ageInput.fill('99');
    await adjustableIncomePage.submitButton.click();

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£0 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£0 as a taxable monthly income until you’re 100');
  });

  /**
   * @tests 50970 - The calculator can recalculate with new figures
   */
  test('The calculator can recalculate with new figures', async ({
    adjustableIncomePage,
    page,
  }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('150');
    await adjustableIncomePage.ageInput.fill('55');
    await adjustableIncomePage.submitButton.click();
    await page.waitForURL(/&age=55/);

    await adjustableIncomePage.potInput.fill('10000');
    await adjustableIncomePage.ageInput.fill('65');
    await adjustableIncomePage.submitButton.click();
    await page.waitForURL(/&age=65/);

    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect
      .poll(() => adjustableIncomePage.tableData.taxFreeValue)
      .toBe('£2,500 as a one-off tax-free lump sum');

    await expect
      .poll(() => adjustableIncomePage.tableData.incomeValue)
      .toBe('£41 as a taxable monthly income until you’re 85');
  });
});
