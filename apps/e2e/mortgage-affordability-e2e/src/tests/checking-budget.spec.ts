import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { SuccessfulResultsComponent } from '@pages/components/successful-results.component';

import testData from '../data/mortgageAffordabilityCalculator.json';

async function validateResultsPage(
  successfulResultsComponent: SuccessfulResultsComponent,
) {
  await expect(successfulResultsComponent.pageTitle).toContainText(
    testData.core.results.yourResults,
  );
  await expect(successfulResultsComponent.resultsSubtitle).toContainText(
    testData.core.results.yourResultsSubtitle,
  );
  await expect(successfulResultsComponent.changeResultsTitle).toContainText(
    testData.core.results.changeResults,
  );
  await expect(
    successfulResultsComponent.mortgageAmountInputTitle,
  ).toContainText(testData.core.results.mortgageAmount);
}

async function checkResults(
  successfulResultsComponent: SuccessfulResultsComponent,
  offered: string,
  percentageOfTakeHomePay: string,
  mortgageAmountText: string,
  mortgageAmount: string,
  mortgageValue: string,
  mortgageLength: string,
  interestRate: string,
  moneyLeft: string,
  updatedMortgageAmount: string,
  updatedMortgageValue: string,
  updatedMortgageTakeHome: number,
  mortgageMoneyLeft: string,
  updatedMortgageLength: string,
  updatedLengthTakeHome: number,
  updatedLengthValue: string,
  lengthMoneyLeft: string,
  updatedInterestRate: string,
  updatedRateTakeHome: number,
  updatedRateValue: string,
  interestMoneyLeft: string,
) {
  await expect(successfulResultsComponent.offerValue).toContainText(offered);

  if (updatedMortgageTakeHome < 80)
    await expect(
      successfulResultsComponent.succesfulResultsTitle,
    ).toContainText(percentageOfTakeHomePay);
  else {
    await expect(successfulResultsComponent.warningResultsTitle).toContainText(
      percentageOfTakeHomePay,
    );
  }
  await expect(
    successfulResultsComponent.mortgageAmountDescription,
  ).toContainText(mortgageAmountText);

  await expect(successfulResultsComponent.mortgageAmountInput).toHaveValue(
    mortgageAmount,
  );
  await expect(successfulResultsComponent.newMortgagePayment).toContainText(
    mortgageValue,
  );
  await expect(successfulResultsComponent.mortgageLengthDropdown).toHaveValue(
    mortgageLength,
  );
  await expect(successfulResultsComponent.interestInput).toHaveValue(
    interestRate,
  );
  await expect(successfulResultsComponent.interestRateMoneyLeft).toContainText(
    moneyLeft,
  );
  await successfulResultsComponent.mortgageAmountInput.fill(
    updatedMortgageAmount,
  );
  await successfulResultsComponent.updateResultsButton.click();

  await expect(successfulResultsComponent.newMortgagePayment).toContainText(
    updatedMortgageValue,
  );
  if (updatedMortgageTakeHome < 80) {
    await expect(
      successfulResultsComponent.succesfulResultsTitle,
    ).toContainText(updatedMortgageTakeHome.toString());
  } else {
    await expect(successfulResultsComponent.warningResultsTitle).toContainText(
      updatedMortgageTakeHome.toString(),
    );
  }
  await successfulResultsComponent.mortgageLengthDropdown.selectOption(
    updatedMortgageLength,
  );
  await successfulResultsComponent.updateResultsButton.click();

  if (updatedLengthTakeHome < 80) {
    await expect(
      successfulResultsComponent.succesfulResultsTitle,
    ).toContainText(updatedLengthTakeHome.toString());
  } else {
    await expect(successfulResultsComponent.warningResultsTitle).toContainText(
      updatedLengthTakeHome.toString(),
    );
  }

  await expect(successfulResultsComponent.newMortgagePayment).toContainText(
    updatedLengthValue,
  );

  await successfulResultsComponent.interestInput.fill(updatedInterestRate);
  await successfulResultsComponent.updateResultsButton.click();

  if (updatedRateTakeHome < 80) {
    await expect(
      successfulResultsComponent.succesfulResultsTitle,
    ).toContainText(updatedRateTakeHome.toString());
  } else {
    await expect(successfulResultsComponent.warningResultsTitle).toContainText(
      updatedRateTakeHome.toString(),
    );
  }
  await expect(successfulResultsComponent.newMortgagePayment).toContainText(
    updatedRateValue,
  );
}

