import { Page } from '@maps/playwright';
import CommonHelpers from '../utils/commonHelpers';
import CookieConsent from '../utils/cookieConsent';

class YouHaveExitedTheDashboardPage {
  private readonly commonHelpers: CommonHelpers;

  constructor(private readonly page: Page, cookieConsent: CookieConsent) {
    this.commonHelpers = new CommonHelpers(page, cookieConsent);
  }

  readonly heading = `h1:has-text("exited the Pensions Dashboard")`;
  readonly headingWelsh = `h1:has-text("Dangosfwrdd Pensiynau")`;
  readonly makeTheMostHeading = `h2:text-is("Make the most of your pension")`;
  readonly makeTheMostParagraphPartOne = 'Our guides can help';
  readonly makeTheMostParagraphPartTwo =
    '. Find ways to boost your retirement savings, learn if a pension transfer is a good idea and understand how and when you can start taking your pension.';
  readonly returnButton = `a:text-is("Return to start page")`;
  readonly textOnPage =
    'You can return to your Pensions Dashboard using GOV.UK One Login or use our other free tools to make the most of your pension.';

  async viewPage(): Promise<void> {
    await this.page.locator(this.heading).waitFor({ state: 'visible' });
    await Promise.all([
      this.page.waitForURL((url) =>
        url.toString().includes('/you-have-exited-the-pensions-dashboard'),
      ),
      this.page.locator(this.returnButton).waitFor({ state: 'visible' }),
      this.page
        .locator(`p.mb-8:has-text("${this.textOnPage}")`)
        .waitFor({ state: 'visible' }),
      this.page
        .getByText(this.makeTheMostParagraphPartOne)
        .waitFor({ state: 'visible' }),
      this.page
        .getByText(this.makeTheMostParagraphPartTwo)
        .waitFor({ state: 'visible' }),
      this.page.locator(this.makeTheMostHeading).waitFor({ state: 'visible' }),
      this.page.getByTestId(this.commonHelpers.backToTopLink).waitFor(),
    ]);
  }

  async clickLink(linkText: string): Promise<Page> {
    const link = this.page.getByRole('link', { name: linkText });
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async clickReturnToStart(): Promise<void> {
    await this.page.locator(this.returnButton).click();
  }
}

export default YouHaveExitedTheDashboardPage;
