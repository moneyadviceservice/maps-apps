import { Page } from '@maps/playwright';

type HomePage = {
  startButton: string;
  heading: string;
  youCanSection: 'You can';
  yourDataSection: 'Your data';
  howItWorksSection: 'How it works';
  whatYouNeedSection: 'You’ll need';
  clickStart(page: Page): Promise<void>;
  assertCookiesCleared(page: Page): Promise<boolean>;
  checkHomePageLoads(page: Page): Promise<void>;
  assertYouCanSection(page: Page): Promise<boolean>;
  assertYourDataSection(page: Page): Promise<boolean>;
  assertHowItWorksSection(page: Page): Promise<boolean>;
  assertWhatYouNeedSection(page: Page): Promise<boolean>;
  assertSectionVisibility(page: Page, sectionText: string): Promise<boolean>;
  assertUxUpdatedSectionOnStartPage(page: Page): Promise<void>;
};

const homePage: HomePage = {
  youCanSection: 'You can',
  yourDataSection: 'Your data',
  whatYouNeedSection: 'You’ll need',
  howItWorksSection: 'How it works',

  startButton: `button:text-is("Start")`,
  heading: `h1:text-is("MoneyHelper Pensions Dashboard")`,

  async checkHomePageLoads(page: Page): Promise<void> {
    await page.locator(this.heading).waitFor();
    const introText = page.locator(
      `p:text-is("See your pensions in one place with our free and secure government-backed service.")`,
    );
    const startBtn = page.locator(this.startButton);

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

  async assertYouCanSection(page: Page): Promise<boolean> {
    return this.assertSectionVisibility(page, this.youCanSection);
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
    await this.assertSectionVisibility(page, this.youCanSection);
    await this.assertSectionVisibility(page, this.yourDataSection);
    await this.assertSectionVisibility(page, this.whatYouNeedSection);
    await this.assertSectionVisibility(page, this.howItWorksSection);
  },

  async clickStart(page: Page): Promise<void> {
    await page.getByText('Start').waitFor();
    await page.getByText('Start').click();
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
