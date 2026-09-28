import { Page } from '@maps/playwright';

class SupportPages {
  constructor(private readonly page: Page) {}

  async findLinkAndSelect(heading: any): Promise<void> {
    const link = this.page.locator(`a:has-text("${heading}")`);
    await link.click();
    await this.page.locator(`h1:text-is("${heading}")`).waitFor();
  }

  async findBackButtonAndSelect(heading: any): Promise<void> {
    const backButton = this.page.locator('[data-testid="back"]');
    await backButton.click();
    await this.page.locator(`h1:has-text("${heading}")`).waitFor();
  }

  async clickContactUsSupportButton(): Promise<void> {
    await this.page.getByTestId('support-callout-link-contact').click();
  }

  async clickContactUsWelcomeButton(): Promise<void> {
    await this.page.getByTestId('welcome-button').click();
  }

  helpAndSupportHeading() {
    return this.page.getByRole('heading', { name: 'Help and support' });
  }
}

export default SupportPages;
