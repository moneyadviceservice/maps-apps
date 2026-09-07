import { expect, test } from '@lib/test.lib';

test.describe('Calculations', () => {
  test.beforeEach(async ({ app, setCookieControl }) => {
    await setCookieControl();
    await app.goto();
  });

  /**
   * @tests 48345 - Calculator produces correct results when submitted (£65,000 income, £15,000 pot, £1,000 chunk)
   */
  test('Calculator produces correct results when submitted (£65,000 income, £15,000 pot, £1,000 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '65,000',
      pot: '15,000',
      chunk: '1,000',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );
    expect(await app.tableData.takeValue).toBe('£700');
    expect(await app.tableData.taxValue).toBe('£300 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£14,000 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '1,000');
  });

  /**
   * @tests 48346 - Calculator produces correct results when submitted (£65,000 income, £15,000 pot, £1,000 chunk)
   */
  test('Calculator produces correct results when submitted (£65,000 income, £15,000 pot, £15,000 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '65,000',
      pot: '15,000',
      chunk: '15,000',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£10,500');
    expect(await app.tableData.taxValue).toBe('£4,500 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£0 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '15,000');
  });

  /**
   * @tests 48347 - Calculator produces correct results when submitted (£23,810 income, £5,000 pot, £1,000 chunk)
   */
  test('Calculator produces correct results when submitted (£23,810 income, £5,000 pot, £1,000 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '23,810',
      pot: '5,000',
      chunk: '1,000',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£850');
    expect(await app.tableData.taxValue).toBe('£150 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£4,000 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '1,000');
  });

  /**
   * @tests 48348 - Calculator produces correct results when submitted (£23,810 income, £5,000 pot, £5,000 chunk)
   */
  test('Calculator produces correct results when submitted (£23,810 income, £5,000 pot, £5,000 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '23,810',
      pot: '5,000',
      chunk: '5,000',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£4,250');
    expect(await app.tableData.taxValue).toBe('£750 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£0 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '5,000');
  });

  /**
   * @tests 48349 - Calculator produces correct results when submitted (£142,333 income, £13,333,333 pot, £250,000 chunk)
   */
  test('Calculator produces correct results when submitted (£142,333 income, £13,333,333 pot, £250,000 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '142,333',
      pot: '13,333,333',
      chunk: '250,000',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£165,625');
    expect(await app.tableData.taxValue).toBe('£84,375 in tax');
    expect(await app.tableData.remainingPotValue).toBe(
      '£13,083,333 in your pot',
    );
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '250,000');
  });

  /**
   * @tests 48350 - Calculator produces correct results when submitted (£142,333 income, £13,333,333 pot, £13,333,333 chunk)
   */
  test('Calculator produces correct results when submitted (£142,333 income, £13,333,333 pot, £13,333,333 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '142,333',
      pot: '13,333,333',
      chunk: '13,333,333',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£8,833,333');
    expect(await app.tableData.taxValue).toBe('£4,500,000 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£0 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '13,333,333');
  });

  /**
   * @tests 48351 - Calculator produces correct results when submitted (0 income, £1 pot, £13,333,333 chunk)
   */
  test('Calculator produces correct results when submitted (0 income, £1 pot, £13,333,333 chunk)', async ({
    app,
  }) => {
    const testData = {
      income: '0',
      pot: '1',
      chunk: '1',
    };

    await app.fillForm(testData);

    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    expect(await app.tableData.takeValue).toBe('£1');
    expect(await app.tableData.taxValue).toBe('£0 in tax');
    expect(await app.tableData.remainingPotValue).toBe('£0 in your pot');
    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveAttribute('value', '1');
  });

  /**
   * @tests 48352 - The calculator can recalculate with new figures (recalculate button)
   */
  test('The calculator can recalculate with new figures (recalculate button)', async ({
    app,
    page,
  }) => {
    const testData = { income: '15,000', pot: '15,000', chunk: '1,000' };

    await app.fillForm(testData);
    await page.waitForURL(/\?income=15/);

    const recalulateData = {
      income: '65,000',
      pot: '35,000',
      chunk: '25,000',
    };

    await app.incomeField.fill(recalulateData.income);
    await app.potField.fill(recalulateData.pot);
    await app.chunkField.fill(recalulateData.chunk);
    await expect(app.tableLabel).toHaveText(
      `If you take £${testData.chunk} from your £${testData.pot} pot, you could get:`,
    );

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 1_000 });

        return (
          (await app.tableData.takeValue) === '£17,500' &&
          (await app.tableData.taxValue) === '£7,500 in tax' &&
          (await app.tableData.remainingPotValue) === '£10,000 in your pot'
        );
      })
      .toBeTruthy();

    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveValue('25,000');
    await expect(app.tableLabel).toHaveText(
      `If you take £${recalulateData.chunk} from your £${recalulateData.pot} pot, you could get:`,
    );
  });

  /**
   * @tests 48353 - The calculator can recalculate with new figures (update chunk field)
   */
  test('The calculator can recalculate with new figures (update chunk field)', async ({
    app,
    page,
  }) => {
    const data = { income: '15,000', pot: '15,000', chunk: '1,000' };
    const newChunkValue = '7,500';

    await app.fillForm(data);
    await page.waitForURL(/\?income=15/);

    await app.updateField.fill(newChunkValue);
    await expect(app.tableLabel).toHaveText(
      `If you take £${data.chunk} from your £${data.pot} pot, you could get:`,
    );

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 1_000 });

        return (
          (await app.tableData.takeValue) === '£6,375' &&
          (await app.tableData.taxValue) === '£1,125 in tax' &&
          (await app.tableData.remainingPotValue) === '£7,500 in your pot'
        );
      })
      .toBeTruthy();

    await expect(app.updateLabel).toBeVisible();
    await expect(app.updateField).toHaveValue('7,500');
    await expect(app.tableLabel).toHaveText(
      `If you take £${newChunkValue} from your £${data.pot} pot, you could get:`,
    );
  });
});
