import { expect, test } from '@lib/test.lib';

test.describe('calculations', () => {
  /**
   * @tests 47936 - Calculator produces correct results when submitted (pot: £1 and age: 55, should be not tax)
   */
  test('Calculator produces correct results when submitted (pot: £1 and age: 55, should be not tax)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('1');
    await app.ageField.fill('55');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£0 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£0 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47937 - Calculator produces correct results when submitted (pot: £100 and age: 55, should be £25 tax free)
   */
  test('Calculator produces correct results when submitted (pot: £100 and age: 55, should be £25 tax free)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('100');
    await app.ageField.fill('55');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£25 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£0 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47938 - Calculator produces correct results when submitted (pot: £25,000 and age: 55, should be £6,250 tax free)
   */
  test('Calculator produces correct results when submitted (pot: £25,000 and age: 55, should be £6,250 tax free)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('25000');
    await app.ageField.fill('55');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£6,250 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£1,200 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47939 - Calculator produces correct results when submitted (pot: £25,000 and age: 55, should be £6,250 tax free)
   */
  test('Calculator produces correct results when submitted (pot: £1 and age: 75, should be £0 tax free)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('1');
    await app.ageField.fill('75');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£0 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£0 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47940 - Calculator produces correct results when submitted (pot: £25,000 and age: 55, should be £6,250 tax free)
   */
  test('Calculator produces correct results when submitted (pot: £250,000 and age: 75, should be £62,500 tax free)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('250000');
    await app.ageField.fill('75');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£62,500 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£18,000 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47941 - Calculator produces correct results when submitted (pot: £25,000 and age: 55, should be £6,250 tax free)
   */
  test('Calculator produces correct results when submitted (pot: £1,250,000 and age: 62, should be £312,500 tax free)', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('1250000');
    await app.ageField.fill('62');
    await app.submitButton.click();

    expect(await app.tableData.potValue).toBe(
      '£312,500 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£63,100 as a fixed taxable income each year',
    );
  });

  /**
   * @tests 47947 - The calculator can recalculate with new figures
   */
  test.skip('Recalculations', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('150');
    await app.ageField.fill('55');
    await app.submitButton.click();
    await page.waitForURL(/&age=55/);

    await app.potField.fill('10000');
    await app.ageField.fill('65');
    await app.submitButton.click();
    await page.waitForURL(/&age=65/);

    await expect(app.taxFreeText).not.toHaveText(
      '£37 as a one-off tax-free lump sum',
    );

    expect(await app.tableData.potValue).toBe(
      '£2,500 as a one-off tax-free lump sum',
    );
    expect(await app.tableData.taxValue).toBe(
      '£600 as a fixed taxable income each year',
    );
  });
});
