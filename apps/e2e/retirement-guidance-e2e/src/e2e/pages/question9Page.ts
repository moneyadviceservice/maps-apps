import { Locator, Page } from '@playwright/test';

const pageHeading = 'What housing costs do you expect to have in retirement?';
const pageDescription =
  'This is the cost to live in your home after you retire, based on your current plans.';

export const QUESTION_9_ANSWERS = {
  RENT_PRIVATE_LANDLORD: 'Rent – private landlord',
  RENT_SOCIAL_HOUSING: 'Rent – social housing',
  MORTGAGE: 'Mortgage',
  NONE: 'None',
} as const;

export const question9Answers = Object.values(QUESTION_9_ANSWERS);

export const question9AnswersCount = Object.values(QUESTION_9_ANSWERS).length;

export type Question9Answer =
  (typeof QUESTION_9_ANSWERS)[keyof typeof QUESTION_9_ANSWERS];

export const getQuestion9AnswerValue = (answer: Question9Answer): number => {
  return Object.values(QUESTION_9_ANSWERS).indexOf(answer);
};

interface Question9Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
  getPageDescription(page: Page): Locator;
}

const question9Page: Question9Page = {
  async waitForPage(page: Page) {
    await question9Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },

  getPageDescription(page: Page) {
    return page.getByText(pageDescription, { exact: true });
  },
};

export default question9Page;
