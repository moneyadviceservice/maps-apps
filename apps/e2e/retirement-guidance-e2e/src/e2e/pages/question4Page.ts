import { Locator, Page } from '@playwright/test';

const pageHeading = /Do you currently pay into any pension scheme\?/i;

export const QUESTION_4_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
  NOT_SURE: 'Not sure',
} as const;

export const question4Answers = Object.values(QUESTION_4_ANSWERS);

export const question4AnswersCount = Object.values(QUESTION_4_ANSWERS).length;

export type Question4Answer =
  (typeof QUESTION_4_ANSWERS)[keyof typeof QUESTION_4_ANSWERS];

export const getQuestion4AnswerValue = (answer: Question4Answer): number => {
  return Object.values(QUESTION_4_ANSWERS).indexOf(answer);
};

interface Question4Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question4Page: Question4Page = {
  async waitForPage(page: Page) {
    await question4Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question4Page;
