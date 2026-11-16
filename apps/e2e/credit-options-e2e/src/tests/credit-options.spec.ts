import { expect, test } from '@lib/test.lib';
import {
  HaveYouBeenRefusedCredit,
  HowGoodIsYourCreditScore,
  HowLongToWait,
  HowQuicklyToRepay,
  MoneyPurpose,
} from '@utils/answers.util';

test.describe('credit options', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 59558 - Complete the credit options journey and change answers
   */
  test('can change answers', async ({ pages }) => {
    await pages.startPage.goto();

    await pages.startPage.field('answer').fill('10000');
    await pages.startPage.continueButton.click();

    await pages.whatsTheMoneyFor.option('Buy a car').click();
    await pages.whatsTheMoneyFor.continueButton.click();

    await pages.howLongCanYouWait.option('A few hours').click();
    await pages.howLongCanYouWait.continueButton.click();

    await pages.howQuicklyCanYouRepay.option('Less than a month').click();
    await pages.howQuicklyCanYouRepay.continueButton.click();

    await pages.haveYouBeenRefusedCredit.option('Yes').click();
    await pages.haveYouBeenRefusedCredit.continueButton.click();

    await pages.creditScore.option('Good or excellent').click();
    await pages.creditScore.continueButton.click();

    /**
     * Check we're on the right page first.
     */
    await expect(pages.checkYourAnswers.title).toHaveText(
      'Your options for borrowing money',
    );
    await expect(pages.checkYourAnswers.subHeader).toHaveText(
      'Check your answers',
    );

    const {
      howMuchToBorrow,
      whatsTheMoneyFor,
      howLongToWait,
      howQuicklyToRepay,
      haveYouBeenRefusedCredit,
      howGoodIsYourCreditScore,
    } = pages.checkYourAnswers.tableCells;

    await expect(howMuchToBorrow).toHaveText('£10000');
    await expect(whatsTheMoneyFor).toHaveText('Buy a car');
    await expect(howLongToWait).toHaveText('A few hours');
    await expect(howQuicklyToRepay).toHaveText('Less than a month');
    await expect(haveYouBeenRefusedCredit).toHaveText('Yes');
    await expect(howGoodIsYourCreditScore).toHaveText('Good or excellent');

    /**
     * Change the how much to borrow answer.
     */
    await pages.checkYourAnswers.changeButtons.howMuchToBorrow.click();

    await expect(pages.startPage.field('answer')).toHaveValue('10,000');

    await pages.startPage.field('answer').clear();
    await pages.startPage.field('answer').fill('1500');
    await pages.startPage.continueButton.click();

    /**
     * Check the value has changed.
     */
    await expect(howMuchToBorrow).toHaveText('£1500');

    /**
     * Check non of the other fields have been changed too.
     */
    await expect(whatsTheMoneyFor).toHaveText('Buy a car');
    await expect(howLongToWait).toHaveText('A few hours');
    await expect(howQuicklyToRepay).toHaveText('Less than a month');
    await expect(haveYouBeenRefusedCredit).toHaveText('Yes');
    await expect(howGoodIsYourCreditScore).toHaveText('Good or excellent');
  });

  /**
   * @tests 59560 - Ensure back link works on 'Check your answers' page
   */
  test('back link works', async ({ pages }) => {
    await pages.checkYourAnswers.goto({
      borrowAmount: 1500,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AFewHours,
      howQuicklyCanYouRepay: HowQuicklyToRepay.LessThanAMonth,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.GoodOrExcellent,
    });

    await pages.checkYourAnswers.backButton.click();

    await expect(pages.creditScore.subHeader).toHaveText(
      'How good is your credit score?',
    );

    await expect(pages.creditScore.option('Good or excellent')).toBeChecked();
  });

  /**
   * @tests 59567 - The start again button resets you to the start with no pre-populated inputs
   */
  test('start again button resets you to the start', async ({
    pages,
    page,
  }) => {
    await pages.resultsPage.goto({
      borrowAmount: 1500,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AFewHours,
      howQuicklyCanYouRepay: HowQuicklyToRepay.LessThanAMonth,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.GoodOrExcellent,
    });

    await pages.resultsPage.startAgainButton.click();

    await expect(page).toHaveURL(/question-1\?restart=true$/);
    await expect(pages.howMuchToBorrowPage.field('answer')).toHaveValue('');
    await expect(pages.howMuchToBorrowPage.subHeader).toHaveText(
      'How much do you need to borrow?',
    );
  });

  /**
   * @tests 59562 - A user is shown no borrowing options when user has had refused credit
   */
  test('shows correct borrowing options for refused credit', async ({
    pages,
  }) => {
    await pages.startPage.goto();

    await pages.startPage.field('answer').fill('27000');
    await pages.startPage.continueButton.click();

    await pages.whatsTheMoneyFor.option('Pay off or combine debt').click();
    await pages.whatsTheMoneyFor.continueButton.click();

    await pages.howLongCanYouWait.option('A week or more').click();
    await pages.howLongCanYouWait.continueButton.click();

    await pages.howQuicklyCanYouRepay.option('Over 2 years').click();
    await pages.howQuicklyCanYouRepay.continueButton.click();

    await pages.haveYouBeenRefusedCredit.option('Yes').click();
    await pages.haveYouBeenRefusedCredit.continueButton.click();

    await pages.creditScore.option('Fair or ok').click();
    await pages.creditScore.continueButton.click();

    await pages.checkYourAnswers.submitButton.click();

    const expectedHeader = pages.resultsPage.findHeader(
      'There are no results for your search.',
    );

    await expect(expectedHeader).toBeVisible();
  });

  /**
   * @tests 59565 - A user is shown suitable types of borrowing on the results page
   */
  test('shows suitable types of borrowing on results', async ({ pages }) => {
    await pages.resultsPage.goto({
      borrowAmount: 400,
      whatsTheMoneyFor: MoneyPurpose.EssentialItems,
      howLongCouldYouWait: HowLongToWait.AFewDays,
      howQuicklyCanYouRepay: HowQuicklyToRepay.OneToSixMonths,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.Poor,
    });

    const headersToFind = [
      // Main headers
      'Borrowing options to consider',
      'Widely available options',
      'Good options, but may not be open to all',
      'Expensive options - use as a last resort',
      'Help applying for credit',

      // Sub headers
      'Buy Now Pay Later (BNPL)',
      'Loan from a credit union, if you become a member',
      'Budgeting Advance, if you get Universal Credit',
      'Store or catalogue credit',
    ];

    // Go through the list of headers and ensure they're all there.
    for (const header of headersToFind) {
      await expect(pages.resultsPage.findHeader(header)).toBeVisible();
    }
  });

  /**
   * @tests 59568 - A user is shown appropriate options when applying for a unplanned emergency
   */
  test('shows suitable types of borrowing for an unplanned emergency', async ({
    pages,
  }) => {
    await pages.resultsPage.goto({
      borrowAmount: 4800,
      whatsTheMoneyFor: MoneyPurpose.Emergency,
      howLongCouldYouWait: HowLongToWait.AWeekOrMore,
      howQuicklyCanYouRepay: HowQuicklyToRepay.LessThanAMonth,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.Poor,
    });

    const headersToFind = [
      // Main headers
      'Borrowing options to consider',
      'Good options, but may not be open to all',
      'Expensive options - use as a last resort',

      // Sub headers
      'Loan from a credit union, if you become a member',
      'Guarantor loan',
    ];

    // Go through the list of headers and ensure they're all there.
    for (const header of headersToFind) {
      await expect(pages.resultsPage.findHeader(header)).toBeVisible();
    }
  });

  /**
   * @tests 59569 - A user is shown the correct credit score suggestion when using 'Not Sure' for current credit score
   */
  test('shows credit score suggestionn when using not sure on current credit score', async ({
    pages,
  }) => {
    await pages.resultsPage.goto({
      borrowAmount: 9000,
      whatsTheMoneyFor: MoneyPurpose.Emergency,
      howLongCouldYouWait: HowLongToWait.AFewDays,
      howQuicklyCanYouRepay: HowQuicklyToRepay.SixMonthsToOneYear,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.NotSure,
    });

    const creditScoreMessage = pages.resultsPage.findHeader(
      'You might need a good credit score for some of these options',
    );

    await expect(creditScoreMessage).toBeVisible();

    await pages.resultsPage.goto({
      borrowAmount: 9000,
      whatsTheMoneyFor: MoneyPurpose.Emergency,
      howLongCouldYouWait: HowLongToWait.AFewDays,
      howQuicklyCanYouRepay: HowQuicklyToRepay.SixMonthsToOneYear,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.GoodOrExcellent,
    });

    await expect(creditScoreMessage).toBeHidden();
  });

  /**
   * @tests 59570 - A user is shown is shown a store or catalogue credit option when selecting Essential items as loan reason
   * @tests 59571 - A user is shown credit union suggestion when selecting the correct options
   */
  test('shows store/catalogue credit option and credit union option when selecting essential items', async ({
    pages,
  }) => {
    await pages.resultsPage.goto({
      borrowAmount: 500,
      whatsTheMoneyFor: MoneyPurpose.EssentialItems,
      howLongCouldYouWait: HowLongToWait.AFewDays,
      howQuicklyCanYouRepay: HowQuicklyToRepay.LessThanAMonth,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.GoodOrExcellent,
    });

    const headersToFind = [
      // Sub headers
      'Store or catalogue credit',
      'Loan from a credit union, if you become a member',
    ];

    // Go through the list of headers and ensure they're all there.
    for (const header of headersToFind) {
      await expect(pages.resultsPage.findHeader(header)).toBeVisible();
    }
  });

  /**
   * @tests 59573 - A user is shown a suggestion to check credit score on the "How good is your credit score page"
   */
  test('shows store or catalogue credit option when selecting essential items', async ({
    pages,
  }) => {
    await pages.creditScore.goto();

    await expect(pages.creditScore.additionlText).toHaveText(
      'Some products might not be available to you, depending on your credit score. If you’re not sure, see how to check your credit report for free.',
    );
  });

  /**
   * @tests 59574 - A user is shown the eligibility calculator / compare products message on no results page and on normal results page
   */
  test('shows an eligibility calculator and compare products message on results pages', async ({
    pages,
  }) => {
    await pages.resultsPage.goto({
      borrowAmount: 2000,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AWeekOrMore,
      howQuicklyCanYouRepay: HowQuicklyToRepay.OneToTwoYears,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.No,
      whatsYourCreditScore: HowGoodIsYourCreditScore.FairOrOk,
    });

    const eligibilityText =
      'Use eligibility calculators to compare products you might qualify for';

    await expect(pages.resultsPage.findHeader(eligibilityText)).toBeVisible();

    await pages.resultsPage.goto({
      borrowAmount: 47600,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AWeekOrMore,
      howQuicklyCanYouRepay: HowQuicklyToRepay.OneToTwoYears,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.Yes,
      whatsYourCreditScore: HowGoodIsYourCreditScore.Poor,
    });

    await expect(
      pages.resultsPage.findParagraph(eligibilityText),
    ).toBeVisible();
  });

  /**
   * @tests 59575 - Pressing submit with unpopulated options shows error messages
   */
  test('shows error messages when fields are not populated when submitting', async ({
    pages,
  }) => {
    await pages.startPage.goto();
    await pages.startPage.continueButton.click();

    const errorMsg = 'Please select an answer';

    await expect(pages.startPage.errorLabel).toContainText(errorMsg);
    await expect(pages.startPage.errorSummary).toContainText(errorMsg);

    await pages.startPage.field('answer').fill('100');
    await pages.startPage.continueButton.click();

    await pages.whatsTheMoneyFor.continueButton.click();

    await expect(pages.whatsTheMoneyFor.errorLabel).toContainText(errorMsg);
    await expect(pages.whatsTheMoneyFor.errorSummary).toContainText(errorMsg);
  });

  /**
   * @tests 59577 - Fields are pre-populated when going back to a previous question
   */
  test('pre-populates fields when navigating back', async ({ pages }) => {
    await pages.startPage.goto();

    const borrowValue = '100';

    await pages.startPage.field('answer').fill(borrowValue);
    await pages.startPage.continueButton.click();

    await pages.whatsTheMoneyFor.backButton.click();

    await expect(pages.startPage.subHeader).toHaveText(
      'How much do you need to borrow?',
    );
    await expect(pages.startPage.field('answer')).toHaveValue(borrowValue);
  });
});
