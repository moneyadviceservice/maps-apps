import { Locator, Page } from '@playwright/test';

const pageHeading = /Do you plan to retire outside the UK\?/i;

export const QUESTION_7_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
  NOT_SURE: 'Not sure',
} as const;

export const question7Answers = Object.values(QUESTION_7_ANSWERS);

export const question7AnswersCount = Object.values(QUESTION_7_ANSWERS).length;

export type Question7Answer =
  (typeof QUESTION_7_ANSWERS)[keyof typeof QUESTION_7_ANSWERS];

export const getQuestion7AnswerValue = (answer: Question7Answer): number => {
  return Object.values(QUESTION_7_ANSWERS).indexOf(answer);
};

interface Question7Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question7Page: Question7Page = {
  async waitForPage(page: Page) {
    await question7Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question7Page;
