import { expect, test } from '@lib/test.lib';

test.describe('Calculations', () => {
  test.beforeEach(async ({ app, setCookieControl }) => {
    await setCookieControl();
    await app.goto();
  });

  /**
   * @tests 47829 - Calculator produces correct results when submitted (no income and low pot value should be no tax)
   */
  test('Calculator produces correct results when submitted (no income and low pot value should be no tax)', async ({
    app,
  }) => {
    await app.incomeField.fill('0');
    await app.potField.fill('1');

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 500 });

        return (
          (await app.resultsData.potValue) === '£1' &&
          (await app.resultsData.taxValue) === '£0 in tax'
        );
      })
      .toBeTruthy();
    await expect(app.resultsContainer).toBeVisible();
  });

  /**
   * @tests 47828 - Calculator produces correct results when submitted (has income and low pot value should be no tax)
   */
  test('Calculator produces correct results when submitted (has income and low pot value should be no tax)', async ({
    app,
  }) => {
    await app.incomeField.fill('25000');
    await app.potField.fill('1');

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 500 });

        return (
          (await app.resultsData.potValue) === '£1' &&
          (await app.resultsData.taxValue) === '£0 in tax'
        );
      })
      .toBeTruthy();
    await expect(app.resultsContainer).toBeVisible();
  });

  /*
   * @tests 47827 - Calculator produces correct results when submitted (has income and has pot value should have tax)
   */
  test('Calculator produces correct results when submitted (has income and has pot value should have tax)', async ({
    app,
  }) => {
    await app.incomeField.fill('25000');
    await app.potField.fill('2000');

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 500 });

        return (
          (await app.resultsData.potValue) === '£1,700' &&
          (await app.resultsData.taxValue) === '£300 in tax'
        );
      })
      .toBeTruthy();
    await expect(app.resultsContainer).toBeVisible();
  });

  /**
   * @tests 47826 - Calculator produces correct results when submitted (low income and has pot value should have tax)
   */
  test('Calculator produces correct results when submitted (low income and has pot value should have tax)', async ({
    app,
  }) => {
    await app.incomeField.fill('0');
    await app.potField.fill('250000');

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 500 });

        return (
          (await app.resultsData.potValue) === '£179,422' &&
          (await app.resultsData.taxValue) === '£70,578 in tax'
        );
      })
      .toBeTruthy();
    await expect(app.resultsContainer).toBeVisible();
  });

  /**
   * @tests 47839 - The calculator can recalculate with new figures
   */
  test('The calculator can recalculate with new figures', async ({
    app,
    page,
  }) => {
    await app.incomeField.fill('10000');
    await app.potField.fill('10000');
    await app.submitButton.click({ delay: 500 });

    await page.waitForURL(/\?income=10/);

    await app.incomeField.fill('20000');
    await app.potField.fill('20000');

    await expect
      .poll(async () => {
        await app.submitButton.click({ delay: 500 });

        return (
          (await app.resultsData.potValue) === '£17,000' &&
          (await app.resultsData.taxValue) === '£3,000 in tax'
        );
      })
      .toBeTruthy();
    await expect(app.resultsContainer).toBeVisible();
  });
});
