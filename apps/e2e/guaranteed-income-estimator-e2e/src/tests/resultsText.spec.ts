import { expect, test } from '@lib/test.lib';

test.describe('results copy text', () => {
  test('shows updated shared results heading copy', async ({ app }) => {
    await app.goto();

    await app.potField.fill('25000');
    await app.ageField.fill('55');
    await app.submitButton.click();

    await expect(app.resultsHeading).toHaveText(
      /Converting a pension worth\s*£25,000\s*into a guaranteed income for life \(an annuity\) could give you an estimated:/,
    );
  });

  test('shows updated assumptions callout copy', async ({ app }) => {
    await app.goto();

    await app.potField.fill('25000');
    await app.ageField.fill('55');
    await app.submitButton.click();

    await expect(app.resultsSection).toContainText('This estimate assumes:');
    await expect(app.resultsSection).toContainText(
      '25% of your pension is taken as a tax-free lump sum first and',
    );
    await expect(app.resultsSection).toContainText(
      'the fixed income will stop when you die, called a single-life annuity.',
    );
  });

  test('renders assumptions copy before explanatory results text', async ({
    app,
  }) => {
    await app.goto();

    await app.potField.fill('25000');
    await app.ageField.fill('55');
    await app.submitButton.click();

    const resultsText = await app.getResultsText();

    expect(resultsText).toContain('This estimate assumes:');
    expect(resultsText).toContain(
      'It does not consider the effect of inflation or any Income Tax you might pay on the income.',
    );

    expect(
      resultsText.indexOf('This estimate assumes:') <
        resultsText.indexOf(
          'It does not consider the effect of inflation or any Income Tax you might pay on the income.',
        ),
    ).toBe(true);
  });
});
