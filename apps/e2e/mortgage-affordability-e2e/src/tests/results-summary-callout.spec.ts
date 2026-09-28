import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';
import { SuccessfulResultsComponent } from '@pages/components/successful-results.component';

import testData from '../data/mortgageAffordabilityCalculator.json';
const positiveData = testData.core.summaryCallout.positiveScenarios;
const negativeData = testData.core.summaryCallout.negativeScenarios;

async function progressToResults(
  annualIncomeComponent: AnnualIncomeComponent,
  monthlyCostsComponent: MonthlyCostsComponent,
  income: string,
  takeHome: string,
  mortgage: string,
  creditCard: string,
  childSpouse: string,
  childCare: string,
  travelCosts: string,
  bills: string,
  groceries: string,
  entertainment: string,
  holidays: string,
) {
  await annualIncomeComponent.incomeInput.fill(income);
  await annualIncomeComponent.takeHomeInput.fill(takeHome);
  await annualIncomeComponent.continueButton.click();

  await monthlyCostsComponent.rentMortgageInput.fill(mortgage);
  await monthlyCostsComponent.creditCardInput.fill(creditCard);
  await monthlyCostsComponent.travelInput.fill(travelCosts);
  await monthlyCostsComponent.childAndSpouseInput.fill(childSpouse);
  await monthlyCostsComponent.childcareInput.fill(childCare);

  await monthlyCostsComponent.billsInsuranceInput.fill(bills);
  await monthlyCostsComponent.foodInput.fill(groceries);
  await monthlyCostsComponent.entertainmentInput.fill(entertainment);
  await monthlyCostsComponent.holidaysInput.fill(holidays);
  await monthlyCostsComponent.continueButton.click();
}

async function updateResults(
  successfulResultsComponent: SuccessfulResultsComponent,
  borrowAmount: string,
  mortgageTerm: string,
  interestRate: string,
) {
  await successfulResultsComponent.mortgageAmountInput.fill(borrowAmount);
  await successfulResultsComponent.mortgageLengthDropdown.selectOption(
    mortgageTerm,
  );
  await successfulResultsComponent.interestInput.fill(interestRate);
  await successfulResultsComponent.updateResultsButton.click();
}

test.describe(`Mortgage Affordability`, () => {
  /**
   * @tests 58170 - shows the results summary callout with positive result for income of £50000, with outgoings of 75%
   * @tests 58171 - shows the results summary callout with positive result for income of £50000, with outgoings of 79%
   * @tests 58172 - shows the results summary callout with positive result for income of £30000, with outgoings of 88%
   * @tests 58173 - shows the results summary callout with warning result for income of £30000, with outgoings of 80%
   * @tests 58174 - shows the results summary callout with warning result for income of £40000, with outgoings of 99%
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of positiveData) {
    test(`shows the results summary callout positive result for income of ${scenario.testName}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
      successfulResultsComponent,
    }) => {
      await page.goto(`/en/annual-income`);

      await progressToResults(
        annualIncomeComponent,
        monthlyCostsComponent,
        scenario.annualIncome,
        scenario.takeHome,
        scenario.mortgage,
        scenario.creditCard,
        scenario.childAndSpouse,
        scenario.childCare,
        scenario.travel,
        scenario.bills,
        scenario.groceries,
        scenario.entertainment,
        scenario.holidays,
      );

      await updateResults(
        successfulResultsComponent,
        scenario.borrowAmount,
        scenario.mortgageTerm,
        scenario.interestRate,
      );

      await expect(
        successfulResultsComponent.succesfulResultsTitle,
      ).toContainText(scenario.title);
      await expect(
        successfulResultsComponent.succesfulResultsDetail,
      ).toContainText(scenario.description);
    });
  }

  for (const scenario of negativeData) {
    test(`shows the results summary callout with warning result for income of ${scenario.testName}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
      successfulResultsComponent,
    }) => {
      await page.goto(`/en/annual-income`);

      await progressToResults(
        annualIncomeComponent,
        monthlyCostsComponent,
        scenario.annualIncome,
        scenario.takeHome,
        scenario.mortgage,
        scenario.creditCard,
        scenario.childAndSpouse,
        scenario.childCare,
        scenario.travel,
        scenario.bills,
        scenario.groceries,
        scenario.entertainment,
        scenario.holidays,
      );

      await updateResults(
        successfulResultsComponent,
        scenario.borrowAmount,
        scenario.mortgageTerm,
        scenario.interestRate,
      );

      await expect(
        successfulResultsComponent.warningResultsTitle,
      ).toContainText(scenario.title);
      await expect(
        successfulResultsComponent.warningResultsDetail,
      ).toContainText(scenario.description);
    });
  }
});
