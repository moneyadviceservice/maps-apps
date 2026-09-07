import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import checkAnswersPage from '../pages/checkAnswersPage';

const checkAnswersUrl =
  '/en/change-options?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0';
const checkAnswersUrlToQuestion9 =
  '/en/change-options?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0';

const reviewRows = [
  {
    ac: 'AC4',
    questionNumber: 1,
    questionText: 'What is the main thing you’d like help with?',
    responseText: 'How my pension works',
    expectedUrl: /\/en\/question-1/,
  },
  {
    ac: 'AC5',
    questionNumber: 2,
    questionText: 'Do you plan to retire in the next 10 years?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-2/,
  },
  {
    ac: 'AC6',
    questionNumber: 3,
    questionText: 'Do you have an employer?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-3/,
  },
  {
    ac: 'AC7',
    questionNumber: 4,
    questionText: 'Do you currently pay into any pension scheme?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-4/,
  },
  {
    ac: 'AC8',
    questionNumber: 5,
    questionText: 'Which types of pension do you have?',
    responseText: 'Defined contribution',
    expectedUrl: /\/en\/question-5/,
  },
  {
    ac: 'AC9',
    questionNumber: 6,
    questionText: 'Are you considering bringing multiple pensions together?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-6/,
  },
  {
    ac: 'AC10',
    questionNumber: 7,
    questionText: 'Do you plan to retire outside the UK?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-7/,
  },
  {
    ac: 'AC11',
    questionNumber: 8,
    questionText:
      'Are you going through a divorce or ending a civil partnership?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-8/,
  },
  {
    ac: 'AC12',
    questionNumber: 9,
    questionText: 'What housing costs do you expect to have in retirement?',
    responseText: 'Rent – private landlord',
    expectedUrl: /\/en\/question-9/,
  },
  {
    ac: 'AC13',
    questionNumber: 10,
    questionText: 'Are you struggling to pay your bills or debts?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-10/,
  },
  {
    ac: 'AC14',
    questionNumber: 11,
    questionText: 'Have you had debt advice?',
    responseText: 'Yes',
    expectedUrl: /\/en\/question-11/,
  },
];

/**
 * @tests User Story 46495
 * @test Test Case: AC1 Verify Check your answers content matches expected copy
 * @test Test Case: AC2 Verify back link navigates to Question 9
 * @test Test Case: AC3 Verify review list has 11 questions, answers and change links
 * @test Test Case: AC4-AC14 Verify each review row contains response and change link navigates to expected question
 * @test Test Case: AC15 Verify clicking See your results navigates to results
 */

test.describe('Retirement Guidance - Check your answers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(checkAnswersUrl);
    await checkAnswersPage.waitForPage(page);
  });

  test('AC1: Verify Check your answers content matches expected copy', async ({
    page,
  }) => {
    await expect(checkAnswersPage.getPageHeading(page)).toHaveText(
      'Check your answers',
    );
    await expect(checkAnswersPage.getPageDescription(page)).toBeVisible();
    await expect(checkAnswersPage.getContinueButton(page)).toHaveText(
      'See your results',
    );
  });

  test('AC2: Verify back link navigates to Question 9', async ({ page }) => {
    await page.goto(checkAnswersUrlToQuestion9);
    await checkAnswersPage.waitForPage(page);
    await basePage.clickBackLink(page);

    await expect(page).toHaveURL(/\/en\/question-9/);
  });

  test('AC3: Verify review list has 11 questions, answers and change links', async ({
    page,
  }) => {
    await expect(checkAnswersPage.getAllQuestionTitles(page)).toHaveCount(11);
    await expect(checkAnswersPage.getAllQuestionAnswers(page)).toHaveCount(11);
    await expect(checkAnswersPage.getAllChangeButtons(page)).toHaveCount(11);
  });

  for (const row of reviewRows) {
    test(`${row.ac}: Verify row ${row.questionNumber} response and Change link`, async ({
      page,
    }) => {
      await expect(
        checkAnswersPage.getQuestionTitle(page, row.questionNumber),
      ).toHaveText(row.questionText);
      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).toContainText(row.responseText);

      await checkAnswersPage.clickChangeButton(page, row.questionNumber);
      await expect(page).toHaveURL(row.expectedUrl);
    });
  }

  test('AC15: Verify clicking See your results navigates to results', async ({
    page,
  }) => {
    await checkAnswersPage.clickContinue(page);

    await expect(page).toHaveURL(/\/en\/results/);
  });
});
