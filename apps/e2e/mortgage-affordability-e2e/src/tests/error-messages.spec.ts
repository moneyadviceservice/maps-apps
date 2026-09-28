import { expect, test } from '@lib/test.lib';

import testData from '../data/mortgageAffordabilityCalculator.json';

test.describe('Mortgage Affordability', () => {
  /**
   * @tests 57514 - Verify Error Messages on annual income
   * @tests 57516 - Interest Rate Above 16%
   * @tests 57515 - Mortgage Amount Above Range
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test(`Verify error messages on annual income`, async ({
    page,
    annualIncomeComponent,
  }) => {
    await page.goto(`/en/annual-income`);
    await expect(
      await annualIncomeComponent.secondApplicantCheckbox('no'),
    ).toHaveAttribute('checked');

    await (
      await annualIncomeComponent.secondApplicantRadioButton('yes')
    ).click();
    await annualIncomeComponent.continueButton.click();
    await expect(await annualIncomeComponent.errorMessage(0)).toContainText(
      testData.core.annualErrors.incomeError,
    );
    await expect(await annualIncomeComponent.errorMessage(1)).toContainText(
      testData.core.annualErrors.monthlyError,
    );
    await expect(await annualIncomeComponent.errorMessage(2)).toContainText(
      testData.core.annualErrors.secondIncomeError,
    );
    await expect(await annualIncomeComponent.errorMessage(3)).toContainText(
      testData.core.annualErrors.secondMonthlyError,
    );
  });

  test(`Verify error message on results page when user enters the mortgage amount above offered range`, async ({
    page,
    annualIncomeComponent,
    monthlyCostsComponent,
    successfulResultsComponent,
  }) => {
    const data = testData.core.resultsErrorOne;

    await page.goto(`/en/annual-income`);
    await annualIncomeComponent.incomeInput.fill(data.annualIncome);
    await annualIncomeComponent.takeHomeInput.fill(data.takeHome);
    await annualIncomeComponent.continueButton.click();

    await monthlyCostsComponent.rentMortgageInput.fill(data.mortgage);
    await monthlyCostsComponent.creditCardInput.fill(data.creditCard);
    await monthlyCostsComponent.childAndSpouseInput.fill(data.childCare);
    await monthlyCostsComponent.childcareInput.fill(data.travelCosts);
    await monthlyCostsComponent.travelInput.fill(data.travelCosts);
    await monthlyCostsComponent.billsInsuranceInput.fill(data.groceries);
    await monthlyCostsComponent.entertainmentInput.fill(data.entertainment);
    await monthlyCostsComponent.holidaysInput.fill(data.holidays);
    await monthlyCostsComponent.continueButton.click();

    await successfulResultsComponent.mortgageAmountInput.fill(
      data.mortgageAmount,
    );
    await successfulResultsComponent.updateResultsButton.click();
    await expect(successfulResultsComponent.errorMessage).toContainText(
      data.errorMessage,
    );
  });

  test(`Verify error message on results page when user enters interest rate above 16%`, async ({
    page,
    annualIncomeComponent,
    monthlyCostsComponent,
    successfulResultsComponent,
  }) => {
    const data = testData.core.resultsErrorTwo;

    await page.goto(`/en/annual-income`);
    await annualIncomeComponent.incomeInput.fill(data.annualIncome);
    await annualIncomeComponent.takeHomeInput.fill(data.takeHome);
    await annualIncomeComponent.continueButton.click();

    await monthlyCostsComponent.rentMortgageInput.fill(data.mortgage);
    await monthlyCostsComponent.creditCardInput.fill(data.creditCard);
    await monthlyCostsComponent.childAndSpouseInput.fill(data.childCare);
    await monthlyCostsComponent.childcareInput.fill(data.travelCosts);
    await monthlyCostsComponent.travelInput.fill(data.travelCosts);
    await monthlyCostsComponent.billsInsuranceInput.fill(data.groceries);
    await monthlyCostsComponent.entertainmentInput.fill(data.entertainment);
    await monthlyCostsComponent.holidaysInput.fill(data.holidays);
    await monthlyCostsComponent.continueButton.click();

    await successfulResultsComponent.mortgageAmountInput.fill(
      data.mortgageAmount,
    );
    await successfulResultsComponent.interestInput.fill(data.interestRate);
    await successfulResultsComponent.updateResultsButton.click();
    await expect(successfulResultsComponent.errorMessage).toContainText(
      data.errorMessage,
    );
  });
});
