import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import CommonHelpers from '../utils/commonHelpers';

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

  get helpAndSupportHeading() {
    return this.page.getByTestId('help-and-support-banner-heading');
  }

  get helpAndSupportBannerBody() {
    return this.page.getByTestId('help-and-support-banner-body');
  }

  get helpAndSupportBannerButton() {
    return this.page.getByTestId('help-and-support-banner-cta');
  }

  get supportPageHeading() {
    return this.page.getByTestId('page-title');
  }

  get supportPageSummary() {
    return this.page.getByTestId('tool-intro');
  }

  get supportPageTeaserCards() {
    return this.page.getByTestId('teaserCard');
  }

  getSupportPageTeaserCardLink(index: number) {
    return this.supportPageTeaserCards.nth(index).locator('h3 > a');
  }

  getSupportPageTeaserCardDescription(index: number) {
    return this.supportPageTeaserCards.nth(index).locator('p');
  }

  get backToTopLink() {
    return this.page
      .getByTestId('back-to-top')
      .getByRole('link', { name: 'Back to top' });
  }

  async clickBackToTopLink(): Promise<void> {
    await this.backToTopLink.click();
  }

  get understandYourNextStepsSection() {
    return this.page.getByTestId('onward-journey-banner');
  }

  get understandYourNextStepsHeading() {
    return this.page.getByTestId('onward-journey-banner-heading');
  }

  get understandYourNextStepsContent() {
    return this.page.getByTestId('onward-journey-banner-body');
  }

  async clickRetirementGuidanceLink(
    commonHelpers: CommonHelpers,
  ): Promise<Page> {
    const link = this.page.getByRole('link', {
      name: 'Get retirement guidance',
    });
    return await commonHelpers.clickLinkAndReturnNewPage(link);
  }

  get notWhatYoureLookingForSection() {
    return this.page.getByTestId('callout');
  }

  get notWhatYoureLookingForHeading() {
    return this.page.getByTestId('support-callout-title');
  }

  get notWhatYoureLookingForContent() {
    return this.page.getByTestId('support-callout-content');
  }

  get notWhatYoureLookingForUnderstandLink() {
    return this.page.getByTestId('support-callout-link-understand');
  }
  get notWhatYoureLookingForContactLink() {
    return this.page.getByTestId('support-callout-link-contact');
  }
  get notWhatYoureLookingForUsingLink() {
    return this.page.getByTestId('support-callout-link-using');
  }
  get supportHomeLink() {
    return this.page.getByTestId('support-home-link');
  }

  get backButton() {
    return this.page.getByTestId('back');
  }
}

export default SupportPages;