async function inputAnnualIncome(
  annualIncomeComponent: AnnualIncomeComponent,
  annualIncome: string,
  takeHome: string,
  otherIncome: string,
) {
  await expect(annualIncomeComponent.headerTitle).toContainText(
    testData.core.annualIncome.title,
  );
  await expect(annualIncomeComponent.pageTitle).toContainText(
    testData.core.annualIncome.heading,
  );
  await expect(annualIncomeComponent.incomeDescription).toContainText(
    testData.core.annualIncome.primaryInfo,
  );
  await annualIncomeComponent.incomeInput.fill(annualIncome);
  await annualIncomeComponent.takeHomeInput.fill(takeHome);
  await annualIncomeComponent.otherIncomeInput.fill(otherIncome);
  await annualIncomeComponent.continueButton.click();
}

test.describe('Mortgage Affordability', () => {
  /**
   * @tests 57511 - Checking Overstretched Budget
   * @tests 57512 - Checking Risky Budget
   * @tests 57513 - Checking for Safe Budget
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test(`Checking for overstretched budget`, async ({
    page,
    annualIncomeComponent,
    monthlyCostsComponent,
    failedResultsComponent,
  }) => {
    await page.goto(`/en/annual-income`);

    await inputAnnualIncome(
      annualIncomeComponent,
      testData.core.overstretchedInput.annualIncome,
      testData.core.overstretchedInput.takeHome,
      testData.core.overstretchedInput.otherIncome,
    );

    await expect(monthlyCostsComponent.headerTitle).toContainText(
      testData.core.householdCosts.title,
    );
    await expect(monthlyCostsComponent.pageTitle).toContainText(
      testData.core.householdCosts.heading,
    );
    await expect(monthlyCostsComponent.monthlyFirstDescription).toContainText(
      testData.core.householdCosts.monthlyHouseholdInfo,
    );
    await expect(monthlyCostsComponent.monthlySecondDescription).toContainText(
      testData.core.householdCosts.applyingWithSomeoneNote,
    );
    await expect(monthlyCostsComponent.essentialBillsTitle).toContainText(
      testData.core.householdCosts.householdSubHeading,
    );
    await monthlyCostsComponent.rentMortgageInput.fill(
      testData.core.overstretchedInput.mortgage,
    );
    await monthlyCostsComponent.creditCardInput.fill(
      testData.core.overstretchedInput.creditCard,
    );
    await monthlyCostsComponent.childAndSpouseInput.fill(
      testData.core.overstretchedInput.childAndSpouse,
    );
    await monthlyCostsComponent.childcareInput.fill(
      testData.core.overstretchedInput.childCare,
    );
    await expect(monthlyCostsComponent.travelLivingCostsTitle).toContainText(
      testData.core.householdCosts.subHeading2,
    );
    await expect(
      monthlyCostsComponent.travelLivingCostsDescription,
    ).toContainText(testData.core.householdCosts.monthlyLivingCostsInfo);
    await monthlyCostsComponent.travelInput.fill(
      testData.core.overstretchedInput.travelCosts,
    );
    await monthlyCostsComponent.billsInsuranceInput.fill(
      testData.core.overstretchedInput.bills,
    );
    await monthlyCostsComponent.foodInput.fill(
      testData.core.overstretchedInput.groceries,
    );
    await expect(monthlyCostsComponent.entertainmentHint).toContainText(
      testData.core.householdCosts.entertainmentHint,
    );
    await monthlyCostsComponent.entertainmentInput.fill(
      testData.core.overstretchedInput.entertainment,
    );
    await expect(monthlyCostsComponent.holidaysHint).toContainText(
      testData.core.householdCosts.holidaysHint,
    );
    await monthlyCostsComponent.holidaysInput.fill(
      testData.core.overstretchedInput.holidays,
    );
    await monthlyCostsComponent.continueButton.click();

    await expect(failedResultsComponent.overstretchedTitle).toContainText(
      testData.core.overstretched.title,
    );
    await expect(failedResultsComponent.overstretchedPargraphOne).toContainText(
      testData.core.overstretched.primaryInfo,
    );
    await expect(failedResultsComponent.overstretchedPargraphTwo).toContainText(
      testData.core.overstretched.subHeading,
    );
    await expect(
      failedResultsComponent.overstretchedPargraphThree,
    ).toContainText(testData.core.overstretched.secondaryInfo);
  });

  test(`Checking risky budget`, async ({
    page,
    annualIncomeComponent,
    monthlyCostsComponent,
    successfulResultsComponent,
  }) => {
    await page.goto(`/en/annual-income`);

    await inputAnnualIncome(
      annualIncomeComponent,
      testData.core.riskyBudget.annualIncome,
      testData.core.riskyBudget.takeHome,
      testData.core.riskyBudget.otherIncome,
    );

    await monthlyCostsComponent.creditCardInput.fill(
      testData.core.riskyBudget.creditCard,
    );
    await monthlyCostsComponent.travelInput.fill(
      testData.core.riskyBudget.travelCosts,
    );
    await monthlyCostsComponent.billsInsuranceInput.fill(
      testData.core.riskyBudget.bills,
    );
    await monthlyCostsComponent.rentMortgageInput.fill(
      testData.core.riskyBudget.mortgage,
    );
    await monthlyCostsComponent.entertainmentInput.fill(
      testData.core.riskyBudget.entertainment,
    );
    await monthlyCostsComponent.holidaysInput.fill(
      testData.core.riskyBudget.holidays,
    );
    await monthlyCostsComponent.foodInput.fill(
      testData.core.riskyBudget.groceries,
    );
    await monthlyCostsComponent.continueButton.click();

    await validateResultsPage(successfulResultsComponent);
    await checkResults(
      successfulResultsComponent,
      testData.core.riskyBudget.offeredBetweenValue,
      testData.core.riskyBudget.percentageOfTakeHomePay,
      testData.core.riskyBudget.mortgageAmountSubtitle,
      testData.core.riskyBudget.mortgageAmount,
      testData.core.riskyBudget.mortgageValue,
      testData.core.riskyBudget.mortgageLength,
      testData.core.riskyBudget.interestRate,
      testData.core.riskyBudget.moneyLeft,
      testData.core.riskyBudget.updatedMortgageAmount,
      testData.core.riskyBudget.updatedMortgageValue,
      testData.core.riskyBudget.updatedMortgageTakeHome,
      testData.core.riskyBudget.mortgageMoneyLeft,
      testData.core.riskyBudget.updatedMortgageLength,
      testData.core.riskyBudget.updatedLengthTakeHome,
      testData.core.riskyBudget.updatedLengthValue,
      testData.core.riskyBudget.lengthMoneyLeft,
      testData.core.riskyBudget.updatedInterestRate,
      testData.core.riskyBudget.updatedRateTakeHome,
      testData.core.riskyBudget.updatedRateValue,
      testData.core.riskyBudget.interestMoneyLeft,
    );
  });

  test(`Checking for safe budget`, async ({
    page,
    annualIncomeComponent,
    monthlyCostsComponent,
    successfulResultsComponent,
  }) => {
    await page.goto(`/en/annual-income`);

    await inputAnnualIncome(
      annualIncomeComponent,
      testData.core.safeBudget.annualIncome,
      testData.core.safeBudget.takeHome,
      testData.core.safeBudget.otherIncome,
    );

    await monthlyCostsComponent.travelInput.fill(
      testData.core.safeBudget.travelCosts,
    );
    await monthlyCostsComponent.billsInsuranceInput.fill(
      testData.core.safeBudget.bills,
    );
    await monthlyCostsComponent.rentMortgageInput.fill(
      testData.core.safeBudget.mortgage,
    );
    await monthlyCostsComponent.entertainmentInput.fill(
      testData.core.safeBudget.entertainment,
    );
    await monthlyCostsComponent.holidaysInput.fill(
      testData.core.safeBudget.holidays,
    );
    await monthlyCostsComponent.foodInput.fill(
      testData.core.safeBudget.groceries,
    );
    await monthlyCostsComponent.continueButton.click();

    await checkResults(
      successfulResultsComponent,
      testData.core.safeBudget.offeredBetweenValue,
      testData.core.safeBudget.percentageOfTakeHomePay,
      testData.core.safeBudget.mortgageAmountSubtitle,
      testData.core.safeBudget.mortgageAmount,
      testData.core.safeBudget.mortgageValue,
      testData.core.safeBudget.mortgageLength,
      testData.core.safeBudget.interestRate,
      testData.core.safeBudget.moneyLeft,
      testData.core.safeBudget.updatedMortgageAmount,
      testData.core.safeBudget.updatedMortgageValue,
      testData.core.safeBudget.updatedMortgageTakeHome,
      testData.core.safeBudget.mortgageMoneyLeft,
      testData.core.safeBudget.updatedMortgageLength,
      testData.core.safeBudget.updatedLengthTakeHome,
      testData.core.safeBudget.updatedLengthValue,
      testData.core.safeBudget.lengthMoneyLeft,
      testData.core.safeBudget.updatedInterestRate,
      testData.core.safeBudget.updatedRateTakeHome,
      testData.core.safeBudget.updatedRateValue,
      testData.core.safeBudget.interestMoneyLeft,
    );
    await successfulResultsComponent.mortgageAmountInput.fill(
      testData.core.safeBudget.updatedBorrowAmount,
    );
    await successfulResultsComponent.updateResultsButton.click();
    await expect(successfulResultsComponent.errorMessage).toContainText(
      testData.core.safeBudget.errorMessage,
    );
    await successfulResultsComponent.mortgageAmountInput.fill(
      testData.core.safeBudget.mortgageAmount,
    );
    await successfulResultsComponent.updateResultsButton.click();
    await expect(successfulResultsComponent.errorMessage).toBeHidden();
  });
});
