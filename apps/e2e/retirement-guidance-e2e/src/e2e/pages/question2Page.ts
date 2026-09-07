import { Locator, Page } from '@playwright/test';

const pageHeading = /Do you plan to retire in the next 10 years\?/i;

export const QUESTION_2_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
  ALREADY_RETIRED: 'I’ve already retired',
} as const;

export const question2Answers = Object.values(QUESTION_2_ANSWERS);

export const question2AnswersCount = Object.values(QUESTION_2_ANSWERS).length;

export type Question2Answer =
  (typeof QUESTION_2_ANSWERS)[keyof typeof QUESTION_2_ANSWERS];

export const getQuestion2AnswerValue = (answer: Question2Answer): number => {
  return Object.values(QUESTION_2_ANSWERS).indexOf(answer);
};

interface Question2Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question2Page: Question2Page = {
  async waitForPage(page: Page) {
    await question2Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question2Page;
