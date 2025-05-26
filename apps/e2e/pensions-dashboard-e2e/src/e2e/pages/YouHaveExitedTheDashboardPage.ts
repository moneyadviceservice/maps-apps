import { Page } from '@playwright/test';

type YouHaveExitedTheDashboardPage = {
  heading: string;
  returnButton: string;
  textOnPage: string;
  surveyLink: string;
  surveyPageURL: string;
  viewPage(page: Page): Promise<void>;
  clickReturnToStart(page: Page): Promise<void>;
  clickSurveyLink(page: Page): Promise<void>;
};

const youHaveExitedTheDashboardPage: YouHaveExitedTheDashboardPage = {
  heading: `h1:text-is("You’ve exited the Pensions Dashboard")`,
  returnButton: `a:text-is("Return to start page")`,
  textOnPage:
    'To return to your Pensions Dashboard, you’ll need to sign in again using GOV.UK One Login.',
  surveyLink: `a:text-is("What did you think of this service?")`,
  surveyPageURL: `https://forms.office.com/Pages/ResponsePage.aspx?id=MhDku86PQk26tUTiFRCIbQWmPIAsJ39Jk_BmPtD78jJUM1ZQTk8zMEFUVllJRTNHOTcwRkU3UENCVy4u`,

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
      page.locator(this.surveyLink).waitFor({ state: 'visible' }),
    ]);
  },

  async clickSurveyLink(page: Page): Promise<void> {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click(this.surveyLink),
    ]);
    await newPage.waitForLoadState();
    await newPage.waitForURL(this.surveyPageURL);
    await newPage.close();
  },

  async clickReturnToStart(page: Page): Promise<void> {
    await page.locator(this.returnButton).click();
  },
};

export default youHaveExitedTheDashboardPage;
