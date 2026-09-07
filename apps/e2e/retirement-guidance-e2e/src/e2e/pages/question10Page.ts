import { Locator, Page } from '@playwright/test';

const pageHeading = /Are you struggling to pay your bills or debts\?/i;

export const QUESTION_10_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
} as const;

export const question10Answers = Object.values(QUESTION_10_ANSWERS);

export const question10AnswersCount = Object.values(QUESTION_10_ANSWERS).length;

export type Question10Answer =
  (typeof QUESTION_10_ANSWERS)[keyof typeof QUESTION_10_ANSWERS];

export const getQuestion10AnswerValue = (answer: Question10Answer): number => {
  return Object.values(QUESTION_10_ANSWERS).indexOf(answer);
};

interface Question10Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question10Page: Question10Page = {
  async waitForPage(page: Page) {
    await question10Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question10Page;
