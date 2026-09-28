import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';

import testData from '../data/mortgageAffordabilityCalculator.json';
const data = testData.core.interestRatesRise;

async function progressToResults(
  annualIncomeComponent: AnnualIncomeComponent,
  monthlyCostsComponent: MonthlyCostsComponent,
  income: string,
  takeHome: string,
  otherIncome: string,
  creditCard: string,
  childSpouse: string,
  childCare: string,
  travelCosts: string,
  bills: string,
  mortgage: string,
  entertainment: string,
  holidays: string,
  groceries: string,
) {
  await annualIncomeComponent.incomeInput.fill(income);
  await annualIncomeComponent.takeHomeInput.fill(takeHome);
  await annualIncomeComponent.otherIncomeInput.fill(otherIncome);
  await annualIncomeComponent.continueButton.click();

  await monthlyCostsComponent.creditCardInput.fill(creditCard);
  await monthlyCostsComponent.childAndSpouseInput.fill(childSpouse);
  await monthlyCostsComponent.childcareInput.fill(childCare);
  await monthlyCostsComponent.travelInput.fill(travelCosts);
  await monthlyCostsComponent.billsInsuranceInput.fill(bills);
  await monthlyCostsComponent.rentMortgageInput.fill(mortgage);

  await monthlyCostsComponent.entertainmentInput.fill(entertainment);
  await monthlyCostsComponent.holidaysInput.fill(holidays);
  await monthlyCostsComponent.foodInput.fill(groceries);

  await monthlyCostsComponent.continueButton.click();
}

test.describe(`Mortgage Affordability`, () => {
  /**
   * @tests 58083 - shows the what if interest rates rise card for values; loan amount = 122200, term = 25, interest rate = 4%
   * @tests 58087 - shows the what if interest rates rise card for values; loan amount = 97993, term = 20, interest rate = 3.25%
   * @tests 58089 - shows the what if interest rates rise card for values; loan amount = 509560, term = 30, interest rate = 5%
   * @tests 58092 - shows the what if interest rates rise card for values; loan amount = 169800, term = 15, interest rate = 1%
   * @tests 58096 - shows the what if interest rates rise card for values; loan amount = 70696, term = 25, interest rate = 4%
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
        scenario.otherIncome,
        scenario.creditCard,
        scenario.childAndSpouse,
        scenario.childCare,
        scenario.travel,
        scenario.bills,
        scenario.mortgage,
        scenario.entertainment,
        scenario.holidays,
        scenario.groceries,
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

      const rowOne =
        scenario.rowOneRate + scenario.rowOnePayment + scenario.rowOneMoney;
      const rowTwo =
        scenario.rowTwoRate + scenario.rowTwoPayment + scenario.rowTwoMoney;
      const rowThree =
        scenario.rowThreeRate +
        scenario.rowThreePayment +
        scenario.rowThreeMoney;

      await expect(
        successfulResultsComponent.interestRatesLineOne,
      ).toContainText(rowOne);
      await expect(
        successfulResultsComponent.interestRatesLineTwo,
      ).toContainText(rowTwo);
      await expect(
        successfulResultsComponent.interestRatesLineThree,
      ).toContainText(rowThree);
    });
  }
});
