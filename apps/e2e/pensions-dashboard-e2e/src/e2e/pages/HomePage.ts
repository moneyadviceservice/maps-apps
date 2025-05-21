import { Page } from '@playwright/test';

type HomePage = {
  startButton: string;
  heading: string;
  clickStart(page: Page): Promise<void>;
  assertCookiesCleared(page: Page): Promise<boolean>;
  checkHomePageLoads(page: Page): Promise<void>;
};

const homePage: HomePage = {
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

  async clickStart(page: Page): Promise<void> {
    await page.locator(this.startButton).waitFor({ state: 'visible' });
    await page.locator(this.startButton).click();
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
