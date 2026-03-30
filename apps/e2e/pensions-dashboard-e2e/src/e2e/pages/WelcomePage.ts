import { Page } from '@maps/playwright';

type WelcomePage = {
  pageHeading: string;
  iUnderstandButton: string;
  welcomePageTitleText: string;
  welcomePageLoads(page: Page): Promise<void>;
  clickWelcomeButton(page: Page): Promise<void>;
};

const welcomePage: WelcomePage = {
  pageHeading: `h1:text-is("Welcome to the MoneyHelper Pensions Dashboard")`,
  iUnderstandButton: 'welcome-button',
  welcomePageTitleText:
    'Welcome to the MoneyHelper Pensions Dashboard - MoneyHelper Pensions Dashboard',

  async welcomePageLoads(page): Promise<void> {
    await page.locator(this.pageHeading).waitFor();
  },

  async clickWelcomeButton(page): Promise<void> {
    await page.getByTestId('list-element').nth(0).isVisible();
    await page.getByTestId('list-element').nth(1).isVisible();
    await page.getByTestId(this.iUnderstandButton).click();
  },
};

export default welcomePage;
