import { Locator, Page } from '@playwright/test';

const pageHeading =
  /Are you considering bringing multiple pensions together\?/i;

export const QUESTION_6_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
  NOT_SURE: 'Not sure',
} as const;

export const question6Answers = Object.values(QUESTION_6_ANSWERS);

export const question6AnswersCount = Object.values(QUESTION_6_ANSWERS).length;

export type Question6Answer =
  (typeof QUESTION_6_ANSWERS)[keyof typeof QUESTION_6_ANSWERS];

export const getQuestion6AnswerValue = (answer: Question6Answer): number => {
  return Object.values(QUESTION_6_ANSWERS).indexOf(answer);
};

interface Question6Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question6Page: Question6Page = {
  async waitForPage(page: Page) {
    await question6Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question6Page;
