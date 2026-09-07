import { Locator, Page } from '@playwright/test';

export const QUESTION_2_COPY = {
  cy: {
    heading: "Ydych chi'n bwriadu ymddeol yn y 10 mlynedd nesaf?",
    englishHeading: 'Do you plan to retire in the next 10 years?',
    options: ['Ydw', 'Na', 'Rydw i eisoes wedi ymddeol'],
    continueButton: 'Parhau',
    errorSummaryHeading: 'Mae problem',
    questionSpecificError:
      'Dewiswch ‘Ydw’, ‘Na’, neu ‘Rwyf eisoes wedi ymddeol’ i barhau',
  },
  en: {
    heading: 'Do you plan to retire in the next 10 years?',
    options: ['Yes', 'No', 'I’ve already retired'],
    thirdOption: 'I’ve already retired',
  },
} as const;

const QUESTION_2_ROUTES = {
  cy: '/cy/question-2?q-1=0',
  en: '/en/question-2?q-1=0',
} as const;

const QUESTION_2_CY_URL = /\/cy\/question-2/;
const QUESTION_2_EN_URL = /\/en\/question-2/;
const QUESTION_NUMBER = 2;
const FIRST_RADIO_INDEX = 0;
const THIRD_OPTION_INDEX = 2;

type Question2CyPage = {
  questionCyUrlMatcher: RegExp;
  questionEnUrlMatcher: RegExp;
  visitWelsh(page: Page): Promise<void>;
  visitEnglish(page: Page): Promise<void>;
  getHeading(page: Page, headingText: string): Locator;
  getRadioOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  getContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFieldErrorMessage(page: Page): Locator;
  getFirstRadioInput(page: Page): Locator;
  getThirdRadioOption(page: Page): Locator;
};

const question2CyPage: Question2CyPage = {
  questionCyUrlMatcher: QUESTION_2_CY_URL,
  questionEnUrlMatcher: QUESTION_2_EN_URL,

  async visitWelsh(page) {
    await page.goto(QUESTION_2_ROUTES.cy);
  },

  async visitEnglish(page) {
    await page.goto(QUESTION_2_ROUTES.en);
  },

  getHeading(page, headingText) {
    return page.getByRole('heading', {
      level: 1,
      name: headingText,
    });
  },

  getRadioOptions(page) {
    return page.getByRole('radio');
  },

  getOptionByLabel(page, label) {
    return page.getByLabel(label, { exact: true });
  },

  getContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_2_COPY.cy.continueButton,
      exact: true,
    });
  },

  getErrorSummaryHeading(page) {
    return page.getByTestId('error-summary-heading');
  },

  getErrorSummaryLink(page) {
    return page.getByTestId('error-link-0');
  },

  getFieldErrorWrapper(page) {
    return page.getByTestId(`error-${QUESTION_NUMBER}`);
  },

  getFieldErrorMessage(page) {
    return page.getByTestId(`errorMessage-${QUESTION_NUMBER}`);
  },

  getFirstRadioInput(page) {
    return page.getByTestId(`radio-input-${FIRST_RADIO_INDEX}`);
  },

  getThirdRadioOption(page) {
    return this.getRadioOptions(page).nth(THIRD_OPTION_INDEX);
  },
};

export default question2CyPage;
