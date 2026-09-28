import { Page } from '@lib/test.lib';
import { unlockDeployPreviewIfNeeded } from '@utils/deploy-preview.util';
import { subHeading } from '@utils/shared.util';

export default class LandingPage {
  constructor(protected readonly page: Page) {}

  async acceptAllCookies(): Promise<void> {
    await this.page.getByRole('button', { name: 'Accept all cookies' }).click();
    await this.page.getByRole('dialog').waitFor({ state: 'hidden' });
  }

  private async gotoHome(): Promise<void> {
    await this.page.goto('/');
    await unlockDeployPreviewIfNeeded(this.page);
  }

  async startLearningHub(): Promise<void> {
    await this.gotoHome();
  }

  async navigateToPage(linkName: string): Promise<void> {
    await this.gotoHome();
    await this.acceptAllCookies();
    await this.link(linkName).click();
  }

  async navigateToPageWithoutCookieConsent(linkName: string): Promise<void> {
    await this.gotoHome();
    await this.link(linkName).first().click();
  }

  subHeading(text: string, level = 2) {
    return subHeading(this.page, text, level);
  }

  link(text: string) {
    return this.page.getByRole('link', { name: text });
  }

  get welshLanguageLink() {
    return this.page.getByRole('link', { name: /Cymraeg|Welsh/i });
  }

  get englishLanguageLink() {
    return this.page.getByRole('link', { name: /English/i });
  }

  async switchToWelsh(): Promise<void> {
    await this.page.getByRole('link', { name: /Cymraeg/ }).click();
  }

  async switchToEnglish(): Promise<void> {
    await this.page.getByRole('link', { name: /English/ }).click();
  }

  get pageTitleHeading() {
    return this.page.getByTestId('page-title');
  }

  get titleBannerHeading() {
    return this.page.getByTestId('title-banner-text');
  }

  async getPageName(): Promise<string> {
    const hasPageTitle = await this.pageTitleHeading.count();
    const heading = hasPageTitle
      ? this.pageTitleHeading
      : this.titleBannerHeading;
    return (await heading.innerText()).trim();
  }
}
