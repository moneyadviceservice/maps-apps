import { Locator, Page } from '@playwright/test';

const pageHeading = /What is the main thing you’d like help with\?/i;

export const QUESTION_1_ANSWERS = {
  HOW_MY_PENSION_WORKS: 'How my pension works',
  HOW_MUCH_MONEY_I_NEED_FOR_RETIREMENT: 'How much money I need for retirement',
  HOW_TO_GROW_MY_PENSION: 'How to grow my pension',
  HOW_TO_TRANSFER_OR_COMBINE_MY_PENSION:
    'How to transfer or combine my pension',
  WHEN_AND_HOW_I_CAN_TAKE_MY_PENSION: 'When and how I can take my pension',
  LET_US_GUIDE_YOU: 'Let us guide you',
} as const;

export const question1Answers = Object.values(QUESTION_1_ANSWERS);

export const question1AnswersCount = Object.values(QUESTION_1_ANSWERS).length;

export type Question1Answer =
  (typeof QUESTION_1_ANSWERS)[keyof typeof QUESTION_1_ANSWERS];

export const getQuestion1AnswerValue = (answer: Question1Answer): number => {
  return Object.values(QUESTION_1_ANSWERS).indexOf(answer);
};

interface Question1Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
}

const question1Page: Question1Page = {
  async waitForPage(page: Page) {
    await question1Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },
};

export default question1Page;
