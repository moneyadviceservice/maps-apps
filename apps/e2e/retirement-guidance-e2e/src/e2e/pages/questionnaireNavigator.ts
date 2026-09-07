import { Page } from '@playwright/test';

import { basePage } from './basePage';
import checkAnswersPage from './checkAnswersPage';
import homePage from './HomePage';
import question1Page, {
  getQuestion1AnswerValue,
  QUESTION_1_ANSWERS,
  type Question1Answer,
} from './question1Page';
import question2Page, {
  getQuestion2AnswerValue,
  QUESTION_2_ANSWERS,
  type Question2Answer,
} from './question2Page';
import question3Page, {
  getQuestion3AnswerValue,
  QUESTION_3_ANSWERS,
  type Question3Answer,
} from './question3Page';
import question4Page, {
  getQuestion4AnswerValue,
  QUESTION_4_ANSWERS,
  type Question4Answer,
} from './question4Page';
import question5Page, {
  getQuestion5MultipleAnswerValues,
  QUESTION_5_ANSWERS,
  type Question5Answer,
} from './question5Page';
import question6Page, {
  getQuestion6AnswerValue,
  QUESTION_6_ANSWERS,
  type Question6Answer,
} from './question6Page';
import question7Page, {
  getQuestion7AnswerValue,
  QUESTION_7_ANSWERS,
  type Question7Answer,
} from './question7Page';
import question8Page, {
  getQuestion8AnswerValue,
  QUESTION_8_ANSWERS,
  type Question8Answer,
} from './question8Page';
import question9Page, {
  getQuestion9AnswerValue,
  QUESTION_9_ANSWERS,
  type Question9Answer,
} from './question9Page';
import question10Page, {
  getQuestion10AnswerValue,
  QUESTION_10_ANSWERS,
  type Question10Answer,
} from './question10Page';
import question11Page, {
  getQuestion11AnswerValue,
  QUESTION_11_ANSWERS,
  type Question11Answer,
} from './question11Page';
import resultsPage from './resultsPage';

interface QuestionnaireOptions {
  q1Answer?: Question1Answer;
  q2Answer?: Question2Answer;
  q3Answer?: Question3Answer;
  q4Answer?: Question4Answer;
  q5Answer?: Question5Answer[];
  q6Answer?: Question6Answer;
  q7Answer?: Question7Answer;
  q8Answer?: Question8Answer;
  q9Answer?: Question9Answer;
  q10Answer?: Question10Answer;
  q11Answer?: Question11Answer;
}

const defaultOptions: Required<QuestionnaireOptions> = {
  q1Answer: QUESTION_1_ANSWERS.HOW_MY_PENSION_WORKS,
  q2Answer: QUESTION_2_ANSWERS.YES,
  q3Answer: QUESTION_3_ANSWERS.NO_NOT_EMPLOYED,
  q4Answer: QUESTION_4_ANSWERS.YES,
  q5Answer: [QUESTION_5_ANSWERS.DEFINED_CONTRIBUTION],
  q6Answer: QUESTION_6_ANSWERS.YES,
  q7Answer: QUESTION_7_ANSWERS.YES,
  q8Answer: QUESTION_8_ANSWERS.YES,
  q9Answer: QUESTION_9_ANSWERS.MORTGAGE,
  q10Answer: QUESTION_10_ANSWERS.YES,
  q11Answer: QUESTION_11_ANSWERS.NO,
};

interface QuestionnaireNavigator {
  navigateToQuestion11(
    page: Page,
    options?: QuestionnaireOptions,
  ): Promise<void>;
  navigateToResults(page: Page, options?: QuestionnaireOptions): Promise<void>;
  buildAnswersQuery(
    options?: QuestionnaireOptions,
    questionNumber?: number,
  ): URLSearchParams;
  skipToQuestion(
    page: Page,
    questionNumber: number,
    options?: QuestionnaireOptions,
  ): Promise<void>;
  skipToResults(page: Page, options?: QuestionnaireOptions): Promise<void>;
}

