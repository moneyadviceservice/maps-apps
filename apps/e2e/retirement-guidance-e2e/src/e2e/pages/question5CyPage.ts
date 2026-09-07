import { Locator, Page } from '@playwright/test';

export const QUESTION_5_CY_COPY = {
  heading: 'Pa fathau o bensiwn sydd gennych chi?',
  englishHeading: 'Which types of pension do you have?',
  description:
    "Mae sut mae eich pensiwn yn gweithio, a'ch opsiynau, yn dibynnu ar y mathau sydd gennych chi.",
  options: [
    'Cyfraniadau wedi’u diffinio',
    'Buddion wedi’u diffinio',
    'Pensiwn y Wladwriaeth',
    'Arall',
    'Ddim yn siŵr',
  ],
  optionHints: [
    "Cronfa o arian rydych chi (ac weithiau'ch cyflogwr) yn talu iddo. Y cynlluniau pensiwn mwyaf diweddar yw'r math hwn.",
    "Yn aml yn cael ei alw'n gynllun cyflog terfynol neu gyfartaledd gyrfa. Pensiwn gweithle lle mae'r incwm yn seiliedig ar eich cyflog a'r blynyddoedd rydych chi wedi bod yn aelod o'r cynllun.",
    "Dyma arian y gallwch chi ei hawlio gan y llywodraeth pan fyddwch chi'n cyrraedd eich oedran Pensiwn y Wladwriaeth. Mae'r swm y byddwch chi'n ei gael yn dibynnu ar eich cofnod Yswiriant Gwladol.",
    'Er enghraifft, cynlluniau cyfraniadau wedi’u diffinio cyfunol, hybrid a balans arian parod.',
    "Os nad ydych chi'n siŵr, byddwn ni'n dangos canllawiau i chi ar gyfer pob math ac yn egluro sut i ddarganfod pa fath sydd gennych.",
  ],
  continueButton: 'Parhau',
  errorSummaryHeading: 'Mae problem',
  questionSpecificError: 'Dewiswch o leiaf un opsiwn i barhau',
} as const;

const QUESTION_5_CY_PATH = '/cy/question-5?q-1=0&q-2=0&q-3=0&q-4=0';
const QUESTION_5_CY_URL = /\/cy\/question-5/;
const QUESTION_NUMBER = 5;
const FIRST_CHECKBOX_INDEX = 0;

type Question5CyPage = {
  questionUrlMatcher: RegExp;
  visit(page: Page): Promise<void>;
  getHeading(page: Page): Locator;
  getEnglishHeading(page: Page): Locator;
  getDescription(page: Page): Locator;
  getCheckboxOptions(page: Page): Locator;
  getOptionByLabel(page: Page, label: string): Locator;
  getOptionHint(page: Page, hint: string): Locator;
  getContinueButton(page: Page): Locator;
  getErrorSummaryHeading(page: Page): Locator;
  getErrorSummaryLink(page: Page): Locator;
  getFieldErrorWrapper(page: Page): Locator;
  getFirstCheckboxInput(page: Page): Locator;
};

const question5CyPage: Question5CyPage = {
  questionUrlMatcher: QUESTION_5_CY_URL,

  async visit(page) {
    await page.goto(QUESTION_5_CY_PATH);
  },

  getHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_5_CY_COPY.heading,
    });
  },

  getEnglishHeading(page) {
    return page.getByRole('heading', {
      level: 1,
      name: QUESTION_5_CY_COPY.englishHeading,
    });
  },

  getDescription(page) {
    return page.getByText(QUESTION_5_CY_COPY.description, { exact: true });
  },

  getCheckboxOptions(page) {
    return page.getByRole('checkbox');
  },

  getOptionByLabel(page, label) {
    return page.getByLabel(label, { exact: true });
  },

  getOptionHint(page, hint) {
    return page.getByText(hint, { exact: true });
  },

  getContinueButton(page) {
    return page.getByRole('button', {
      name: QUESTION_5_CY_COPY.continueButton,
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

  getFirstCheckboxInput(page) {
    return page.getByTestId(`checkbox-input-${FIRST_CHECKBOX_INDEX}`);
  },
};

export default question5CyPage;
