import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';

import testData from '../data/mortgageAffordabilityCalculator.json';
const data = testData.core.overstretchedLabels;

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
   * @tests 58230 - Overstretched page scenario one
   * @tests 58231 - Overstretched page scenario two
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of data.scenarios) {
    test(`Overstretched page - ${scenario.testName}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
      failedResultsComponent,
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

      await expect(failedResultsComponent.overstretchedTitle).toContainText(
        testData.core.overstretched.title,
      );
      await expect(
        failedResultsComponent.overstretchedPargraphOne,
      ).toContainText(testData.core.overstretched.primaryInfo);
      await expect(
        failedResultsComponent.overstretchedPargraphTwo,
      ).toContainText(testData.core.overstretched.subHeading);
      await expect(
        failedResultsComponent.overstretchedPargraphThree,
      ).toContainText(testData.core.overstretched.secondaryInfo);
    });
  }
});
