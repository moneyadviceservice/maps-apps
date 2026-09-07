import { Locator, Page } from '@playwright/test';

const pageHeading = /Do you have an employer\?/i;

export const QUESTION_3_ANSWERS = {
  YES: 'Yes',
  NO_SELF_EMPLOYED: 'No, I’m self-employed',
  NO_NOT_EMPLOYED: 'No, I’m not employed',
} as const;

export const question3Answers = Object.values(QUESTION_3_ANSWERS);

export const question3AnswersCount = Object.values(QUESTION_3_ANSWERS).length;

export type Question3Answer =
  (typeof QUESTION_3_ANSWERS)[keyof typeof QUESTION_3_ANSWERS];

export const getQuestion3AnswerValue = (answer: Question3Answer): number => {
  return Object.values(QUESTION_3_ANSWERS).indexOf(answer);
};

interface Question3Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question3Page: Question3Page = {
  async waitForPage(page: Page) {
    await question3Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question3Page;
