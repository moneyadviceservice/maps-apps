import { Page } from '@playwright/test';

import checkAnswersPage from '../pages/checkAnswersPage';
import resultsPage from '../pages/resultsPage';

/**
 * Configuration for a question that can be changed via check answers page
 */
export interface QuestionConfig<T = string> {
  /** Question number (1-11) */
  questionNumber: number;
  /** Current answer value */
  currentAnswer: T;
  /** Previous answer value */
  previousAnswer: T;
  /** Function to convert answer to URL index */
  getAnswerIndex: (answer: T) => number;
  /** Page object for this question (must have waitForPage method) */
  questionPage: { waitForPage: (page: Page) => Promise<void> };
  /** Function to select the answer on the question page */
  selectAnswer: (page: Page, answer: T) => Promise<void>;
}

/**
 * Default answer to index mappers for common question types
 */
export const answerIndexMappers = {
  /** Yes=0, No=1, Not sure=2 */
  yesNoNotSure: (answer: string): number => {
    const answers = ['Yes', 'No', 'Not sure'];
    return answers.indexOf(answer);
  },
  /** Yes=0, No=1 */
  yesNo: (answer: string): number => {
    return answer === 'Yes' ? 0 : 1;
  },
  /** Employment status: Yes=0, Self-employed=1, Not employed=2 */
  employmentStatus: (answer: string): number => {
    const answers = ['Yes', "No, I'm self-employed", "No, I'm not employed"];
    return answers.indexOf(answer);
  },
};

/**
 * Navigates to check answers page and updates only the questions that have changed.
 * Uses the "smart navigation" pattern to skip full questionnaire flow.
 *
 * @param page - Playwright page object
 * @param baseAnswers - Array of 11 answer indices representing the baseline state
 * @param questionsToUpdate - Array of question configurations to potentially update
 *
 * @example
 * ```typescript
 * await navigateCheckAnswersAndUpdate(page,
 *   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Base answers (all index 0)
 *   [
 *     {
 *       questionNumber: 11,
 *       currentAnswer: 'No',
 *       previousAnswer: 'Yes',
 *       getAnswerIndex: answerIndexMappers.yesNo,
 *       questionPage: question11Page,
 *       selectAnswer: async (page, answer) => basePage.clickRadioOption(page, answer)
 *     }
 *   ]
 * );
 * ```
 */
export async function navigateCheckAnswersAndUpdate<T = string>(
  page: Page,
  baseAnswers: number[],
  questionsToUpdate: QuestionConfig<T>[],
): Promise<void> {
  // Build check answers URL with base answers
  const queryParams = baseAnswers
    .map((index, i) => `q-${i + 1}=${index}`)
    .join('&');
  const checkAnswersUrl = `/en/change-options?${queryParams}`;

  // Navigate to check answers page
  await page.goto(checkAnswersUrl);
  await checkAnswersPage.waitForPage(page);

  // Update each question that has changed
  for (const question of questionsToUpdate) {
    const hasChanged = question.currentAnswer !== question.previousAnswer;

    if (hasChanged) {
      await checkAnswersPage.clickChangeButton(page, question.questionNumber);
      await question.questionPage.waitForPage(page);
      await question.selectAnswer(page, question.currentAnswer);
      await page.getByRole('button', { name: /Save changes|Continue/ }).click();
      await checkAnswersPage.waitForPage(page);
    }
  }

  // Submit to get results
  await checkAnswersPage.clickContinue(page);
  await resultsPage.waitForPage(page);
}

/**
 * Helper to update base answers array for a specific set of questions.
 * Returns a new array with updated indices.
 *
 * @param baseAnswers - Original answer indices array
 * @param updates - Map of question number to new index value
 */
export function updateBaseAnswers(
  baseAnswers: number[],
  updates: Record<number, number>,
): number[] {
  const newAnswers = [...baseAnswers];
  Object.entries(updates).forEach(([questionNum, index]) => {
    newAnswers[Number.parseInt(questionNum) - 1] = index;
  });
  return newAnswers;
}
