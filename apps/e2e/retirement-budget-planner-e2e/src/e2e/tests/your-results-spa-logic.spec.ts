import { expect, test } from '@playwright/test';

import {
  additionalRateIncomeTax,
  alreadyRetiredDisclaimer,
  spaDisplayWithYearsAndMonths,
  spaEqualToCurrentAge,
  spaGreaterThanCurrentAge,
  spaLessThanCurrentAge,
  taxRatesDisclaimer,
} from '../data/spa-and-income-tax';
import aboutYouPage from '../pages/AboutYouPage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';
/**
 * @tests User story : 44438
 * @tests Test Case 47402: 44438 AC2 TEST CASE 3 : Verify retirement income status when State Pension age is more than Current age
 * @tests Test Case 47401: 44438 AC1 TEST CASE 2 : Verify retirement income status when State Pension age is less than Current age
 * @tests Test Case 47400: 44438 AC1 TEST CASE 1 : Verify retirement income status when State Pension age is equal to Current age
 * @scenario  Verifies that retirement income calculations correctly apply additional rate income tax (45%) when pension income exceeds 125140
 * @scenario Verifies that state pension age is displayed with years and months
 */

const SUB_HEADING_TEST_ID = 'your-results-subheading';
const TAX_RATES_DISCLAIMER_TEST_ID = 'your-results-tax-rates-disclaimer';
const ALREADY_RETIRED_DISCLAIMER_TEST_ID =
  'your-results-already-retired-disclaimer';

test.describe('Retirement Budget Planner - Your results page - State Pension age and Income tax logic', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify State Pension age and Income tax logic when SPA is more than Current age', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = spaGreaterThanCurrentAge.aboutYou;
    const { pensionValue } = spaGreaterThanCurrentAge.income;
    const { mortgageRepayment } = spaGreaterThanCurrentAge.cost;
    const expected = spaGreaterThanCurrentAge.expected;
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);
    await expect(
      resultsPage.getByTestId(page, SUB_HEADING_TEST_ID),
    ).resolves.toBe(expected);
    await expect(
      resultsPage.getByTestId(page, TAX_RATES_DISCLAIMER_TEST_ID),
    ).resolves.toBe(taxRatesDisclaimer);

    await expect(
      resultsPage.getByTestId(page, ALREADY_RETIRED_DISCLAIMER_TEST_ID),
    ).resolves.toBe(alreadyRetiredDisclaimer);
  });

  test('Verify State Pension age and Income tax logic when SPA is less than Current age', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = spaLessThanCurrentAge.aboutYou;
    const { pensionValue } = spaLessThanCurrentAge.income;
    const { mortgageRepayment } = spaLessThanCurrentAge.cost;
    const expected = spaLessThanCurrentAge.expected;
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);
    await expect(
      resultsPage.getByTestId(page, SUB_HEADING_TEST_ID),
    ).resolves.toBe(expected);
    await expect(
      resultsPage.getByTestId(page, TAX_RATES_DISCLAIMER_TEST_ID),
    ).resolves.toBe(taxRatesDisclaimer);
    await expect(
      resultsPage.getByTestId(page, ALREADY_RETIRED_DISCLAIMER_TEST_ID),
    ).resolves.toBe(alreadyRetiredDisclaimer);
  });

  test('Verify State Pension age and Income tax logic when SPA is equal to Current age', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = spaEqualToCurrentAge.aboutYou;
    const { pensionValue } = spaEqualToCurrentAge.income;
    const { mortgageRepayment } = spaEqualToCurrentAge.cost;
    const expected = spaEqualToCurrentAge.expected;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);

    await expect(
      resultsPage.getByTestId(page, SUB_HEADING_TEST_ID),
    ).resolves.toBe(expected);
    await expect(
      resultsPage.getByTestId(page, TAX_RATES_DISCLAIMER_TEST_ID),
    ).resolves.toBe(taxRatesDisclaimer);
    await expect(
      resultsPage.getByTestId(page, ALREADY_RETIRED_DISCLAIMER_TEST_ID),
    ).resolves.toBe(alreadyRetiredDisclaimer);
  });

  test('Verifies that retirement income calculations correctly apply additional rate income tax (45%) when pension income exceeds £125,140', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = additionalRateIncomeTax.aboutYou;
    const { pensionValue } = additionalRateIncomeTax.income;
    const { mortgageRepayment } = additionalRateIncomeTax.cost;
    const expected = additionalRateIncomeTax.expected;
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);
    await expect(
      resultsPage.getByTestId(page, SUB_HEADING_TEST_ID),
    ).resolves.toBe(expected);
  });

  test('Verifies that state pension age is displayed with years and months', async ({
    page,
  }) => {
    const { day, month, year, retireAge } =
      spaDisplayWithYearsAndMonths.aboutYou;
    const { pensionValue } = spaDisplayWithYearsAndMonths.income;
    const { mortgageRepayment } = spaDisplayWithYearsAndMonths.cost;
    const expected = spaDisplayWithYearsAndMonths.expected;
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(page, mortgageRepayment);
    await expect(
      resultsPage.getByTestId(page, SUB_HEADING_TEST_ID),
    ).resolves.toBe(expected);
  });
});
