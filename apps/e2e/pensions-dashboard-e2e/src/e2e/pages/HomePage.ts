import { Page } from '@maps/playwright';
import { Locale } from '../types/common.types';

class HomePage {
  constructor(private readonly page: Page) {}

  readonly yourDataSection = 'Your data';
  readonly whatYouNeedSection = 'You’ll need';
  readonly howItWorksSection = 'How it works';
  readonly startButton = `button:text-is("Start now")`;
  readonly heading = `h1:text-is("MoneyHelper Pensions Dashboard")`;

  async checkHomePageLoads(locale: Locale = 'en'): Promise<void> {
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

    const heading = this.page.locator(`h1:text-is("${content.heading}")`);
    const introText = this.page.locator(`p:text-is("${content.introText}")`);
    const startBtn = this.page.locator(
      `button:text-is("${content.startButton}")`,
    );

    await heading.waitFor();
    await Promise.all([
      introText.waitFor({ state: 'visible' }),
      startBtn.waitFor({ state: 'visible' }),
    ]);
  }

  async assertSectionVisibility(sectionText: string): Promise<boolean> {
    await this.page
      .getByRole('heading', { name: sectionText })
      .scrollIntoViewIfNeeded();
    return await this.page
      .getByRole('heading', { name: sectionText })
      .isVisible();
  }

  async assertYourDataSection(): Promise<boolean> {
    return this.assertSectionVisibility(this.yourDataSection);
  }

  async assertHowItWorksSection(): Promise<boolean> {
    return this.assertSectionVisibility(this.howItWorksSection);
  }

  async assertWhatYouNeedSection(): Promise<boolean> {
    return this.assertSectionVisibility(this.whatYouNeedSection);
  }

  async assertUxUpdatedSectionOnStartPage(): Promise<void> {
    await this.assertSectionVisibility(this.yourDataSection);
    await this.assertSectionVisibility(this.whatYouNeedSection);
    await this.assertSectionVisibility(this.howItWorksSection);
  }

  async clickStart(locale: Locale = 'en'): Promise<void> {
    const startButtonText = {
      en: 'Start now',
      cy: 'Dechrau',
    };

    const startBtn = this.page.getByText(startButtonText[locale]);

    await startBtn.waitFor();
    await startBtn.click();
  }

  async assertCookiesCleared(): Promise<boolean> {
    const cookies = await this.page.context().cookies();
    const cookieNames = [
      'userSessionId',
      'redirectUrl',
      'postStarted',
      'codeVerifier',
      'startTime',
    ];

    return cookieNames.every((name) => !cookies.find((c) => c.name === name));
  }
}

export default HomePage;
