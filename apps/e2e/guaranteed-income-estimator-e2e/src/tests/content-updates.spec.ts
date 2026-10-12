import { expect, test } from '@lib/test.lib';

/**
 * @tests 54824 - Update content on guaranteed income calculator
 * @test 58736 : 54818 AC1 TEST CASE 1: Content update on the guaranteed income calculator EN
 * @test 58737 : 54818 AC2 TEST CASE 2: Content update on the guaranteed income calculator CY
 */
test.describe('Guaranteed Income Estimator - Content Updates', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('AC1: Content update on the guaranteed income calculator EN', async ({
    app,
  }) => {
    await app.goto('', { ignoreCookiesBanner: true });
    await app.verifyEnglishHeadingAndLabels();
    await app.potField.fill('5600');
    await app.ageField.fill('66');
    await app.submitButton.click();
    await expect(app.resultsSection).toBeVisible();
    await app.verifyEnglishResults();
  });

  test('AC2: Content update on the guaranteed income calculator CY', async ({
    app,
    page,
  }) => {
    await page.goto('/cy/guaranteed-income-estimator');
    await app.verifyWelshHeadingAndLabels();
    await app.potField.fill('5600');
    await app.ageField.fill('66');
    await app.submitButton.click();
    await expect(app.resultsSection).toBeVisible();
    await app.verifyWelshResults();
  });
});
