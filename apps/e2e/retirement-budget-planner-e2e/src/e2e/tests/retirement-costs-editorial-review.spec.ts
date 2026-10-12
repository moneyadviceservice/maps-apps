import { expect, test } from '@playwright/test';

import { otherToolsToTry } from '../data/your-results';
import aboutYouPage from '../pages/AboutYouPage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User Story 47777
 * @test 48928: 47777 AC1 TEST CASE 1: Verify intro paragraph is displayed under the Retirement cost heading
 * @test 48930: 47777 AC2 TEST CASE 2: Verify the Rent or care home fees title uses sentence case
 * @test 49147: 47777 AC3 TEST CASE 3: Verify fields under Household bills appears in the correct order
 * @test 49420: 47777 AC4 TEST CASE 4: Verify intro paragraph is displayed under the "Other essential outgoings" heading
 * @test 49432: 47777 AC5 TEST CASE 5: Verify each name field in 'Other essential outgoings' displays correct placeholder text
 * @test 49435: 47777 AC6 TEST CASE 6: Verify all sections appear in the correct order on the Retirement costs page
 * @test 49439: 47777 AC7 TEST CASE 7: Verify validation message displays when continuing with no values entered

 */

test.describe('Retirement Budget Planner - Retirement costs page - Editorial review', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Changes to Retirement Costs after editorial review - Pension calculator', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = otherToolsToTry.aboutYou;
    const { pensionValue } = otherToolsToTry.income;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );

    // AC1
    await page
      .getByText(
        /Enter all the essential expenses you expect to pay after you retire/i,
      )
      .waitFor();

    const text = await retirementCostsPage.verifyRetirementCostsIntroText(page);
    expect(text).toContain(
      'Enter all the essential expenses you expect to pay after you retire, based on today’s values',
    );

    // AC2
    const labelText = await retirementCostsPage.verifyRentAndCareHomeFeesLabel(
      page,
    );
    expect(labelText).toBe('Rent or care home fees');

    // AC3
    await retirementCostsPage.openHouseholdBillsSection(page);

    const labels = await retirementCostsPage.getHouseholdBillsLabels(page);

    const expectedOrder = [
      'Council Tax or Rates',
      'Energy (gas, electricity and other household fuels)',
      'Water',
      'Broadband and home phone',
      'Mobile phone',
      'TV licence',
      'Paid-for TV and streaming services',
    ];

    expect(labels).toEqual(expectedOrder);

    // AC4
    await retirementCostsPage.openOtherEssentialOutgoingsSection(page);

    const otherEssentialOutgoingsIntroText =
      await retirementCostsPage.verifyOtherEssentialOutgoingsIntroText(page);
    expect(otherEssentialOutgoingsIntroText).toContain(
      'If you expect to have any other essential costs after you retire, you can enter them here.',
    );

    // AC5
    const placeholders = await retirementCostsPage.getNameOfCostPlaceholders(
      page,
    );

    expect(placeholders.every((p) => p === 'Name of cost')).toBe(true);

    // AC6
    await retirementCostsPage.openHouseholdBillsSection(page);
    await retirementCostsPage.openOtherEssentialOutgoingsSection(page);
    await retirementCostsPage.closeHousingSection(page);

    const expectedOrder2 = [
      'Housing',
      'Household bills',
      'Living costs',
      'Insurance',
      'Borrowing',
      'Travel',
      'Other essential outgoings',
    ];

    const actualOrder = await retirementCostsPage.getSectionHeadings(page);

    expect(actualOrder).toEqual(expectedOrder2);

    // AC7
    await retirementCostsPage.clickContinue(page);

    const errorSummaryHeading =
      await retirementCostsPage.getErrorSummaryHeading(page);
    expect(errorSummaryHeading).toBe(
      'We need more information to calculate your retirement budget.',
    );

    const errorSummaryBody = await retirementCostsPage.getErrorSummaryBody(
      page,
    );
    expect(errorSummaryBody).toBe(
      'Enter all the expenses you expect to pay after you retire. You must add at least one cost to continue.',
    );
  });
});
