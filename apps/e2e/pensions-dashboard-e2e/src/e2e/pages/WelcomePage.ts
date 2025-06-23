import { Page } from '@playwright/test';

type WelcomePage = {
  pageHeading: string;
  iUnderstandButton: string;
  welcomePageLoads(page: Page): Promise<void>;
  clickWelcomeButton(page: Page): Promise<void>;
};

const welcomePage: WelcomePage = {
  pageHeading: `h1:text-is("Welcome to the MoneyHelper Pensions Dashboard")`,
  iUnderstandButton: 'welcome-button',

  async welcomePageLoads(page): Promise<void> {
    await page.locator(this.pageHeading).waitFor();
  },

  async clickWelcomeButton(page): Promise<void> {
    await page.getByTestId(this.iUnderstandButton).click();
  },
};

export default welcomePage;
