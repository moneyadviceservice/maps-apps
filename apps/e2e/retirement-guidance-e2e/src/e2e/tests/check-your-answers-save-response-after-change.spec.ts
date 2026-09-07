import { expect, test } from '@playwright/test';

import { basePage } from '../pages/basePage';
import checkAnswersPage from '../pages/checkAnswersPage';

const checkAnswersUrl =
  '/en/change-options?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0&q-7=0&q-8=0&q-9=0&q-10=0&q-11=0';

const radioChangeResponseRows = [
  {
    ac: 'AC1',
    questionNumber: 1,
    expectedUrl: /\/en\/question-1/,
    originalResponseText: 'How my pension works',
    updatedResponseText: 'How to grow my pension',
    updatedOptionText: 'How to grow my pension',
  },
  {
    ac: 'AC2',
    questionNumber: 2,
    expectedUrl: /\/en\/question-2/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC3',
    questionNumber: 3,
    expectedUrl: /\/en\/question-3/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No, I’m self-employed',
    updatedOptionText: 'No, I’m self-employed',
  },
  {
    ac: 'AC4',
    questionNumber: 4,
    expectedUrl: /\/en\/question-4/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC6',
    questionNumber: 6,
    expectedUrl: /\/en\/question-6/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC7',
    questionNumber: 7,
    expectedUrl: /\/en\/question-7/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC8',
    questionNumber: 8,
    expectedUrl: /\/en\/question-8/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC9',
    questionNumber: 9,
    expectedUrl: /\/en\/question-9/,
    originalResponseText: 'Rent – private landlord',
    updatedResponseText: 'Mortgage',
    updatedOptionText: 'Mortgage',
  },
  {
    ac: 'AC10',
    questionNumber: 10,
    expectedUrl: /\/en\/question-10/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
  {
    ac: 'AC11',
    questionNumber: 11,
    expectedUrl: /\/en\/question-11/,
    originalResponseText: 'Yes',
    updatedResponseText: 'No',
    updatedOptionText: 'No',
  },
];

const checkboxChangeResponseRows = [
  {
    ac: 'AC5',
    questionNumber: 5,
    expectedUrl: /\/en\/question-5/,
    originalResponseText: 'Defined contribution',
    updatedResponseText: 'State Pension',
    optionsToToggle: ['Defined contribution', 'State Pension'],
  },
];

/**
 * @tests User Story 46496
 * @test Test Case: AC1-AC11 Update each response from Check your answers and save changes
 */

test.describe('Retirement Guidance - Check your answers - Save response after change', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(checkAnswersUrl);
    await checkAnswersPage.waitForPage(page);
  });

  for (const row of radioChangeResponseRows) {
    test(`${row.ac}: Update response for Question ${row.questionNumber} and save changes`, async ({
      page,
    }) => {
      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).toContainText(row.originalResponseText);

      await checkAnswersPage.clickChangeButton(page, row.questionNumber);
      await expect(page).toHaveURL(row.expectedUrl);

      await basePage.clickRadioOption(page, row.updatedOptionText);

      await page.getByRole('button', { name: /Save changes|Continue/ }).click();
      await checkAnswersPage.waitForPage(page);

      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).toContainText(row.updatedResponseText);
      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).not.toContainText(row.originalResponseText);
    });
  }

  for (const row of checkboxChangeResponseRows) {
    test(`${row.ac}: Update response for Question ${row.questionNumber} and save changes`, async ({
      page,
    }) => {
      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).toContainText(row.originalResponseText);

      await checkAnswersPage.clickChangeButton(page, row.questionNumber);
      await expect(page).toHaveURL(row.expectedUrl);

      for (const option of row.optionsToToggle) {
        await basePage.clickCheckboxOption(page, option);
      }

      await page.getByRole('button', { name: /Save changes|Continue/ }).click();
      await checkAnswersPage.waitForPage(page);

      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).toContainText(row.updatedResponseText);
      await expect(
        checkAnswersPage.getQuestionAnswer(page, row.questionNumber),
      ).not.toContainText(row.originalResponseText);
    });
  }
});
