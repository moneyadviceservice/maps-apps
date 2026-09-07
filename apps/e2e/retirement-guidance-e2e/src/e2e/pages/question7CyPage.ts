import { Locator, Page } from '@playwright/test';

export const QUESTION_7_CY_COPY = {
  heading: "Ydych chi'n bwriadu ymddeol y tu allan i'r DU?",
  englishHeading: 'Do you plan to retire outside the UK?',
  description:
    "Efallai y byddwch chi'n cael eich effeithio gan reolau treth a Phensiwn y Wladwriaeth gwahanol os ydych chi'n bwriadu ymddeol dramor.",
  englishDescription:
    'You might be affected by different tax and State Pension rules if you plan to retire abroad.',
  options: ['Ydw', 'Na', 'Ddim yn siŵr'],
  englishOptions: ['Yes', 'No', 'Not sure'],
  continueButton: 'Parhau',
  englishContinueButton: 'Continue',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError: "Dewiswch 'Ydw', 'Na', neu 'Ddim yn siŵr' i barhau.",
  englishQuestionSpecificError:
    "Select 'Yes', 'No', or 'Not sure' to continue.",
} as const;

const QUESTION_7_CY_PATH = '/cy/question-7?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0';
const QUESTION_7_EN_PATH = '/en/question-7?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0&q-6=0';
const QUESTION_7_CY_URL = /\/cy\/question-7/;
const QUESTION_7_EN_URL = /\/en\/question-7/;
const QUESTION_NUMBER = 7;
const FIRST_RADIO_INDEX = 0;

type Question7CyPageType = {
  questionUrlMatcher: RegExp;
  questionEnUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  visitEnglish(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
  getRadioGroup(page: Page): Locator;
  getRadioOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  selectOptionByLabel(page: Page, label: string): Promise<void>;
  getContinueButton(page: Page): Locator;
  getEnglishContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFirstRadioInput(page: Page): Locator;
};

const question7CyPage: Question7CyPageType = {
  questionUrlMatcher: QUESTION_7_CY_URL,
  questionEnUrlMatcher: QUESTION_7_EN_URL,

  async visit(page) {
    await page.goto(QUESTION_7_CY_PATH);
  },

  async visitEnglish(page) {
    await page.goto(QUESTION_7_EN_PATH);
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_7_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_7_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_7_CY_COPY.description, { exact: true });
  },

  getRadioGroup(page) {
    return page.getByRole('group', { name: QUESTION_7_CY_COPY.heading });
  },

  getRadioOptions(page) {
    return page.getByRole('radio');
  },

  getOptionByLabel(page, label) {
    return page.getByLabel(label, { exact: true });
  },

  async selectOptionByLabel(page, label) {
    await page.locator('label', { hasText: label }).first().click();
  },

  getContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_7_CY_COPY.continueButton,
      exact: true,
    });
  },

  getEnglishContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_7_CY_COPY.englishContinueButton,
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

  getFirstRadioInput(page) {
    return page.getByTestId(`radio-input-${FIRST_RADIO_INDEX}`);
  },
};

export default question7CyPage;
