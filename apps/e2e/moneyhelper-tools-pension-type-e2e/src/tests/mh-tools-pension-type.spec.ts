/* eslint-disable playwright/no-conditional-expect, playwright/no-conditional-in-test */

import resultsPageData from '@data/results-page.data.json';
import { expect, test } from '@lib/test.lib';

const fullAnswerFlow = [
  // Was your pension set up by your employer?
  'Yes',

  // Did your pension come from working for one of the following:
  'No',

  // Is your pension provider one of the following:
  'Not sure',

  // When did you start this pension?
  '2000 or later',
];

test.describe('Pension type tool', () => {
  test.beforeEach(async ({ setCookieControl, page }) => {
    await setCookieControl();
    await page.goto('/en/pension-type/question-1');
  });

  test('end-to-end happy path', async ({
    questionPage,
    checkAnswersPage,
    resultsPage,
  }) => {
    const expectedResultsHeading =
      'In most cases, you’ll have a defined contribution pension';

    await questionPage.answerQuestions(fullAnswerFlow);

    await expect(checkAnswersPage.header).toHaveText('Check your answers');
    await expect(checkAnswersPage.changeAnswerLinks).toHaveCount(
      fullAnswerFlow.length,
    );

    await checkAnswersPage.continueButton.click();
    await expect(resultsPage.header).toHaveText(expectedResultsHeading);
  });

  test('skips question after question 1', async ({
    questionPage,
    checkAnswersPage,
    page,
  }) => {
    await questionPage.answerQuestions(fullAnswerFlow);
    await expect(checkAnswersPage.header).toHaveText('Check your answers');

    await checkAnswersPage.getChangeButtonByIndex(1).click();

    await expect(questionPage.header).toHaveText(
      'Was your pension set up by your employer?',
    );

    await questionPage.selectOptionAndContinue('No');

    // When selecting "No" on the first question, go directly to the check your answers page.
    await expect(checkAnswersPage.header).toHaveText('Check your answers');
    await expect(checkAnswersPage.changeAnswerLinks).toHaveCount(1);

    await checkAnswersPage.continueButton.click();

    await expect(page).toHaveURL(/results\?q-1=1$/);
  });

  /**
   * This is an odd test, this may need removing...
   * The "Book a free appointment" button doesn't exist anymore in the current main branch.
   * However it does appear on production.
   *
   * Most likely an old test, I'll keep this negative test here for now.
   */
  test('shows correct results page based on answers', async ({
    page,
    checkAnswersPage,
    resultsPage,
  }) => {
    for await (const scenario of resultsPageData) {
      await test.step(scenario.name, async () => {
        const { endpoint, header, questionCount } = scenario;

        await page.goto(endpoint);

        await expect(checkAnswersPage.header).toHaveText('Check your answers');
        await expect(checkAnswersPage.changeAnswerLinks).toHaveCount(
          questionCount,
        );

        await checkAnswersPage.continueButton.click();

        await expect(resultsPage.header).toHaveText(header);

        if (scenario.hasAppointmentButton) {
          await expect(resultsPage.bookAppointmentButton).toBeVisible();
        } else {
          await expect(resultsPage.bookAppointmentButton).toBeHidden();
        }
      });
    }
  });
});
