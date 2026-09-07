import { Locator, Page } from '@playwright/test';

export const BETA_FEEDBACK_LINKS = {
  en: 'https://moneyhelper.qualtrics.com/jfe/form/SV_eaiacdMDPmZumkm',
  cy: 'https://moneyhelper.qualtrics.com/jfe/form/SV_eaiacdMDPmZumkm?Q_Language=CY',
} as const;

export const LANDING_COPY = {
  cy: {
    heading: 'Cael arweiniad ymddeoliad',
    englishHeading: 'Get retirement guidance',
    intro:
      "Crëwch gynllun gweithredu ymddeoliad gyda'n teclyn am ddim. Byddwn yn eich paru â chanllawiau i ddeall eich opsiynau ac yn egluro'r camau y gallwch eu cymryd i wneud y gorau o'ch pensiwn.",
    whatYouGetHeading: 'Beth gewch chi',
    whatYouGetDescription:
      'Bydd y teclyn hwn yn rhoi cynllun gweithredu ymddeoliad i chi gyda:',
    whatYouGetItems: [
      "gwybodaeth allweddol i'ch helpu i ddeall eich opsiynau",
      "camau awgrymedig i wneud y gorau o'ch pensiwn",
      'offer defnyddiol i amcangyfrif faint o incwm ymddeoliad y gallech fod ei angen arnoch ac a ydych chi ar y trywydd i gyrraedd eich nodau',
      "ble gallwch chi gael cymorth a chefnogaeth gyda'ch penderfyniadau.",
    ],
    additionalInfo:
      "Ni fyddwch chi'n gweld eich holl bensiynau na'ch union incwm pensiwn. Fel arfer gallwch ddod o hyd i'r wybodaeth hon trwy fewngofnodi i gyfrif ar-lein eich darparwr pensiwn neu drwy gysylltu â nhw.",
    howItWorksHeading: "Sut mae'n gweithio",
    howItWorksDescription:
      "Byddwn yn gofyn am fanylion amdanoch chi a'ch cynlluniau ar gyfer y dyfodol, gan gynnwys:",
    howItWorksItems: [
      'y mathau o bensiwn sydd gennych',
      'pa mor bell o ymddeoliad ydych chi',
      "os ydych chi'n bwriadu ymddeol y tu allan i'r DU.",
    ],
    startButton: 'Cael arweiniad ymddeoliad',
    completionTime: 'Amser cwblhau cyfartalog o 5 munud',
  },
  en: {
    whatYouGetThirdBullet:
      'useful tools to estimate how much retirement income you might need and if you’re on track to meet your goals',
  },
} as const;

const LANDING_ROUTES = {
  cy: '/cy/landing',
  en: '/en/landing',
} as const;

const THIRD_BULLET_INDEX = 2;

type LandingPage = {
  visitWelsh(page: Page): Promise<void>;
  visitEnglish(page: Page): Promise<void>;
  getPhaseBanner(page: Page): Locator;
  getPhaseBannerFeedbackLink(page: Page): Locator;
  getHeading(page: Page, headingText: string): Locator;
  getIntro(page: Page): Locator;
  getWhatYouGetDescription(page: Page): Locator;
  getWhatYouGetItems(page: Page): Locator;
  getWhatYouGetAdditionalInfo(page: Page): Locator;
  getHowItWorksDescription(page: Page): Locator;
  getHowItWorksItems(page: Page): Locator;
  getStartButton(page: Page): Locator;
  getCompletionTime(page: Page): Locator;
  getWhatYouGetThirdBullet(page: Page): Locator;
};

const landingPage: LandingPage = {
  async visitWelsh(page) {
    await page.goto(LANDING_ROUTES.cy);
  },

  async visitEnglish(page) {
    await page.goto(LANDING_ROUTES.en);
  },

  getPhaseBanner(page) {
    return page.getByTestId('phase-banner');
  },

  getPhaseBannerFeedbackLink(page) {
    return this.getPhaseBanner(page).getByRole('link', {
      name: /feedback|adborth/i,
    });
  },

  getHeading(page, headingText) {
    return page.getByRole('heading', {
      name: headingText,
      exact: true,
    });
  },

  getIntro(page) {
    return page.getByTestId('landing-page-paragraph');
  },

  getWhatYouGetDescription(page) {
    return page.getByTestId('what-you-get-description');
  },

  getWhatYouGetItems(page) {
    return page.getByTestId('what-you-get-list').getByRole('listitem');
  },

  getWhatYouGetAdditionalInfo(page) {
    return page.getByTestId('what-you-get-additional-info');
  },

  getHowItWorksDescription(page) {
    return page.getByTestId('how-it-works-description');
  },

  getHowItWorksItems(page) {
    return page.getByTestId('how-it-works-list').getByRole('listitem');
  },

  getStartButton(page) {
    return page.getByTestId('start-button');
  },

  getCompletionTime(page) {
    return page.getByTestId('completion-time');
  },

  getWhatYouGetThirdBullet(page) {
    return this.getWhatYouGetItems(page).nth(THIRD_BULLET_INDEX);
  },
};

export default landingPage;