const questionnaireNavigator: QuestionnaireNavigator = {
  async navigateToQuestion11(page, options) {
    const {
      q1Answer,
      q2Answer,
      q3Answer,
      q4Answer,
      q5Answer,
      q6Answer,
      q7Answer,
      q8Answer,
      q9Answer,
      q10Answer,
    } = {
      ...defaultOptions,
      ...options,
    };

    await homePage.startRetirementGuidance(page);
    await page.getByTestId('start-button').click();

    await question1Page.waitForPage(page);
    await basePage.clickRadioOption(page, q1Answer);
    await basePage.clickContinue(page);

    await question2Page.waitForPage(page);
    await basePage.clickRadioOption(page, q2Answer);
    await basePage.clickContinue(page);

    await question3Page.waitForPage(page);
    await basePage.clickRadioOption(page, q3Answer);
    await basePage.clickContinue(page);

    await question4Page.waitForPage(page);
    await basePage.clickRadioOption(page, q4Answer);
    await basePage.clickContinue(page);

    await question5Page.waitForPage(page);
    for (const pensionType of q5Answer) {
      await basePage.clickCheckboxOption(page, pensionType);
    }
    await basePage.clickContinue(page);

    await question6Page.waitForPage(page);
    await basePage.clickRadioOption(page, q6Answer);
    await basePage.clickContinue(page);

    await question7Page.waitForPage(page);
    await basePage.clickRadioOption(page, q7Answer);
    await basePage.clickContinue(page);

    await question8Page.waitForPage(page);
    await basePage.clickRadioOption(page, q8Answer);
    await basePage.clickContinue(page);

    await question9Page.waitForPage(page);
    await basePage.clickRadioOption(page, q9Answer);
    await basePage.clickContinue(page);

    await question10Page.waitForPage(page);
    await basePage.clickRadioOption(page, q10Answer);
    await basePage.clickContinue(page);

    await question11Page.waitForPage(page);
  },

  async navigateToResults(page, options) {
    const { q11Answer } = {
      ...defaultOptions,
      ...options,
    };

    await this.navigateToQuestion11(page, options);

    await basePage.clickRadioOption(page, q11Answer);
    await basePage.clickContinue(page);

    await checkAnswersPage.waitForPage(page);
    await checkAnswersPage.clickContinue(page);
    await resultsPage.waitForPage(page);
  },

  buildAnswersQuery(options, questionNumber): URLSearchParams {
    const {
      q1Answer,
      q2Answer,
      q3Answer,
      q4Answer,
      q5Answer,
      q6Answer,
      q7Answer,
      q8Answer,
      q9Answer,
      q10Answer,
      q11Answer,
    } = {
      ...defaultOptions,
      ...options,
    };

    const answersQuery = new URLSearchParams({
      'q-1': getQuestion1AnswerValue(q1Answer).toString(),
      'q-2': getQuestion2AnswerValue(q2Answer).toString(),
      'q-3': getQuestion3AnswerValue(q3Answer).toString(),
      'q-4': getQuestion4AnswerValue(q4Answer).toString(),
      'q-5': getQuestion5MultipleAnswerValues(q5Answer).join(','),
      'q-6': getQuestion6AnswerValue(q6Answer).toString(),
      'q-7': getQuestion7AnswerValue(q7Answer).toString(),
      'q-8': getQuestion8AnswerValue(q8Answer).toString(),
      'q-9': getQuestion9AnswerValue(q9Answer).toString(),
      'q-10': getQuestion10AnswerValue(q10Answer).toString(),
      'q-11': getQuestion11AnswerValue(q11Answer).toString(),
    });

    if (typeof questionNumber === 'number') {
      for (let index = questionNumber; index < 12; index++) {
        answersQuery.delete(`q-${index}`);
      }
    }

    return answersQuery;
  },

  async skipToQuestion(page, questionNumber, options) {
    const answersQueryString = questionnaireNavigator
      .buildAnswersQuery(options, questionNumber)
      .toString();

    await page.goto(`/en/question-${questionNumber}?${answersQueryString}`);
  },

  async skipToResults(page, options) {
    const answersQueryString = questionnaireNavigator
      .buildAnswersQuery(options)
      .toString();

    await page.goto(`/en/results?${answersQueryString}`);
    await resultsPage.waitForPage(page);
  },
};

export default questionnaireNavigator;
