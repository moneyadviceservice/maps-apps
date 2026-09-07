import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';

type HomePage = {
  startButton: string;
  heading: string;
  yourDataSection: 'Your data';
  howItWorksSection: 'How it works';
  whatYouNeedSection: 'You’ll need';
  clickStart(page: Page, locale?: Locale): Promise<void>;
  assertCookiesCleared(page: Page): Promise<boolean>;
  checkHomePageLoads(page: Page, locale?: Locale): Promise<void>;
  assertYourDataSection(page: Page): Promise<boolean>;
  assertHowItWorksSection(page: Page): Promise<boolean>;
  assertWhatYouNeedSection(page: Page): Promise<boolean>;
  assertSectionVisibility(page: Page, sectionText: string): Promise<boolean>;
  assertUxUpdatedSectionOnStartPage(page: Page): Promise<void>;
};

const homePage: HomePage = {
  yourDataSection: 'Your data',
  whatYouNeedSection: 'You’ll need',
  howItWorksSection: 'How it works',
  startButton: `button:text-is("Start now")`,
  heading: `h1:text-is("MoneyHelper Pensions Dashboard")`,

  async checkHomePageLoads(page: Page, locale: Locale = 'en'): Promise<void> {
    const homePageContent = {
      en: {
        heading: 'MoneyHelper Pensions Dashboard',
        startButton: 'Start now',
        introText:
          'See your pensions in one place with our free, secure government-backed service. Plus, see how much you could get when you retire.',
      },
      cy: {
        heading: 'Dangosfwrdd Pensiynau HelpwrArian',
        startButton: 'Dechrau nawr',
        introText:
          'Gweler eich pensiynau mewn un lle gyda’n wasanaeth am ddim, diogel a gefnogir gan y llywodraeth. Hefyd, gweler faint gallwch chi ei gael pan fyddwch chi’n ymddeol.',
      },
    };

    const content = homePageContent[locale];

    const heading = page.locator(`h1:text-is("${content.heading}")`);
    const introText = page.locator(`p:text-is("${content.introText}")`);
    const startBtn = page.locator(`button:text-is("${content.startButton}")`);

    await heading.waitFor();
    await Promise.all([
      introText.waitFor({ state: 'visible' }),
      startBtn.waitFor({ state: 'visible' }),
    ]);
  },

  async assertSectionVisibility(
    page: Page,
    sectionText: string,
  ): Promise<boolean> {
    await page
      .getByRole('heading', { name: sectionText })
      .scrollIntoViewIfNeeded();
    return await page.getByRole('heading', { name: sectionText }).isVisible();
  },

  async assertYourDataSection(page: Page): Promise<boolean> {
    return this.assertSectionVisibility(page, this.yourDataSection);
  },
  async assertHowItWorksSection(page: Page): Promise<boolean> {
    return this.assertSectionVisibility(page, this.howItWorksSection);
  },
  async assertWhatYouNeedSection(page: Page): Promise<boolean> {
    return this.assertSectionVisibility(page, this.whatYouNeedSection);
  },

  async assertUxUpdatedSectionOnStartPage(page: Page): Promise<void> {
    await this.assertSectionVisibility(page, this.yourDataSection);
    await this.assertSectionVisibility(page, this.whatYouNeedSection);
    await this.assertSectionVisibility(page, this.howItWorksSection);
  },

  async clickStart(page: Page, locale: Locale = 'en'): Promise<void> {
    const startButtonText = {
      en: 'Start now',
      cy: 'Dechrau',
    };

    const startBtn = page.getByText(startButtonText[locale]);

    await startBtn.waitFor();
    await startBtn.click();
  },

  async assertCookiesCleared(page: Page): Promise<boolean> {
    const cookies = await page.context().cookies();
    const cookieNames = [
      'userSessionId',
      'redirectUrl',
      'postStarted',
      'codeVerifier',
      'startTime',
    ];

    return cookieNames.every((name) => !cookies.find((c) => c.name === name));
  },
};

export default homePage;
