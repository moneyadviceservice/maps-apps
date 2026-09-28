import testData from '@data/pensionTypeData.json';
import { expect, test } from '@lib/test.lib';
import { CheckYourAnswersComponent } from '@pages/components/check-your-answers.component';
import { CommonComponent } from '@pages/components/common-component.component';
import { ResultsComponent } from '@pages/components/results.component';

const headings = testData.headings;
const titles = testData.titles;
const definedContributionContent = testData.definedContributionContent;
const removedDefinedContributionHeading =
  /From what you[’']ve told us you have a defined contribution pension/;
const definedContributionResultPaths = [
  'q-1=0&q-2=1&q-3=1&q-4=1',
  'q-1=0&q-2=1&q-3=0&q-4=1',
  'q-1=1&q-2=1&q-3=1&q-4=1',
  'q-1=0&q-2=1&q-3=1&q-4=2',
];

export enum SELECTION {
  Yes = '0',
  No = '1',
  dontKnow = '2',
}
export type SelectionKey = keyof typeof SELECTION;

export enum DATESELECTION {
  date1999 = '0',
  date2000 = '1',
  dontKnow = '2',
}
export type dateSelectionKey = keyof typeof DATESELECTION;

async function assertRemovedHeadingIsAbsent(
  commonComponent: CommonComponent,
  resultsComponent: ResultsComponent,
): Promise<number> {
  let verifiedPaths = 0;

  for (const language of ['en', 'cy'] as const) {
    for (const query of definedContributionResultPaths) {
      await resultsComponent.gotoResults(language, query);
      await resultsComponent.waitForResultsPage();
      await expect(
        resultsComponent.contentMatching(removedDefinedContributionHeading),
      ).toHaveCount(0);
      verifiedPaths += 1;
    }
  }

  return verifiedPaths;
}

async function progressToResults(
  commonComponent: CommonComponent,
  checkYourAnswersComponent: CheckYourAnswersComponent,
  resultsComponent: ResultsComponent,
  setUpBy: SelectionKey,
  pensionComeFrom: SelectionKey,
  pensionProvider?: SelectionKey,
  startDate?: dateSelectionKey,
  language: 'en' | 'cy' = 'en',
) {
  const checkYourAnswersTitle =
    language === 'cy' ? titles.checkYourAnswersCy : titles.checkYourAnswers;
  const questionTitles = {
    setUpBy: language === 'cy' ? titles.setUpByCy : titles.setUpBy,
    pensionComeFrom:
      language === 'cy' ? titles.pensionComeFromCy : titles.pensionComeFrom,
    pensionProvider:
      language === 'cy' ? titles.pensionProviderCy : titles.pensionProvider,
    pensionStartDate:
      language === 'cy' ? titles.pensionStartDateCy : titles.pensionStartDate,
  };

  await expect(commonComponent.title).toContainText(questionTitles.setUpBy);
  await commonComponent.getCheckbox(SELECTION[setUpBy]).click();
  await commonComponent.continueButton.click();
  await expect(commonComponent.title).toContainText(
    questionTitles.pensionComeFrom,
  );
  await commonComponent.getCheckbox(SELECTION[pensionComeFrom]).click();
  await commonComponent.continueButton.click();

  if (pensionProvider) {
    await expect(commonComponent.title).toContainText(
      questionTitles.pensionProvider,
    );
    await commonComponent.getCheckbox(SELECTION[pensionProvider]).click();
    await commonComponent.continueButton.click();
  }
  if (startDate != null) {
    await expect(commonComponent.title).toContainText(
      questionTitles.pensionStartDate,
    );
    await commonComponent.getCheckbox(DATESELECTION[startDate]).click();
    await commonComponent.continueButton.click();
  }
  await expect(commonComponent.title).toContainText(checkYourAnswersTitle);
  await Promise.all([
    resultsComponent.waitForResultsPage(),
    checkYourAnswersComponent.continueButton.click(),
  ]);
}

test.describe('Workplace Pension Calculator', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ commonComponent, setCookieControl }) => {
    await setCookieControl();
    await commonComponent.goto('/en/pension-type/question-1');
  });

  /**
   * @tests 54942 PTT-54942-001 - Verify "2001 or later" option is removed
   */
  test('Should not display the removed 2001 or later pension start option', async ({
    commonComponent,
    question1Page,
  }) => {
    await commonComponent.getCheckbox('0').click();
    await commonComponent.continueButton.click();
    await commonComponent.getCheckbox('1').click();
    await commonComponent.continueButton.click();
    await commonComponent.getCheckbox('1').click();
    await commonComponent.continueButton.click();

    await expect(commonComponent.title).toHaveText(titles.pensionStartDate);
    const answerOptions = await question1Page.getAnswerOptions();
    expect(answerOptions).toEqual([
      '1999 or before',
      '2000 or later',
      "Don't know",
    ]);
    expect(answerOptions).not.toContain('2001 or later');
  });

  /**
   * @tests 56326 - Shows correct results heading based on answers
   * @tests 54928 AC 1 Test Case 1 : Verify updated defined benefit guidance text is displayed - en
   * @tests 54928 AC 2 Test Case 1 : Verify updated defined benefit guidance text is display - Cy
   * @tests 56330 - Shows correct results button based on answers
   * @tests 56331 - Shows correct defined contribution content based on answers
   * @tests 56332 - Shows correct defined benefit content based on answers
   * @tests 54932 AC 1 Test Case 1 : Verify that users reach the "You might have a defined contribution pension"
   * @tests 54932 AC 2 Test Case 1 : Verify that users reach the "You might have a defined contribution pension" - Cy
   * @tests 54932 AC 3 Test Case 1 : Verify accessibility compliance
   * @tests 54942 AC 1 Test Case 1 : Verify removed Defined Contribution heading does not appear"
   * @tests 54942 AC 2 Test Case 1 : Verify "2001 or later" option is removed

   */
  test('Should show correct results heading from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'date2000',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'dontKnow',
      'No',
      'Yes',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'dontKnow',
      'No',
      'No',
      'date2000',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'dontKnow',
      'No',
      'dontKnow',
      'date2000',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[1]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'dontKnow',
      'date2000',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[2]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'dontKnow',
      'dontKnow',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[1]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'date1999',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.en[0]);
  });

  test('Should show the updated English defined contribution result copy', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );

    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toHaveText(headings.en[1]);
    for (const paragraph of definedContributionContent.en) {
      await expect(resultsComponent.content(paragraph)).toBeVisible();
    }
  });

  test('Should show the updated Welsh defined contribution result copy', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await commonComponent.goto('/cy/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
      'cy',
    );

    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toHaveText(headings.cy[1]);
    for (const paragraph of definedContributionContent.cy) {
      await expect(resultsComponent.content(paragraph)).toBeVisible();
    }
  });

  test('Should not display the removed defined contribution heading on any result path', async ({
    commonComponent,
    resultsComponent,
  }) => {
    expect(
      await assertRemovedHeadingIsAbsent(commonComponent, resultsComponent),
    ).toBe(definedContributionResultPaths.length * 2);
  });

  /**
   * @tests 54929 AC 1 - Verify updated defined contribution heading is displayed - en
   * @tests 54929 AC 2 - Verify updated defined contribution heading is displayed - cy
   */
  test('Should show the updated defined contribution result heading in English and Welsh', async ({
    resultsComponent,
  }) => {
    for (const language of ['en', 'cy'] as const) {
      await resultsComponent.gotoResults(language, 'q-1=0&q-2=1&q-3=1&q-4=1');
      await resultsComponent.waitForResultsPage();
      await expect(resultsComponent.heading).toHaveText(headings[language][2]);
    }
  });

  /**
   * @tests 54929 AC 1 - Verify updated defined contribution content is displayed - en
   * @tests 54929 AC 2 - Verify updated defined contribution content is displayed - cy
   */
  test('Should show the updated defined contribution result content in English and Welsh', async ({
    resultsComponent,
  }) => {
    for (const language of ['en', 'cy'] as const) {
      await resultsComponent.gotoResults(language, 'q-1=0&q-2=1&q-3=1&q-4=2');
      await resultsComponent.waitForResultsPage();

      for (const paragraph of definedContributionContent[language]) {
        if (
          paragraph.includes('contact our pension specialists') ||
          paragraph.includes("gysylltu â'n harbenigwyr pensiynau")
        ) {
          await expect(
            resultsComponent.contactPensionSpecialistsLinkForLanguage(language),
          ).toBeVisible();
          continue;
        }

        await expect(resultsComponent.content(paragraph)).toBeVisible();
      }
    }
  });

  test('Should not display the legacy defined contribution heading on any result path', async ({
    commonComponent,
    resultsComponent,
  }) => {
    expect(
      await assertRemovedHeadingIsAbsent(commonComponent, resultsComponent),
    ).toBe(definedContributionResultPaths.length * 2);
  });

  /**
   * @tests 54932 AC 3 Test Case 1 : Verify accessibility compliance
   */
  test('Should have no accessibility violations on defined contribution results', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );
    expect(await resultsComponent.getAccessibilityViolations()).toEqual([]);

    await commonComponent.goto('/cy/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
      'cy',
    );
    expect(await resultsComponent.getAccessibilityViolations()).toEqual([]);
  });

  test('Should show the updated Welsh defined benefit result heading', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await commonComponent.goto('/cy/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'No',
      'date1999',
      'cy',
    );
    await resultsComponent.waitForResultsPage();
    await expect(resultsComponent.heading).toContainText(headings.cy[0]);
  });

  test('Should show correct results content from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'Yes',
    );
    await expect(resultsComponent.definedContributionSchemesLink).toBeVisible();
    await commonComponent.goto('/en/pension-type/question-1');

    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      resultsComponent,
      'Yes',
      'No',
      'dontKnow',
      'dontKnow',
    );
    await expect(resultsComponent.contactPensionSpecialistsLink).toBeVisible();
  });
});
