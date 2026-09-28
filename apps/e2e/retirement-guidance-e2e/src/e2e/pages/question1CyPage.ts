import { Locator, Page } from '@playwright/test';

export const QUESTION_1_CY_COPY = {
  heading: "Beth yw'r prif beth yr hoffech chi gael help ag ef?",
  englishHeading: 'What is the main thing you’d like help with?',
  description:
    "Mae hyn yn ein helpu i flaenoriaethu'r arweiniad rydym yn darparu i chi. Dewiswch un opsiwn.",
  options: [
    'Sut mae fy mhensiwn yn gweithio',
    'Faint o arian sydd ei angen arnaf ar gyfer ymddeoliad',
    'Sut i dyfu fy mhensiwn',
    'Sut i drosglwyddo neu gyfuno fy mhensiwn',
    'Pryd a sut y gallaf gymryd fy mhensiwn',
    'Gadewch i ni eich tywys',
  ],
  optionSeparator: 'Neu',
  continueButton: 'Parhau',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError: 'Dewiswch un opsiwn i barhau',
} as const;

const QUESTION_1_CY_PATH = '/cy/question-1';
const QUESTION_1_CY_URL = /\/cy\/question-1/;
const QUESTION_NUMBER = 1;
const FIRST_RADIO_INDEX = 0;

type Question1CyPage = {
  questionUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
  getRadioOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  selectOptionByLabel(page: Page, label: string): Promise<void>;
  getOptionSeparator(page: Page): Locator;
  getContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFieldErrorMessage(page: Page): Locator;
  getFirstRadioInput(page: Page): Locator;
};

const question1CyPage: Question1CyPage = {
  questionUrlMatcher: QUESTION_1_CY_URL,

  async visit(page) {
    await page.goto(QUESTION_1_CY_PATH);
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_1_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_1_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_1_CY_COPY.description, { exact: true });
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

  getOptionSeparator(page) {
    return page.getByText(QUESTION_1_CY_COPY.optionSeparator, { exact: true });
  },

  getContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_1_CY_COPY.continueButton,
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

export default question1CyPage;
