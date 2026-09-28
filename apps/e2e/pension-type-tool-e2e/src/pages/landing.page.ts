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
    return this.page.locator('h1').first();
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
