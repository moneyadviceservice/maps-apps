import { Locator, Page } from '@playwright/test';

const pageHeading = /Have you had debt advice\?/i;

export const QUESTION_11_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
} as const;

export const question11Answers = Object.values(QUESTION_11_ANSWERS);

export const question11AnswersCount = Object.values(QUESTION_11_ANSWERS).length;

export type Question11Answer =
  (typeof QUESTION_11_ANSWERS)[keyof typeof QUESTION_11_ANSWERS];

export const getQuestion11AnswerValue = (answer: Question11Answer): number => {
  return Object.values(QUESTION_11_ANSWERS).indexOf(answer);
};

interface Question11Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question11Page: Question11Page = {
  async waitForPage(page: Page) {
    await question11Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question11Page;
