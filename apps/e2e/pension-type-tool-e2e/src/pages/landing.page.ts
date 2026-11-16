import { BasePage } from '@pages/Base.page';

export class LandingPage extends BasePage {
  get startNowButton() {
    // English button - href="/en/pension-type/question-1"
    return this.page.getByTestId('landing-page-button').first();
  }

  get startNowButtonCy() {
    // Welsh button - href="/cy/pension-type/question-1"
    // Get all landing page buttons and filter by href
    return this.page.locator('a[href="/cy/pension-type/question-1"]');
  }

  get cymraegLink() {
    return this.page.getByRole('link', { name: /cymraeg/i });
  }

  get pageHeading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get pageContent() {
    return this.page.getByRole('main');
  }

  get intro() {
    return this.page.getByText(
      /Use our free tool to check what type of pension you have|Defnyddiwch ein teclyn am ddim i wirio pa fath o bensiwn sydd gennych/,
    );
  }

  get contentBulletList() {
    return this.pageContent.getByRole('list').first();
  }

  get contentBulletItems() {
    return this.contentBulletList.getByRole('listitem');
  }

  get pensionsExplainedLink() {
    return this.page.getByRole('link', {
      name: /pensions explained guides|canllawiau esbonio pensiynau/i,
    });
  }

  async clickStartNow() {
    await this.startNowButton.click();
  }

  async clickStartNowCy() {
    await this.startNowButtonCy.click();
  }

  async clickCymraeg() {
    await this.cymraegLink.click();
  }
}
