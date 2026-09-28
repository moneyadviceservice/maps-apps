import { Locator, Page } from '@playwright/test';

import { basePage } from './basePage';

const pageHeading = 'Check your answers';
const pageDescription =
  "This is what you've told us. You can change your answers if you need to.";

interface CheckAnswersPage {
  waitForPage(page: Page): Promise<void>;
  getPageHeading(page: Page): Locator;
  getPageDescription(page: Page): Locator;
  getQuestionTitle(page: Page, questionNumber: number): Locator;
  getQuestionAnswer(page: Page, questionNumber: number): Locator;
  getChangeButton(page: Page, questionNumber: number): Locator;
  clickChangeButton(page: Page, questionNumber: number): Promise<void>;
  getAllQuestionTitles(page: Page): Locator;
  getAllQuestionAnswers(page: Page): Locator;
  getAllChangeButtons(page: Page): Locator;
  getContinueButton(page: Page): Locator;
  clickContinue(page: Page): Promise<void>;
}

const checkAnswersPage: CheckAnswersPage = {
  async waitForPage(page: Page) {
    await basePage.waitForPageHeading(page, pageHeading);
  },

  getPageHeading(page: Page) {
    return basePage.pageHeading(page, pageHeading);
  },

  getPageDescription(page: Page) {
    return page.getByText(pageDescription, { exact: true });
  },

  getQuestionTitle(page: Page, questionNumber: number) {
    return page.getByTestId(`q-${questionNumber}`);
  },

  getQuestionAnswer(page: Page, questionNumber: number) {
    return page.getByTestId(`answer-${questionNumber}`);
  },

  getChangeButton(page: Page, questionNumber: number) {
    return page.getByTestId(`change-question-${questionNumber}`);
  },

  async clickChangeButton(page: Page, questionNumber: number) {
    await this.getChangeButton(page, questionNumber).click();
  },

  getAllQuestionTitles(page: Page) {
    return page.locator('[data-testid^="q-"]');
  },

  getAllQuestionAnswers(page: Page) {
    return page.locator('[data-testid^="answer-"]');
  },

  getAllChangeButtons(page: Page) {
    return page.locator('[data-testid^="change-question-"]');
  },

  getContinueButton(page: Page) {
    return page.getByTestId('next-page-button');
  },

  async clickContinue(page: Page) {
    await this.getContinueButton(page).click();
  },
};

export default checkAnswersPage;
