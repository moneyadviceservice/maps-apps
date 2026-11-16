import { checkYourAnswersScenarios } from '@data/checkYourAnswers.data';
import { expect, test } from '@lib/test.lib';

const scenarios = Object.values(checkYourAnswersScenarios);

test.describe('Pension type Check Your Answers - US-54927', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  for (const scenario of scenarios) {
    for (const startDateOption of scenario.startDateOptions) {
      /**
       * @tests 54927 - Verify bilingual Check Your Answers wording and values for each pension start-date option, exclude legacy values, and progress to results.
       */
      test(`54927: shows ${scenario.language} Check Your Answers for ${startDateOption.label} and reaches results`, async ({
        commonComponent,
        pensionStartDatePage,
        checkYourAnswersComponent,
        resultsComponent,
      }) => {
        await commonComponent.goto(scenario.startPath);

        for (const answer of scenario.previousAnswers) {
          await commonComponent.selectAnswerAndContinue(answer.value);
        }

        await expect(pensionStartDatePage.title).toHaveText(
          scenario.startDateQuestion.question,
        );
        const availableOptions = await pensionStartDatePage.getAnswerLabels();
        expect(availableOptions).toEqual(
          scenario.startDateOptions.map((option) => option.label),
        );

        await commonComponent.selectAnswerAndContinue(startDateOption.value);
        await expect(commonComponent.title).toHaveText(
          scenario.checkYourAnswersHeading,
        );
        await expect(checkYourAnswersComponent.answerRows).toHaveCount(4);

        const expectedAnswers = [
          ...scenario.previousAnswers,
          {
            ...scenario.startDateQuestion,
            answer: startDateOption.label,
          },
        ];

        for (const answer of expectedAnswers) {
          await expect(
            await checkYourAnswersComponent.answerTitle(answer.row),
          ).toHaveText(answer.question);
          await expect(
            await checkYourAnswersComponent.answerRow(answer.row),
          ).toContainText(answer.answer);
        }

        const displayedAnswers = (
          await checkYourAnswersComponent.getAnswerTexts()
        ).join(' ');
        for (const legacyAnswer of scenario.legacyAnswers) {
          expect(displayedAnswers).not.toContain(legacyAnswer);
        }

        await checkYourAnswersComponent.continueToResults();
        await resultsComponent.waitForResultsPage();
        await expect(resultsComponent.heading).toBeVisible();
      });
    }

    /**
     * @tests 54927 - Verify the Change link opens the selected question, preserves edited and prior answers, and allows progression to results in English and Welsh.
     */
    test(`54927: ${scenario.language} Change link updates the answer and preserves the rest`, async ({
      commonComponent,
      pensionStartDatePage,
      checkYourAnswersComponent,
      resultsComponent,
    }) => {
      const originalOption = scenario.startDateOptions[0];
      const updatedOption = scenario.startDateOptions[2];
      await commonComponent.goto(scenario.startPath);

      for (const answer of scenario.previousAnswers) {
        await commonComponent.selectAnswerAndContinue(answer.value);
      }
      await commonComponent.selectAnswerAndContinue(originalOption.value);
      await expect(commonComponent.title).toHaveText(
        scenario.checkYourAnswersHeading,
      );

      await checkYourAnswersComponent.changeAnswer('pensionStartDate');
      await expect(pensionStartDatePage.title).toHaveText(
        scenario.startDateQuestion.question,
      );
      await expect(
        pensionStartDatePage.answerInput(originalOption.value),
      ).toBeChecked();

      await pensionStartDatePage.selectAnswerAndContinue(updatedOption.value);
      await expect(commonComponent.title).toHaveText(
        scenario.checkYourAnswersHeading,
      );

      for (const answer of scenario.previousAnswers) {
        await expect(
          await checkYourAnswersComponent.answerTitle(answer.row),
        ).toHaveText(answer.question);
        await expect(
          await checkYourAnswersComponent.answerRow(answer.row),
        ).toContainText(answer.answer);
      }
      await expect(
        await checkYourAnswersComponent.answerRow('pensionStartDate'),
      ).toContainText(updatedOption.label);

      await checkYourAnswersComponent.continueToResults();
      await resultsComponent.waitForResultsPage();
      await expect(resultsComponent.heading).toBeVisible();
    });
  }
});
