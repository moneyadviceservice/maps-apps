import { Locator, Page } from '@playwright/test';

export const QUESTION_3_CY_COPY = {
  heading: 'Oes gennych chi gyflogwr?',
  englishHeading: 'Do you have an employer?',
  description:
    "Mae hyn yn cynnwys unrhyw swydd â thâl sydd gennych chi ar hyn o bryd. Gall fod yn llawn amser neu'n rhan amser.",
  options: [
    'Oes',
    "Na, rwy'n hunangyflogedig",
    'Na, dydw i ddim yn gyflogedig',
  ],
  selfEmployedHint:
    'Mae hyn yn cynnwys unig fasnachwr a chyfarwyddwyr cwmnïau cyfyngedig',
  continueButton: 'Parhau',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError:
    'Dewiswch ‘Oes’, ‘Na, rwy’n hunangyflogedig’, neu ‘Na, dydw i ddim yn gyflogedig’ i barhau',
} as const;

const QUESTION_3_CY_PATH = '/cy/question-3?q-1=0&q-2=0';
const QUESTION_3_CY_URL = /\/cy\/question-3/;
const QUESTION_NUMBER = 3;
const FIRST_RADIO_INDEX = 0;

type Question3CyPage = {
  questionUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
  getRadioOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  getSelfEmployedHint(page: Page): Locator;
  getContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFieldErrorMessage(page: Page): Locator;
  getFirstRadioInput(page: Page): Locator;
};

const question3CyPage: Question3CyPage = {
  questionUrlMatcher: QUESTION_3_CY_URL,

  async visit(page) {
    await page.goto(QUESTION_3_CY_PATH);
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_3_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_3_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_3_CY_COPY.description, { exact: true });
  },

  getRadioOptions(page) {
    return page.getByRole('radio');
  },

  getOptionByLabel(page, label) {
    return page.getByLabel(label, { exact: true });
  },

  getSelfEmployedHint(page) {
    return page.getByText(QUESTION_3_CY_COPY.selfEmployedHint, { exact: true });
  },

  getContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_3_CY_COPY.continueButton,
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

export default question3CyPage;
