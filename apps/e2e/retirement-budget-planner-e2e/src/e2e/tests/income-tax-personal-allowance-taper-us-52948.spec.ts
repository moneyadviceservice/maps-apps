import { expect, test } from '@playwright/test';

import { PersonalAllowanceTaperJourneyPage } from '../pages/class-based/PersonalAllowanceTaperJourneyPage';

const scenarios = [
  {
    ac: 'AC1',
    annualIncome: 110_000,
    expectedTax: 33_432,
    expectedAnnualIncomeAfterTax: 76_568,
  },
  {
    ac: 'AC2',
    annualIncome: 100_001,
    expectedTax: 27_432.6,
    expectedAnnualIncomeAfterTax: 72_568.4,
  },
  {
    ac: 'AC3',
    annualIncome: 107_000,
    expectedTax: 31_632,
    expectedAnnualIncomeAfterTax: 75_368,
  },
  {
    ac: 'AC4',
    annualIncome: 125_139,
    expectedTax: 42_515.4,
    expectedAnnualIncomeAfterTax: 82_623.6,
  },
  {
    ac: 'AC5',
    annualIncome: 140_000,
    expectedTax: 49_203,
    expectedAnnualIncomeAfterTax: 90_797,
  },
] as const;

/**
 * @tests User Story 52948
 * @test AC1 Income tax calculation on £110,000
 * @test AC2 Income tax calculation on £100,001
 * @test AC3 Income tax calculation on £107,000
 * @test AC4 Income tax calculation on £125,139
 * @test AC5 Income tax calculation on £140,000
 */
test.describe('Retirement Budget Planner - Personal allowance taper (US-52948)', () => {
  scenarios.forEach((scenario) => {
    const testName = `${
      scenario.ac
    }: calculates tax correctly for annual income £${scenario.annualIncome.toLocaleString()}`;

    test(testName, async ({ page }) => {
      const journey = new PersonalAllowanceTaperJourneyPage(page);

      await journey.completeJourney(scenario.annualIncome);

      const annualIncomeAfterTax =
        await journey.results.getAnnualIncomeAfterTax();
      const calculatedTax = scenario.annualIncome - annualIncomeAfterTax;

      expect(annualIncomeAfterTax).toBeCloseTo(
        scenario.expectedAnnualIncomeAfterTax,
        1,
      );
      expect(calculatedTax).toBeCloseTo(scenario.expectedTax, 1);
    });
  });
});
