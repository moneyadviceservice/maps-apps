import { expect, test } from '@playwright/test';

import * as aboutYou from '../data/about-you';
import * as results from '../data/results';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

const pageHeading = 'Your results';
const aboutYouHeading = 'About you';
const aboutYouCYHeading = 'Amdanoch chi';
const resultsCYHeading = 'Eich canlyniadau';
const resultsENHeading = 'Your results';

/**
 * @tests User Story 50141
 * @test Test Case 50492 : 50141 AC1 TEST CASE 1: Verify the age question reads correctly in both English and Welsh on the About you page
 * @test Test Case 50493 : 50141 AC2 TEST CASE 2: Verify the income tax rate line reads correctly on the Retirement results page
 * @test Test Case 50494 : 50141 AC3 TEST CASE 3: Verify the two income tax sentences display together as one paragraph
 * @test Test Case 50495 : 50141 AC4 TEST CASE 4: Verify the Budget planner line has been removed from the Retirement results page in both EN and CY
 * @test Test Case 50496 : 50141 AC5 TEST CASE 5: Verify the sections on the Retirement results page display in the correct order.
 */

test.describe('Retirement Budget Planner - Your results page', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify Your result page', async ({ page, context }) => {
    //navigate to results page
    const dobDay = '1';
    const dobMonth = '1';
    const dobYear = '1970';
    const retirementAge = '75';
    const pensionValue = '5000';
    const mortgageRepayment = '500';

    //AC1
    await expect(page.getByText(aboutYou.ageRetireEN)).toBeVisible();
    await homePage.clickWelshLink(page);
    await expect(
      page.getByRole('heading', { name: aboutYouCYHeading }),
    ).toBeVisible();
    await expect(page.getByText(aboutYou.ageRetireCY)).toBeVisible();
    await homePage.clickEnglishLink(page);
    await expect(
      page.getByRole('heading', { name: aboutYouHeading }),
    ).toBeVisible();

    await aboutYouPage.fillValuesAndContinue(
      page,
      dobDay,
      dobMonth,
      dobYear,
      retirementAge,
    );
    await retirementIncomePage.fillValuesAndContinue(page, pensionValue);
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );

    //verify Your results heading
    await expect(basePage.pageHeading(page, pageHeading)).toBeVisible();

    //AC2
    await expect(
      page.getByRole('heading', { name: resultsENHeading }),
    ).toBeVisible();
    await expect(page.getByText(results.incomeTaxRateEN)).toBeVisible();
    await homePage.clickWelshLink(page);
    await expect(
      page.getByRole('heading', { name: resultsCYHeading }),
    ).toBeVisible();
    await expect(page.getByText(results.incomeTaxRateCY)).toBeVisible();
    await homePage.clickEnglishLink(page);

    //AC3
    await expect(
      page.getByTestId('your-results-tax-rates-disclaimer'),
    ).toContainText(
      /This is based on the current Income Tax rates for England, Wales and Northern Ireland\. You can see the Scottish Income Tax rates.*?on GOV\.UK\. Find out more in our guides about tax and pensions.*?\./,
    );

    //AC4
    await expect(page.getByText(results.alreadyRetiredEN)).toBeHidden();
    await homePage.clickWelshLink(page);
    await expect(page.getByText(results.alreadyRetiredCY)).toBeHidden();
    await homePage.clickEnglishLink(page);

    //AC5
    const pensionRaw = await resultsPage.statePensionHeading(page).innerText();

    const headings = [
      await resultsPage.yourResultsHeading(page).innerText(),
      pensionRaw.split(' of ')[0], // "From your State Pension Age"
      await resultsPage.incomeAndCostsHeading(page).innerText(),
      await resultsPage.moneyLeftOverHeading(page).innerText(),
      await resultsPage.incomeTaxParagraph(page).innerText(),
    ];

    expect(headings.slice(0, 4)).toEqual(
      results.resultsPageExpectedOrder.slice(0, 4),
    );
    expect(headings[4]).toContain('This is based on the current Income Tax');
  });
});
