import { Locator, Page } from '@playwright/test';

export const QUESTION_6_CY_COPY = {
  heading: "Ydych chi'n ystyried dod â nifer o bensiynau at ei gilydd?",
  englishHeading: 'Are you considering bringing multiple pensions together?',
  description:
    'Os oes gennych chi fwy nag un cynllun pensiwn, un opsiwn yw eu trosglwyddo i un darparwr. Gelwir hyn yn gyfuno ac mae ganddo fanteision ac anfanteision.',
  options: ['Ydw', 'Na', 'Ddim yn siŵr'],
  backButton: 'Yn ôl',
  continueButton: 'Parhau',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError: "Dewiswch 'Ydw', 'Na', neu 'Ddim yn siŵr' i barhau.",
} as const;

export const QUESTION_6_EN_COPY = {
  continueButton: 'Continue',
  errorSummaryHeading: 'There is a problem',
} as const;

const QUESTION_6_CY_PATH = '/cy/question-6?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0';
const QUESTION_6_CY_URL = /\/cy\/question-6/;
const QUESTION_NUMBER = 6;
const FIRST_RADIO_INDEX = 0;

type Question6CyPageType = {
  questionUrlMatcher: RegExp;
  questionEnUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  visitEnglish(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
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

const question6CyPage: Question6CyPageType = {
  questionUrlMatcher: QUESTION_6_CY_URL,
  questionEnUrlMatcher: /\/en\/question-6/,

  async visit(page) {
    await page.goto(QUESTION_6_CY_PATH);
  },

  async visitEnglish(page) {
    await page.goto('/en/question-6?q-1=0&q-2=0&q-3=0&q-4=0&q-5=0');
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_6_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_6_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_6_CY_COPY.description, { exact: true });
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
      name: QUESTION_6_CY_COPY.continueButton,
      exact: true,
    });
  },

  getEnglishContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_6_EN_COPY.continueButton,
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

export default question6CyPage;
