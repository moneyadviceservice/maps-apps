import { pensionStartDateScenarios } from '@data/pensionStartDate.data';
import { expect, test } from '@lib/test.lib';

test.describe('Pension type start date question - US-54931', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /** @tests 54931 - Verify English tab title. */
  test('54931: displays the English browser tab title', async ({
    pensionStartDatePage,
  }) => {
    const scenario = pensionStartDateScenarios.en;
    await pensionStartDatePage.progressToQuestion(scenario.startPath);

    expect(await pensionStartDatePage.getBrowserTitle()).toBe(
      scenario.browserTitle,
    );
  });

  /** @tests 54931 - Verify Welsh tab title. */
  test('54931: displays the Welsh browser tab title', async ({
    pensionStartDatePage,
  }) => {
    const scenario = pensionStartDateScenarios.cy;
    await pensionStartDatePage.progressToQuestion(scenario.startPath);

    expect(await pensionStartDatePage.getBrowserTitle()).toBe(
      scenario.browserTitle,
    );
  });

  /** @tests 54931 - Verify English heading text. */
  test('54931: displays the English start-date heading', async ({
    pensionStartDatePage,
  }) => {
    const scenario = pensionStartDateScenarios.en;
    await pensionStartDatePage.progressToQuestion(scenario.startPath);

    await expect(pensionStartDatePage.title).toHaveText(scenario.heading);
  });

  /** @tests 54931 - Verify Welsh heading text. */
  test('54931: displays the Welsh start-date heading', async ({
    pensionStartDatePage,
  }) => {
    const scenario = pensionStartDateScenarios.cy;
    await pensionStartDatePage.progressToQuestion(scenario.startPath);

    await expect(pensionStartDatePage.title).toHaveText(scenario.heading);
  });

  for (const scenario of Object.values(pensionStartDateScenarios)) {
    test(`54931: displays only the expected three ${scenario.language} options`, async ({
      pensionStartDatePage,
    }) => {
      await pensionStartDatePage.progressToQuestion(scenario.startPath);

      const answerLabels = await pensionStartDatePage.getAnswerLabels();
      expect(answerLabels).toEqual(
        scenario.options.map((option) => option.label),
      );
      expect(answerLabels).toHaveLength(3);
      expect(answerLabels).toContain(scenario.notSureOption);

      for (const removedOption of scenario.removedOptions) {
        expect(answerLabels).not.toContain(removedOption);
      }
    });

    for (const option of scenario.options) {
      test(`54931: completes the ${scenario.language} journey for "${option.label}"`, async ({
        pensionStartDatePage,
        checkYourAnswersComponent,
        resultsComponent,
      }) => {
        await pensionStartDatePage.progressToQuestion(scenario.startPath);
        await expect(pensionStartDatePage.title).toHaveText(scenario.heading);

        await pensionStartDatePage.selectAnswerAndContinue(option.value);

        await expect(pensionStartDatePage.title).toHaveText(
          scenario.checkYourAnswersHeading,
        );
        await expect(
          await checkYourAnswersComponent.answerRow('pensionStartDate'),
        ).toContainText(option.label);

        await checkYourAnswersComponent.continueButton.click();
        await resultsComponent.waitForResultsPage();
        await expect(resultsComponent.heading).toBeVisible();
        await expect(resultsComponent.heading).not.toContainText(/error/i);
      });
    }
  }
});
