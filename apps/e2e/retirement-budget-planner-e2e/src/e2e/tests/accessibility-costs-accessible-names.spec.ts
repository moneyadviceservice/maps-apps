import { test, expect } from '@playwright/test';
import homePage from '../pages/HomePage';
import { summaryTotal } from '../data/your-results';
import retirementIncomePage from '../pages/RetirementIncomePage';
import aboutYouPage from '../pages/AboutYouPage';

/**
 * @tests User Story 50541
 * @tests Test Case 52248 : 50541 AC1 TEST CASE 1: Verify that each cost item on the Retirement Costs page uses a fieldset with a correctly labelled legend
 */

test('Costs page uses correct fieldset + legend structure (English)', async ({
  page,
}) => {
  await homePage.startRetirementBudgetPlanner(page);
  await aboutYouPage.fillValuesAndContinue(page);
  await retirementIncomePage.fillValuesAndContinue(
    page,
    summaryTotal.inputValues.income.amount,
    summaryTotal.inputValues.income.frequency,
  );

  // Expected legends in English
  const expectedLegends = [
    'Mortgage repayment',
    'Rent or care home fees',
    'Ground rent',
    'Service or factoring charge',
  ];

  // 1. Collect this fieldset + the next 3 fieldsets
  const fieldsets = page.locator(
    'xpath=(//legend)[1]/ancestor::fieldset | (//legend)[2]/ancestor::fieldset | (//legend)[3]/ancestor::fieldset | (//legend)[4]/ancestor::fieldset',
  );

  await expect(fieldsets).toHaveCount(expectedLegends.length);

  // 2. Verify each fieldset + legend + inputs
  for (let i = 0; i < expectedLegends.length; i++) {
    const fieldset = fieldsets.nth(i);

    // 3. Legend exists and matches expected text
    const legend = fieldset.locator('legend');
    await expect(legend).toHaveText(expectedLegends[i]);

    // 4. Fieldset contains a frequency dropdown
    await expect(fieldset.locator('select')).toBeVisible();

    // 5. Fieldset contains a cost input field (text or number)
    await expect(fieldset.locator('input')).toBeVisible();
  }
});
