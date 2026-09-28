import { Locator, Page } from '@playwright/test';

const pageHeading = /Which types of pension do you have\?/i;

export const QUESTION_5_ANSWERS = {
  DEFINED_CONTRIBUTION: 'Defined contribution',
  DEFINED_BENEFIT: 'Defined benefit',
  STATE_PENSION: 'State Pension',
  OTHER: 'Other',
  NOT_SURE: 'Not sure',
} as const;

export const question5Answers = Object.values(QUESTION_5_ANSWERS);

export const question5AnswersCount = Object.values(QUESTION_5_ANSWERS).length;

export type Question5Answer =
  (typeof QUESTION_5_ANSWERS)[keyof typeof QUESTION_5_ANSWERS];

export const getQuestion5SingleAnswerValue = (
  answer: Question5Answer,
): number => {
  return Object.values(QUESTION_5_ANSWERS).indexOf(answer);
};

export const getQuestion5MultipleAnswerValues = (
  options: Question5Answer[],
): number[] => {
  return options.map((option) => getQuestion5SingleAnswerValue(option));
};

interface Question5Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
  getFieldErrorMessage(page: Page): Locator;
  visitQuestion5(page: Page): Promise<void>;
  getCheckboxLabel(page: Page, label: string): Locator;
}

const question5Page: Question5Page = {
  async waitForPage(page: Page) {
    await question5Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },

  getFieldErrorMessage(page: Page) {
    return page.getByTestId('errorMessage-5');
  },

  async visitQuestion5(page: Page) {
    await page.goto('/en/question-5?q-1=0&q-2=0&q-3=0&q-4=0');
  },

  getCheckboxLabel(page: Page, label: string) {
    // Find the visible label element with cursor-pointer class that contains the option text
    return page.locator('label[data-testid="checkbox"]').filter({
      hasText: label,
    });
  },
};

export default question5Page;
