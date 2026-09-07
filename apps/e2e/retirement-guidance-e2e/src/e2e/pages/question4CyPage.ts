import { Locator, Page } from '@playwright/test';

export const QUESTION_4_CY_COPY = {
  heading: "Ydych chi'n talu i mewn i unrhyw gynllun pensiwn ar hyn o bryd?",
  englishHeading: 'Do you currently pay into any pension scheme?',
  description:
    "Mae hyn yn cynnwys unrhyw bensiwn rydych chi'n talu iddo, fel pensiwn personol neu bensiwn gweithle. Gallai fod yn gyfraniad misol rheolaidd neu pryd bynnag y gallwch chi.",
  options: ['Ydw', 'Na', 'Ddim yn siŵr'],
  continueButton: 'Parhau',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError: 'Dewiswch ‘Ydw’, ‘Na’ neu ‘Ddim yn siŵr’ i barhau',
} as const;

const QUESTION_4_CY_PATH = '/cy/question-4?q-1=0&q-2=0&q-3=0';
const QUESTION_4_CY_URL = /\/cy\/question-4/;
const QUESTION_NUMBER = 4;
const FIRST_RADIO_INDEX = 0;

type Question4CyPage = {
  questionUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
  getRadioOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  selectOptionByLabel(page: Page, label: string): Promise<void>;
  getContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFieldErrorMessage(page: Page): Locator;
  getFirstRadioInput(page: Page): Locator;
};

const question4CyPage: Question4CyPage = {
  questionUrlMatcher: QUESTION_4_CY_URL,

  async visit(page) {
    await page.goto(QUESTION_4_CY_PATH);
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_4_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_4_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_4_CY_COPY.description, { exact: true });
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
      name: QUESTION_4_CY_COPY.continueButton,
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
};

export default question4CyPage;
