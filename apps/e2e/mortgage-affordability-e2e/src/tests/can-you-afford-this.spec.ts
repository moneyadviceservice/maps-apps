import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';

import testData from '../data/mortgageAffordabilityCalculator.json';
const data = testData.core.canYouAffordThis;

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

test.describe(`Mortgage Affordability`, () => {
  /**
   * @tests 58079 - Can you afford this card with overstretched budget costing £1465.47 per month and -£77.47 left over
   * @tests 58078 - Can you afford this card with a new mortgage costing £475.05 per month and £752.95 left over
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of data.scenarios) {
    test(`can you afford this card with ${scenario.testName}`, async ({
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

      await successfulResultsComponent.mortgageAmountInput.fill(
        scenario.borrowAmount,
      );
      await successfulResultsComponent.mortgageLengthDropdown.selectOption(
        scenario.mortgageTerm,
      );
      await successfulResultsComponent.interestInput.fill(
        scenario.interestRate,
      );
      await successfulResultsComponent.updateResultsButton.click();

      await expect(
        successfulResultsComponent.canYouAffordTakeHome,
      ).toContainText(scenario.takeHomePay);
      await expect(
        successfulResultsComponent.canYouAffordNewMortgage,
      ).toContainText(scenario.newMortgage);
      await expect(
        successfulResultsComponent.canYouAffordOtherCosts,
      ).toContainText(scenario.otherCosts);
      await expect(
        successfulResultsComponent.canYouAffordLeftOver,
      ).toContainText(scenario.leftOver);
    });
  }
});
