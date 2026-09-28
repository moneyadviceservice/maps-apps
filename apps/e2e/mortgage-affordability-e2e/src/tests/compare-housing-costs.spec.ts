import { expect, test } from '@lib/test.lib';
import { AnnualIncomeComponent } from '@pages/components/annual-income.component';
import { MonthlyCostsComponent } from '@pages/components/monthly-costs.component';

import testData from '../data/mortgageAffordabilityCalculator.json';
const data = testData.core.compareHousingCosts;

async function progressToResults(
  annualIncomeComponent: AnnualIncomeComponent,
  monthlyCostsComponent: MonthlyCostsComponent,
) {
  await annualIncomeComponent.incomeInput.fill(data.annualInput);
  await annualIncomeComponent.takeHomeInput.fill(data.takeHome);
  await annualIncomeComponent.continueButton.click();
  await monthlyCostsComponent.creditCardInput.fill(data.creditCard);
  await monthlyCostsComponent.rentMortgageInput.fill(data.mortgage);
  await monthlyCostsComponent.continueButton.click();
}

test.describe('Mortgage Affordability', () => {
  /**
   * @tests 57517 - Compare housing costs card with mortgage costing £475.05
   * @tests 58052 - Compare housing costs card with new mortgage costing £633.40
   * @tests 58053 - Compare housing costs card with new mortgage costing £209.02
   * @tests 58054 - compare housing costs card with a new mortgage costing £696.74
   * @tests 58055 - Compare housing costs card with a new mortgage costing the same as the current one (£500.00 per month)
   */
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of data.scenarios) {
    test(`Compare housing costs for £${scenario.mortgageAmount}`, async ({
      page,
      annualIncomeComponent,
      monthlyCostsComponent,
      successfulResultsComponent,
    }) => {
      await page.goto(`/en/annual-income`);
      await progressToResults(annualIncomeComponent, monthlyCostsComponent);

      await successfulResultsComponent.mortgageAmountInput.fill(
        scenario.mortgageAmount,
      );
      await successfulResultsComponent.mortgageLengthDropdown.selectOption(
        data.mortgageLength,
      );
      await successfulResultsComponent.interestInput.fill(data.interest);
      await successfulResultsComponent.updateResultsButton.click();

      await expect(
        successfulResultsComponent.currentMortgagePayment,
      ).toContainText(data.mortgage);

      await expect(successfulResultsComponent.newMortgagePayment).toHaveText(
        scenario.newMortgagePayment,
      );
      await expect(
        successfulResultsComponent.compareHousingCostsDescription,
      ).toContainText(scenario.description);
    });
  }
});
