import { expect, test } from '@playwright/test';

import {
  boostStatePension,
  claimingBenefits,
  claimingEverythingEntitled,
  femaleLifeExpectancy,
  femaleLifeExpectancyWithRetireAge87,
  genderPayGap,
  incomeLessThanCosts,
  maleLifeExpectancy,
  maleLifeExpectancyWithRetireAge84,
  moneyLeftOver,
  qualifyForSocialHousingInRetirement,
  reduceBorrowingAfterRetirementWithCreditCard,
  reduceBorrowingAfterRetirementWithLoan,
  repayMortgageInRetirement,
  retireBeforeStatePensionAge,
} from '../data/next-steps';
import {
  benefitsLabel,
  otherRetirementIncomeTitle,
  statePensionDescription,
  statePensionTitle,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import resultsPage from '../pages/ResultsPage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';

/**
 * @tests User story : 44439
 * @tests Test Case 47477: 44439 AC1 & 14 TEST CASE1 : Verify next steps 'you should have money left over'
 * @tests Test Case 47482: 44439 AC2, 15, 16 TEST CASE 2 : Verify next steps card 'Your estimated income is unlikely to cover your costs'
 * @tests Test Case 47877: 44439 AC6 TEST CASE 7 : Verify next steps card 'Your retirement income might need to last for over xx years' - Male
 * @tests Test Case 47879: 44439 AC8 TEST CASE 9 : Verify next steps card 'Your retirement income might need to last for over xx years' - Female
 * @tests Test Case 47878: 44439 AC7 TEST CASE 8 : Verify next steps card NOT DISPLAYED 'Your retirement income might need to last for over xx years' - Male
 * @tests Test Case 47880: 44439 AC9 TEST CASE 10 : Verify next steps card NOT DISPLAYED 'Your retirement income might need to last for over xx years' - Female
 * @tests Test Case 47521: 44439 AC10 TEST CASE 11 : Verify next steps card 'You plan to retire before you can claim the State Pension'
 * @tests Test Case 47536: 44439 AC11 & 22 TEST CASE 12 : Verify next steps card 'Consider how you'll repay your mortgage in retirement'
 * @tests Test Case 47487: 44439 AC3, 17 TEST CASE 3 : Verify next steps card 'Gender pension gap'
 * @tests Test Case 47537: 44439 AC12 TEST CASE 13 : Verify next steps card 'Plan to reduce your borrowing after you retire with credit card debt'
 * @tests Test Case 47537: 44439 AC12 TEST CASE 13 : Verify next steps card 'Plan to reduce your borrowing after you retire with loan debt'
 * @tests Test Case 47538: 44439 AC13 TEST CASE 14 : Verify next steps card 'Check if you qualify for social housing in retirement'
 * @tests Test Case 47500: 44439 AC7 TEST CASE 8 : Verify next steps card NOT DISPLAYED 'Your retirement income might need to last for over xx years' - Male
 * @tests Test Case 47515: 44439 AC9 TEST CASE 10 : Verify next steps card NOT DISPLAYED 'Your retirement income might need to last for over xx years' - Female
 * @tests Test Case 47494: 44439 AC4, 18, 19 TEST CASE 4 : Verify next steps card 'Check you're claiming everything you're entitled to' via Benefit payments
 * @tests Test Case 47503: 44439 AC5 & 20 TEST CASE 6 : Verify next steps card 'Check if you can boost your State Pension'
 * @tests Test Case 47495: 44439 AC4, 18, 19 TEST CASE 5 : Verify next steps card 'Check you're claiming everything you're entitled to' via gross annual income
 */

test.describe('Retirement Budget Planner - Your results page - Next Steps', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
  });

  test('Verify next steps content when user should have money left over', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = moneyLeftOver.aboutYou;
    const { pensionValue } = moneyLeftOver.income;
    const { mortgageRepayment } = moneyLeftOver.cost;
    const expectedHeading = moneyLeftOver.expected.title;
    const expectedDescription = moneyLeftOver.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-costs-lower-than-income-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await expect(callout.paragraph2).toHaveText(
      moneyLeftOver.expected.paragraph2,
    );
  });

  test('Verify next steps content when user’s estimated retirement income is unlikely to cover their costs', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = incomeLessThanCosts.aboutYou;
    const { pensionValue } = incomeLessThanCosts.income;
    const { mortgageRepayment } = incomeLessThanCosts.cost;
    const expectedHeading = incomeLessThanCosts.expected.title;
    const expectedDescription = incomeLessThanCosts.expected.paragraph1;
    const expectedDescription2 = incomeLessThanCosts.expected.paragraph2;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-costs-higher-than-income-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await expect(callout.paragraph2).toHaveText(expectedDescription2);
  });

  test('Verify next steps content when user’s estimated retirement income might need to last for over based on male life expectancy', async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } = maleLifeExpectancy.aboutYou;
    const { pensionValue } = maleLifeExpectancy.income;
    const { mortgageRepayment } = maleLifeExpectancy.cost;
    const expectedHeading = maleLifeExpectancy.expected.title;
    const expectedDescription = maleLifeExpectancy.expected.paragraph1;
    const expectedDescription2 = maleLifeExpectancy.expected.paragraph2;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'life-expectancy-callout',
      'life-expectancy-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await expect(callout.paragraph2).toHaveText(expectedDescription2);
  });

  test('Verify next steps content when user’s estimated retirement income might need to last for over based on female life expectancy', async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } =
      femaleLifeExpectancy.aboutYou;
    const { pensionValue } = femaleLifeExpectancy.income;
    const { mortgageRepayment } = femaleLifeExpectancy.cost;
    const expectedHeading = femaleLifeExpectancy.expected.title;
    const expectedDescription = femaleLifeExpectancy.expected.paragraph1;
    const expectedDescription2 = femaleLifeExpectancy.expected.paragraph2;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'life-expectancy-callout',
      'life-expectancy-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await expect(callout.paragraph2).toHaveText(expectedDescription2);
  });

  test('Verify next steps content when user’s estimated retirement income might need to last for over not displayed based on male life expectancy with retire age 84', async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } =
      maleLifeExpectancyWithRetireAge84.aboutYou;
    const { pensionValue } = maleLifeExpectancyWithRetireAge84.income;
    const { mortgageRepayment } = maleLifeExpectancyWithRetireAge84.cost;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    await basePage.pageHeading(page, 'Results').waitFor();
    const callout = page.getByTestId('life-expectancy-callout');
    await expect(callout).toHaveCount(0);
    await basePage.clickTab(page, 'About you');
    await basePage.pageHeading(page, 'About you').waitFor();
    await aboutYouPage.fillRetirementAgeAndContinue(page, '85');
    await basePage.pageHeading(page, 'Retirement income').waitFor();
    await basePage.clickTab(page, 'Results');
    await basePage.pageHeading(page, 'Results').waitFor();

    const calloutAfterRetrireAgeChanged = page.getByTestId(
      'life-expectancy-callout',
    );
    await expect(calloutAfterRetrireAgeChanged).toHaveCount(0);
  });

  test('Verify next steps content when user’s estimated retirement income might need to last for over not displayed based on female life expectancy with retire age 87', async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } =
      femaleLifeExpectancyWithRetireAge87.aboutYou;
    const { pensionValue } = femaleLifeExpectancyWithRetireAge87.income;
    const { mortgageRepayment } = femaleLifeExpectancyWithRetireAge87.cost;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    await basePage.pageHeading(page, 'Results').waitFor();
    const callout = page.getByTestId('life-expectancy-callout');
    await expect(callout).toHaveCount(0);
    await basePage.clickTab(page, 'About you');
    await basePage.pageHeading(page, 'About you').waitFor();
    await aboutYouPage.fillRetirementAgeAndContinue(page, '88');
    await basePage.pageHeading(page, 'Retirement income').waitFor();
    await basePage.clickTab(page, 'Results');
    const calloutAfterRetrireAgeChanged = page.getByTestId(
      'life-expectancy-callout',
    );
    await expect(calloutAfterRetrireAgeChanged).toHaveCount(0);
  });

  test('Verify next steps content when user plans to retire before they can claim the State Pension', async ({
    page,
  }) => {
    const { day, month, year, retireAge } =
      retireBeforeStatePensionAge.aboutYou;
    const { pensionValue, statePensionValue } =
      retireBeforeStatePensionAge.income;
    const { mortgageRepayment } = retireBeforeStatePensionAge.cost;
    const expectedHeading = retireBeforeStatePensionAge.expected.title;
    const expectedDescription = retireBeforeStatePensionAge.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillAnyAccordion(
      page,
      'formstatePensionId',
      statePensionValue,
      statePensionTitle,
      statePensionDescription,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'retire-before-state-pension-age-callout',
      'retire-before-state-pension-age-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await basePage.clickTab(page, 'About you');
    await basePage.pageHeading(page, 'About you').waitFor();
    await aboutYouPage.fillRetirementAgeAndContinue(page, '68');
    await basePage.clickTab(page, 'Results');
    const calloutAfterChange = page.getByTestId(
      'retire-before-state-pension-age-callout',
    );
    await expect(calloutAfterChange).toHaveCount(0);
  });

  test('Verify next steps content when user has to repay their mortgage in retirement', async ({
    page,
  }) => {
    const { day, month, year, retireAge } = repayMortgageInRetirement.aboutYou;
    const { pensionValue } = repayMortgageInRetirement.income;
    const { mortgageRepayment } = repayMortgageInRetirement.cost;
    const expectedHeading = repayMortgageInRetirement.expected.title;
    const expectedDescription = repayMortgageInRetirement.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-mortgage-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
  });

  test('Verify next steps gender pay gap', async ({ page }) => {
    const { day, month, year, retireAge } = genderPayGap.aboutYou;
    const { pensionValue } = genderPayGap.income;
    const { mortgageRepayment } = genderPayGap.cost;
    const expectedHeading = genderPayGap.expected.title;
    const expectedDescription = genderPayGap.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-gender-gap-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
  });

  test('Verify next steps Plan to reduce your borrowing after you retire when credit card field has value', async ({
    page,
  }) => {
    const { day, month, year, retireAge } =
      reduceBorrowingAfterRetirementWithCreditCard.aboutYou;
    const { pensionValue } =
      reduceBorrowingAfterRetirementWithCreditCard.income;
    const { mortgageRepayment, creditCardRepayment } =
      reduceBorrowingAfterRetirementWithCreditCard.cost;
    const expectedHeading =
      reduceBorrowingAfterRetirementWithCreditCard.expected.title;
    const expectedDescription =
      reduceBorrowingAfterRetirementWithCreditCard.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillAnyAccordion(
      page,
      'formloansId',
      creditCardRepayment,
      'Borrowing',
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-borrowing-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
  });

  test('Verify next steps Plan to reduce your borrowing after you retire when loans field has value', async ({
    page,
  }) => {
    const { day, month, year, retireAge } =
      reduceBorrowingAfterRetirementWithLoan.aboutYou;
    const { pensionValue } = reduceBorrowingAfterRetirementWithLoan.income;
    const { mortgageRepayment, loanRepayment } =
      reduceBorrowingAfterRetirementWithLoan.cost;
    const expectedHeading =
      reduceBorrowingAfterRetirementWithLoan.expected.title;
    const expectedDescription =
      reduceBorrowingAfterRetirementWithLoan.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillAnyAccordion(
      page,
      'formloansId',
      loanRepayment,
      'Borrowing',
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-borrowing-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
  });

  test('Verify next steps Check if you qualify for social housing in retirement', async ({
    page,
  }) => {
    const { day, month, year, retireAge } =
      qualifyForSocialHousingInRetirement.aboutYou;
    const { pensionValue } = qualifyForSocialHousingInRetirement.income;
    const { rentOrCareHomeFee } = qualifyForSocialHousingInRetirement.cost;
    const expectedHeading = qualifyForSocialHousingInRetirement.expected.title;
    const expectedDescription =
      qualifyForSocialHousingInRetirement.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );

    await retirementCostsPage.fillValuesAndContinue(
      page,
      rentOrCareHomeFee,
      'formrentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-social-housing-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
  });

  test("Verify next steps card 'Check you're claiming everything you're entitled to' via Benefit payments", async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } = claimingBenefits.aboutYou;
    const { pensionValue, benefits } = claimingBenefits.income;
    const { mortgageRepayment } = claimingBenefits.cost;
    const expectedHeading = claimingBenefits.expected.title;
    const expectedDescription = claimingBenefits.expected.paragraph1;
    const expectedDescription2 = claimingBenefits.expected.paragraph2;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );
    await retirementIncomePage.fillAnyAccordion(
      page,
      'formbenefitsPayId',
      benefits,
      otherRetirementIncomeTitle,
      benefitsLabel,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    await basePage.pageHeading(page, 'Results').waitFor();
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-benefits-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toContainText(expectedDescription);
    await expect(callout.paragraph2).toContainText(expectedDescription2);
  });

  test("Verify next steps card 'Check if you can boost your State Pension'", async ({
    page,
  }) => {
    const { day, month, year, retireAge } = boostStatePension.aboutYou;
    const { pensionValue, statePensionValue } = boostStatePension.income;
    const { mortgageRepayment } = boostStatePension.cost;
    const expectedHeading = boostStatePension.expected.title;
    const expectedDescription = boostStatePension.expected.paragraph1;

    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillAnyAccordion(
      page,
      'formstatePensionId',
      statePensionValue,
      statePensionTitle,
      statePensionDescription,
    );
    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-state-pension-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toHaveText(expectedDescription);
    await basePage.clickTab(page, 'About you');
    await basePage.pageHeading(page, 'About you').waitFor();
    await aboutYouPage.fillValuesAndContinue(page, '1', '2', '1956', '75');
    await basePage.clickTab(page, 'Results');
    const calloutAfterChange = page.getByTestId('callout-default');
    await expect(calloutAfterChange).toHaveCount(0);
    await basePage.clickTab(page, 'About you');
    await basePage.pageHeading(page, 'About you').waitFor();
    await aboutYouPage.fillValuesAndContinue(page, day, month, year, retireAge);
    await retirementIncomePage.fillAnyAccordion(
      page,
      'formstatePensionId',
      '300',
      statePensionTitle,
      statePensionDescription,
    );
    await basePage.clickButton(page, 'Continue');
    await basePage.pageHeading(page, 'Retirement costs').waitFor();
    await basePage.clickTab(page, 'Results');
    const calloutAfterStatePensionChanged = page.getByTestId('callout-default');
    await expect(calloutAfterStatePensionChanged).toHaveCount(0);
  });

  test("Verify next steps card 'Check you're claiming everything you're entitled to' when annual income is below threshold(227.10 per week)", async ({
    page,
  }) => {
    const { day, month, year, retireAge, gender } =
      claimingEverythingEntitled.aboutYou;
    const { pensionValue } = claimingEverythingEntitled.income;
    const { mortgageRepayment } = claimingEverythingEntitled.cost;
    const expectedHeading = claimingEverythingEntitled.expected.title;
    const expectedDescription = claimingEverythingEntitled.expected.paragraph1;
    const expectedDescription2 = claimingEverythingEntitled.expected.paragraph2;

    await aboutYouPage.fillValuesAndContinue(
      page,
      day,
      month,
      year,
      retireAge,
      gender,
    );

    await retirementIncomePage.fillPersonalPensionValueAndContinue(
      page,
      'formprivatePensionId',
      pensionValue,
    );
    await retirementCostsPage.fillValuesAndContinue(
      page,
      mortgageRepayment,
      'formmortgageRepaymentId',
    );
    await basePage.pageHeading(page, 'Results').waitFor();
    const callout = await resultsPage.getCalloutComponent(
      page,
      'callout-default',
      'summary-results-benefits-title',
    );
    await expect(callout.title).toHaveText(expectedHeading);
    await expect(callout.paragraph1).toContainText(expectedDescription);
    await expect(callout.paragraph2).toContainText(expectedDescription2);
  });
});
