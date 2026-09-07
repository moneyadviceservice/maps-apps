import { Page } from '@maps/playwright';

import commonHelpers from '../utils/commonHelpers';

type YouHaveExitedTheDashboardPage = {
  heading: string;
  headingWelsh: string;
  makeTheMostHeading: string;
  returnButton: string;
  textOnPage: string;
  makeTheMostParagraphPartOne: string;
  makeTheMostParagraphPartTwo: string;
  viewPage(page: Page): Promise<void>;
  clickReturnToStart(page: Page): Promise<void>;
  clickLink(page: Page, linkText: string): Promise<Page>;
};

const youHaveExitedTheDashboardPage: YouHaveExitedTheDashboardPage = {
  heading: `h1:has-text("exited the Pensions Dashboard")`,
  headingWelsh: `h1:has-text("Dangosfwrdd Pensiynau")`,
  makeTheMostHeading: `h2:text-is("Make the most of your pension")`,
  makeTheMostParagraphPartOne: 'Our guides can help',
  makeTheMostParagraphPartTwo:
    '. Find ways to boost your retirement savings, learn if a pension transfer is a good idea and understand how and when you can start taking your pension.',
  returnButton: `a:text-is("Return to start page")`,
  textOnPage:
    'You can return to your Pensions Dashboard using GOV.UK One Login or use our other free tools to make the most of your pension.',

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
      page
        .getByText(this.makeTheMostParagraphPartOne)
        .waitFor({ state: 'visible' }),
      page
        .getByText(this.makeTheMostParagraphPartTwo)
        .waitFor({ state: 'visible' }),
      page.locator(this.makeTheMostHeading).waitFor({ state: 'visible' }),
      page.getByTestId(commonHelpers.backToTopLink).waitFor(),
    ]);
  },

  async clickLink(page: Page, linkText: string): Promise<Page> {
    const link = page.getByRole('link', { name: linkText });
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      link.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  },

  async clickReturnToStart(page: Page): Promise<void> {
    await page.locator(this.returnButton).click();
  },
};

export default youHaveExitedTheDashboardPage;
