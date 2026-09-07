import { Locator, Page } from '@playwright/test';

import { basePage } from './basePage';

const pageHeading =
  'Are you going through a divorce or ending a civil partnership?';
const moreInfoTitle = /Why are we asking this\?/i;

export const QUESTION_8_ANSWERS = {
  YES: 'Yes',
  NO: 'No',
} as const;

export const question8Answers = Object.values(QUESTION_8_ANSWERS);

export const question8AnswersCount = Object.values(QUESTION_8_ANSWERS).length;

export type Question8Answer =
  (typeof QUESTION_8_ANSWERS)[keyof typeof QUESTION_8_ANSWERS];

export const getQuestion8AnswerValue = (answer: Question8Answer): number => {
  return Object.values(QUESTION_8_ANSWERS).indexOf(answer);
};

interface Question8Page {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
  getBackLink(page: Page): Locator;
  clickBackLink(page: Page): Promise<void>;
  getContinueButton(page: Page): Locator;
  clickContinue(page: Page): Promise<void>;
  getQuestionOptions(page: Page): Locator;
  getOptionByLabel(page: Page, optionText: string): Locator;
  clickRadioOption(page: Page, optionText: string): Promise<void>;
  isOptionSelected(page: Page, optionText: string): Promise<boolean>;
  getMoreInfoToggle(page: Page): Locator;
  expandMoreInfo(page: Page): Promise<void>;
  getMoreInfoText(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryBody(page: Page): Locator;
}

const question8Page: Question8Page = {
  async waitForPage(page: Page) {
    await question8Page.getPageHeading(page).waitFor();
  },

  getPageHeading(page: Page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },

  getBackLink(page: Page) {
    return basePage.getBackLink(page);
  },

  async clickBackLink(page: Page) {
    await basePage.clickBackLink(page);
  },

  getContinueButton(page: Page) {
    return basePage.getContinueButton(page);
  },

  async clickContinue(page: Page) {
    await basePage.clickContinue(page);
  },

  getQuestionOptions(page: Page) {
    return basePage.getQuestionOptions(page, 'radio');
  },

  getOptionByLabel(page: Page, optionText: string) {
    return basePage.getOptionByLabel(page, optionText);
  },

  async clickRadioOption(page: Page, optionText: string) {
    await basePage.clickRadioOption(page, optionText);
  },

  async isOptionSelected(page: Page, optionText: string) {
    return basePage.isOptionSelected(page, optionText);
  },

  getMoreInfoToggle(page: Page) {
    return page.getByText(moreInfoTitle, { exact: true });
  },

  async expandMoreInfo(page: Page) {
    await this.getMoreInfoToggle(page).click();
  },

  getMoreInfoText(page: Page) {
    return page.getByText(
      'You have different options to split your pension if you’re separating from your partner.',
      {
        exact: true,
      },
    );
  },

  getErrorSummaryHeading(page: Page) {
    return basePage.getErrorSummaryHeading(page);
  },

  getErrorSummaryBody(page: Page) {
    return basePage.getErrorSummaryBody(page);
  },
};

export default question8Page;
