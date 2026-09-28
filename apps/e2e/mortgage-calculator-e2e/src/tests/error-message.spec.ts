import { ErrorComponent } from '@pages/components/error.component';

import testData from '../data/mortgageData.json';
import { expect, test } from '../lib/test.lib';
const languages = ['en', 'cy'] as const;

async function validateError(
  errorComponent: ErrorComponent,
  errorTitle: string,
  errorMessage: string,
) {
  await expect(errorComponent.errorBox).toBeVisible();
  await expect(errorComponent.errorTitle).toContainText(errorTitle);
  await expect(errorComponent.errorMessage).toContainText(errorMessage);
  await expect(errorComponent.errorMessage).toHaveAttribute('href');
}

for (const language of languages) {
  test.describe('Mortgage Calculator', () => {
    /**
     * @tests 58369 - Validate error message
     * @tests 58370 - Does not accept negative values
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Validate error message rate - ${language}`, async ({
      page,
      calculatorInput,
      errorComponent,
    }) => {
      await page.goto(`${language}`);
      await calculatorInput.interestRate.clear();
      await calculatorInput.calculateButton.click();

      await validateError(
        errorComponent,
        testData.handlesError.errorText[language].title,
        testData.handlesError.errorText[language].message,
      );
    });

    test(`Does not accept negative values - ${language}`, async ({
      page,
      calculatorInput,
      errorComponent,
    }) => {
      await page.goto(`${language}`);

      await calculatorInput.propertyPrice.pressSequentially(
        testData.handlesError.negativeValues.propertyPrice,
      );
      await calculatorInput.deposit.pressSequentially(
        testData.handlesError.negativeValues.depositPrice,
      );
      await calculatorInput.mortgageTerm.selectOption(
        testData.handlesError.negativeValues.mortgageTerm,
      );
      await calculatorInput.interestRate.pressSequentially(
        testData.handlesError.negativeValues.interestRate,
      );
      await calculatorInput.calculateButton.click();

      await expect(calculatorInput.propertyPrice).toBeEmpty();
      await expect(calculatorInput.deposit).toBeEmpty();

      await validateError(
        errorComponent,
        testData.handlesError.errorText[language].title,
        testData.handlesError.errorText[language].message,
      );
    });
  });
}
