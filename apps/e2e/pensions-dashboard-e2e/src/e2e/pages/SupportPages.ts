import { Locator, Page } from '@maps/playwright';

interface SupportPages {
  helpAndSupportHeading(page: Page): Locator;
  findLinkAndSelect(page: Page, heading: any): Promise<void>;
  findBackButtonAndSelect(page: Page, heading: any): Promise<void>;
  clickContactUsWelcomeButton(page: Page): Promise<void>;
  clickContactUsSupportButton(page: Page): Promise<void>;
  clickHelpAndSupportContactUs(page: Page): Promise<void>;
}

const supportPages: SupportPages = {
  async findLinkAndSelect(page: Page, heading: any): Promise<void> {
    const link = page.locator(`a:has-text("${heading}")`);
    await link.click();
    await page.locator(`h1:text-is("${heading}")`).waitFor();
  },

  async findBackButtonAndSelect(page: Page, heading: any): Promise<void> {
    const backButton = page.locator('[data-testid="back"]');
    await backButton.click();
    await page.locator(`h1:has-text("${heading}")`).waitFor();
  },

  async clickContactUsSupportButton(page: Page): Promise<void> {
    await page.getByTestId('support-callout-link-contact').click();
  },

  async clickContactUsWelcomeButton(page: Page): Promise<void> {
    await page.getByTestId('welcome-button').click();
  },

  async clickHelpAndSupportContactUs(page: Page): Promise<void> {
    const container = page.getByTestId('help-and-support');
    const contactUsLink = container.getByRole('link', { name: 'Contact us' });
    await contactUsLink.click();
  },

  helpAndSupportHeading(page: Page) {
    return page.getByRole('heading', { name: 'Help and support' });
  },
};

export default supportPages;
