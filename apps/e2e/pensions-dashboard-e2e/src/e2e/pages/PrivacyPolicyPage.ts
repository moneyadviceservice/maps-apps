import { Locator, Page } from '@maps/playwright';

class PrivacyPolicyPage {
  constructor(private readonly page: Page) {}

  async clickStartPageLink(link: string): Promise<void> {
    await this.page.locator(link).first().click();
    await this.page.locator('h1:text-is("Privacy notice")').waitFor();
  }

  async clickPrivacyFooterlink(link: string): Promise<void> {
    await this.page.locator(`[data-testid="footer"] ${link}`).click();
    await this.page.locator('h1:text-is("Privacy notice")').waitFor();
  }

  getPageBody(): Locator {
    return this.page.locator('body');
  }

  getSectionHeading(sectionNumber: number): Locator {
    return this.page.locator(`[data-testid="section${sectionNumber}"] > h2`);
  }

  getSectionBody(sectionNumber: number): Locator {
    return this.page.locator(`[data-testid="section${sectionNumber}"]`);
  }

  getCookiePolicyLink(): Locator {
    return this.page.getByRole('link', { name: 'Read our cookie policy' });
  }
}

export default PrivacyPolicyPage;
