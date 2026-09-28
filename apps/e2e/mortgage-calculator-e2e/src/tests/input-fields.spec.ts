import testData from '../data/mortgageData.json';
import { expect, test } from '../lib/test.lib';
const languages = ['en', 'cy'] as const;

const initialInterestRate = '3.75';

for (const language of languages) {
  test.describe('Mortgage Calculator', () => {
    /**
     * @tests 58368 - Verify initial Interest Rate
     * @tests 58374 - Accepts 2 integers after decimal point
     * @tests 58373 - Accepts maximum inputs
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Verify initial interest rate - ${language}`, async ({
      page,
      calculatorInput,
    }) => {
      await page.goto(`${language}`);
      await expect(calculatorInput.interestRate).toHaveValue(
        initialInterestRate,
      );
    });

    test(`Accepts 2 integers after decimal point - ${language}`, async ({
      page,
      calculatorInput,
    }) => {
      await page.goto(`${language}`);

      await calculatorInput.propertyPrice.fill(
        testData.decimalPoint.propertyInput,
      );
      await calculatorInput.deposit.fill(testData.decimalPoint.depositInput);

      await expect(calculatorInput.propertyPrice).toHaveValue(
        testData.decimalPoint.propertyResult,
      );
      await expect(calculatorInput.deposit).toHaveValue(
        testData.decimalPoint.depositResult,
      );
    });

    test(`Accepts maximum inputs - ${language}`, async ({
      page,
      calculatorInput,
    }) => {
      await page.goto(`${language}`);

      await calculatorInput.propertyPrice.pressSequentially(
        testData.maximumInput.propertyPrice,
      );
      await calculatorInput.deposit.pressSequentially(
        testData.maximumInput.depositPrice,
      );
      await calculatorInput.mortgageTerm.selectOption(
        testData.maximumInput.mortgageTerm,
      );
      await calculatorInput.interestRate.fill(
        testData.maximumInput.interestRate,
      );

      await expect(calculatorInput.propertyPrice).toHaveValue(
        testData.maximumInput.propertyResult,
      );
      await expect(calculatorInput.deposit).toHaveValue(
        testData.maximumInput.depositResult,
      );
    });
  });
}
