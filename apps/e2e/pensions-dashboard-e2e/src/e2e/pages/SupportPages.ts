import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';

class SupportPages {
  constructor(private readonly page: Page) {}

  private readonly helpAndSupportPageText = {
    en: 'How can we help you?',
    cy: 'Sut allwn ni eich helpu?',
  };

  async findLinkAndSelect(heading: any): Promise<void> {
    const link = this.page.locator(`a:has-text("${heading}")`);
    await link.click();
    await this.page.locator(`h1:text-is("${heading}")`).waitFor();
  }

  async findSupportCardAndSelect(heading: any): Promise<void> {
    const link = this.page
      .getByTestId('teaserCard')
      .locator(`a:has-text("${heading}")`);
    await link.click();
    await this.page.locator(`h1:text-is("${heading}")`).waitFor();
  }

  async findSupportLinkAndSelect(locale: Locale = 'en'): Promise<void> {
    const text = this.helpAndSupportPageText[locale];

    const supportHomeLink = this.page.getByTestId(
      'help-and-support-banner-cta',
    );
    await supportHomeLink.click();
    await this.page.locator(`h1:has-text("${text}")`).waitFor();
  }

  async findSupportHomeNavAndSelect(locale: Locale = 'en'): Promise<void> {
    const text = this.helpAndSupportPageText[locale];
    const supportHomeLink = this.page.getByTestId('support-home-link');
    await supportHomeLink.click();
    await this.page.locator(`h1:has-text("${text}")`).waitFor();
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
    return this.page.getByTestId('help-and-support-banner-heading');
  }
}

export default SupportPages;
