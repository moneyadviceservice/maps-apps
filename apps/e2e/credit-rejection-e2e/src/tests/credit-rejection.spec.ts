import { expect, test } from '@lib/test.lib';

/**
 * Note:
 *
 * This test migration to Playwright is an MVP
 * The abstractions like page object model do not follow the usual conventions
 * for a questionnaire application, for example: debt-advice-locator
 *
 * A test regarding a bug check has been removed since it's from 2025.
 */

const fullAnswerFlow = [
  // Have you been declined for credit in the past six months?
  'No',

  // Have you checked your credit report for errors in the last month?
  'Yes',

  // Do you have any of these accounts in your name?
  'Household bill(s) - like gas, electricity, broadband, mobile phone and insurance',

  // Do any of the accounts in your name use old details?
  'Yes',

  // Are you paying back any borrowing?
  'No',

  // Do you always pay your bills on time?
  'No',

  // Have you registered to vote at your current address?
  'No',

  // Do you have joint finances with someone?
  'No',
];

test.describe('Credit rejection', () => {
  test.beforeEach(async ({ setCookieControl, page }) => {
    await setCookieControl();
    await page.goto('/en/');
  });

  test('can complete a end-to-end happy path', async ({
    page,
    questionPage,
    checkAnswersPage,
    yourActionPlanPage,
  }) => {
    await questionPage.answerQuestions(fullAnswerFlow);

    await expect(checkAnswersPage.header).toHaveText('Check your answers');
    await expect(checkAnswersPage.changeAnswerLinks).toHaveCount(
      fullAnswerFlow.length,
    );

    await checkAnswersPage.continueButton.click();

    await expect(yourActionPlanPage.header).toHaveText('Your action plan');

    const expandableSections =
      await yourActionPlanPage.expandableSections.all();

    for await (const section of expandableSections) {
      await section.click(); // Intentionally cause failure to prove it wont give false positive
      const sectionBody = yourActionPlanPage.getSectionBody(section);

      await expect(sectionBody).toBeVisible();
      await expect(sectionBody).not.toBeEmpty();
    }

    await expect(yourActionPlanPage.startAgainButton).toHaveAttribute(
      'href',
      '/en/question-1?restart=true',
    );

    await yourActionPlanPage.startAgainButton.click();

    await expect(page).toHaveURL(/question-1\?restart=true$/);
    await expect(questionPage.header).toHaveText(
      'Have you been declined for credit in the past six months?',
    );

    await expect(questionPage.allRadioInputs).toHaveCount(2);

    for (const radio of await questionPage.allRadioInputs.all()) {
      await expect(radio).not.toBeChecked();
    }
  });

  test('skips question 4 based on the answer to question 3', async ({
    page,
    questionPage,
    checkAnswersPage,
  }) => {
    await questionPage.answerQuestions(fullAnswerFlow);

    const changeAnswerButton = checkAnswersPage.getChangeButtonByIndex(3);
    await changeAnswerButton.click();

    const { header } = questionPage;

    await expect(header).toHaveText(
      'Do you have any of these accounts in your name?',
    );
    await questionPage.selectOptionAndContinue('None of these');

    await expect(header).toHaveText('Are you paying back any borrowing?');
    await questionPage.selectOptionAndContinue('Yes');

    await expect(header).toHaveText('Do you always pay your bills on time?');
    await questionPage.selectOptionAndContinue('No');

    await expect(header).toHaveText(
      'Have you registered to vote at your current address?',
    );
    await questionPage.selectOptionAndContinue('No');

    await expect(header).toHaveText('Do you have joint finances with someone?');
    await questionPage.selectOptionAndContinue('No');

    await expect(page).toHaveURL(/\/change-options\?/);
    await expect(checkAnswersPage.header).toHaveText('Check your answers');

    const answerText = checkAnswersPage.getAnswerByIndex(3);
    await expect(answerText).toHaveText('None of these');
  });

  test('shows correct results page based on selected answers', async ({
    page,
    yourActionPlanPage,
  }) => {
    // Pre-answered URL
    await page.goto('/en/results?q-1=1&q-2=0&q-3=2&q-5=1&q-6=0&q-7=0&q-8=1');

    const openBankAccountSection = yourActionPlanPage.getSectionTitleByName(
      'Open a bank account and/or set up Direct Debits',
    );
    const householdBillsSection = yourActionPlanPage.getSectionTitleByName(
      'Consider putting household bills in your name',
    );
    const eligibilityCheckerSection = yourActionPlanPage.getSectionTitleByName(
      'Before applying again, use an eligibility checker',
    );

    await expect(yourActionPlanPage.expandableSections).toHaveCount(3);
    await expect(openBankAccountSection).toBeVisible();
    await expect(householdBillsSection).toBeVisible();
    await expect(eligibilityCheckerSection).toBeVisible();
  });

  /**
   * @userStory 23991 - Credit Rejection: Text changes for english & welsh
   */
  test('has changed text under, have your registered to vote at your address', async ({
    page,
    questionPage,
  }) => {
    // Pre-answered URL starting at the right question
    await page.goto('/en/question-7?q-1=0&q-2=0&q-3=1&q-4=1&q-5=0&q-6=0');

    const { header, paragraph } = questionPage;

    await expect(header).toHaveText(
      'Have you registered to vote at your current address?',
    );
    await expect(paragraph).toHaveText(
      'Many lenders use the electoral register to verify your identity and where you live.',
    );

    await questionPage.selectOptionAndContinue('No');

    // Welsh version
    await page.goto('/cy/question-7?q-1=0&q-2=0&q-3=1&q-4=1&q-5=0&q-6=0');
    await expect(header).toHaveText(
      'Ydych chi wedi cofrestru i bleidleisio yn eich cyfeiriad presennol?',
    );
    await expect(paragraph).toHaveText(
      "Mae llawer o fenthycwyr yn defnyddio'r gofrestr etholiadol i wirio pwy ydych chi a ble rydych chi'n byw.",
    );
  });
});
