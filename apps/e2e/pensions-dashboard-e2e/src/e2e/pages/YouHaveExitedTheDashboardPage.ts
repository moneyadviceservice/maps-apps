import { Page } from '@maps/playwright';

import commonHelpers from '../utils/commonHelpers';

type YouHaveExitedTheDashboardPage = {
  heading: string;
  returnButton: string;
  textOnPage: string;
  surveyPageURL: string;
  viewPage(page: Page): Promise<void>;
  clickReturnToStart(page: Page): Promise<void>;
};

const youHaveExitedTheDashboardPage: YouHaveExitedTheDashboardPage = {
  heading: `h1:text-is("You’ve exited the Pensions Dashboard")`,
  returnButton: `a:text-is("Return to start page")`,
  textOnPage:
    'To return to your Pensions Dashboard, you’ll need to sign in again using GOV.UK One Login.',

  async viewPage(page): Promise<void> {
    await page.locator(this.heading).waitFor({ state: 'visible' });
    await Promise.all([
      page.waitForURL((url) =>
        url.toString().includes('/you-have-exited-the-pensions-dashboard'),
      ),
      page.locator(this.returnButton).waitFor({ state: 'visible' }),
      page
        .locator(`p.mb-8:has-text("${this.textOnPage}")`)
        .waitFor({ state: 'visible' }),
      page.getByTestId(commonHelpers.backToTopLink).waitFor(),
    ]);
  },

  async clickReturnToStart(page: Page): Promise<void> {
    await page.locator(this.returnButton).click();
  },
};

export default youHaveExitedTheDashboardPage;
