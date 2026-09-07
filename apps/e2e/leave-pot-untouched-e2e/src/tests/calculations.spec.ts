import { expect, test } from 'lib/test.lib';

const scenarios = [
  {
    pot: '25000',
    monthly: '500',
    expectedResults: ['£31,750', '£38,702', '£45,864', '£53,239', '£60,837'],
  },
  {
    pot: '55000',
    monthly: '250',
    expectedResults: ['£59,650', '£64,439', '£69,373', '£74,454', '£79,687'],
  },
  {
    pot: '999999',
    monthly: '15000',
    expectedResults: [
      '£1,209,999',
      '£1,426,299',
      '£1,649,088',
      '£1,878,561',
      '£2,114,917',
    ],
  },
  {
    pot: '1000',
    monthly: '0',
    expectedResults: ['£1,030', '£1,061', '£1,093', '£1,126', '£1,159'],
  },
];

test.describe('Calculations', () => {
  /**
   * @tests 47463 - Calculator produces correct results when submitted
   * @tests 47464 - Calculator produces correct results when submitted (no monthly payment)
   */
  scenarios.forEach((data) => {
    test(`Calculator produces correct results when submitted, pot value: ${data.pot}`, async ({
      app,
    }) => {
      await app.goto();
      await app.potField.fill(data.pot);
      await app.monthlyField.fill(data.monthly);
      await app.submitButton.click();
      expect(await app.resultsTableData).toStrictEqual(data.expectedResults);
    });
  });

  /**
   * @tests 47609 - Update fields and resubmit should update the results table (currently in pot)
   */
  test(`Update fields and resubmit should update the results table (currently in pot)`, async ({
    app,
    page,
  }) => {
    await app.goto();
    await app.potField.fill('25000');
    await app.monthlyField.fill('500');
    await app.submitButton.click();
    await page.waitForURL(/[?&]month=500/);

    await app.potField.fill('10000');
    await app.submitButton.click();
    // MoneyInput serialises thousands with a comma (`10%2C000`); pot may not be first.
    await page.waitForURL(/[?&]pot=10(%2C|,)?000/);

    expect(await app.resultsTableData).toStrictEqual([
      '£16,300',
      '£22,789',
      '£29,473',
      '£36,357',
      '£43,448',
    ]);
  });

  /**
   * @tests 47608 - Update fields and resubmit should update the results table (currently in pot)
   */
  test(`Update fields and resubmit should update the results table (paying in monthly, initial field)`, async ({
    app,
    page,
  }) => {
    await app.goto();
    await app.potField.fill('10000');
    await app.monthlyField.fill('500');
    await app.submitButton.click();
    await page.waitForURL(/[?&]month=500/);

    await app.monthlyField.fill('250');
    await app.submitButton.click();
    await page.waitForURL(/[?&]month=250/);

    expect(await app.resultsTableData).toStrictEqual([
      '£13,300',
      '£16,699',
      '£20,200',
      '£23,806',
      '£27,520',
    ]);
  });

  /**
   * @tests 47610 - Update fields and resubmit should update the results table (currently in pot)
   */
  test(`Update fields and resubmit should update the results table (paying monthly, try paying different amount field)`, async ({
    app,
    page,
  }) => {
    await app.goto();
    await app.potField.fill('10000');
    await app.monthlyField.fill('500');
    await app.submitButton.click();
    await page.waitForURL(/[?&]month=500/);

    await app.updateField.fill('250');
    await page.waitForURL(/[?&]month=250/);

    expect(await app.resultsTableData).toStrictEqual([
      '£13,300',
      '£16,699',
      '£20,200',
      '£23,806',
      '£27,520',
    ]);
  });
});
