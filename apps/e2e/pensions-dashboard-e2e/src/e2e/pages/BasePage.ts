import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import { LocaleUtils } from '../utils/locale.util';
import CommonHelpers from '../utils/commonHelpers';
import CookieConsent from '../utils/cookieConsent';

class BasePage {
  private readonly commonHelpers: CommonHelpers;

  constructor(private readonly page: Page, cookieConsent: CookieConsent) {
    this.commonHelpers = new CommonHelpers(page, cookieConsent);
  }

  private readonly header = 'header';
  private readonly footer = 'footer';
  readonly burgerIcon = '[data-testid="nav-toggle"]';
  private readonly burgerMenu = 'nav.t-header-navigation';
  readonly logoutLink = 'logout-link';
  readonly cyLink = `nav a.border:text-is("Cymraeg")`;
  private readonly closeBurgerMenu = 'nav-toggle';
  private readonly logoutFromModal = 'logout-yes';
  private readonly backLink = 'back';
  private readonly homeLink = 'home-link';

  async assertHeader(): Promise<boolean> {
    const headerLocator = this.page.getByTestId(this.header);
    await headerLocator.waitFor();
    return await headerLocator.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async assertFooter(): Promise<boolean> {
    const footerLocator = this.page.getByTestId(this.footer);
    await footerLocator.waitFor();
    return await footerLocator.isVisible();
  }

  async clickBurgerIcon(): Promise<void> {
    const burgerLocator = this.page.locator(this.burgerIcon);
    await burgerLocator.waitFor({ state: 'visible' });
    await burgerLocator.click();
    await this.page.locator(this.burgerMenu).waitFor({ state: 'visible' });
  }

  async assertBurgerMenu(): Promise<boolean> {
    const logoutVisible = await this.page
      .getByTestId('header')
      .getByTestId(this.logoutLink)
      .isVisible();
    const cyLinkVisible = await this.page.locator(this.cyLink).isVisible();
    return logoutVisible && cyLinkVisible;
  }

  async clickLogoutButtonFromModal(): Promise<void> {
    const logoutButton = this.page.getByTestId(this.logoutFromModal);
    await logoutButton.waitFor({ state: 'attached' });
    await logoutButton.click({ timeout: 5000 });
  }

  async logoutSuccessfully(locale: Locale = 'en'): Promise<void> {
    const logoutHeadings = {
      en: /You['’]re about to leave/,
      cy: /Rydych chi ar fin gadael/,
    };

    await this.page.getByTestId('header').getByTestId(this.logoutLink).click();

    await this.page
      .getByRole('heading', { level: 2, name: logoutHeadings[locale] })
      .waitFor({ state: 'visible', timeout: 5000 });

    await this.clickLogoutButtonFromModal();
  }

  async logoutSuccessfullyJSDisabled(): Promise<void> {
    const aboutToLeaveText = LocaleUtils.getLocale(
      'site.logout.about-to-leave',
    );

    await this.page.getByTestId('header').getByTestId(this.logoutLink).click();
    await this.page.locator(`h1:has-text("${aboutToLeaveText.en}")`).waitFor();
    await this.page
      .getByRole('link', { name: 'Yes, exit the Dashboard' })
      .waitFor();
    await this.page.getByTestId(this.commonHelpers.backToTopLink).waitFor();
    await this.page
      .getByRole('link', { name: 'Yes, exit the Dashboard' })
      .click();
  }

  async openBurgerMenuButton(): Promise<void> {
    await this.page.getByTestId(this.closeBurgerMenu).click();
  }

  async closeBurgerMenuButton(): Promise<void> {
    const detailsMenu = this.page.locator('header details');

    const isOpen = await detailsMenu.evaluate((el: HTMLDetailsElement) =>
      el.hasAttribute('open'),
    );

    if (isOpen) {
      await this.page.getByTestId('nav-toggle').click();

      await this.page
        .locator('header details')
        .filter({ hasNot: this.page.locator('[open]') })
        .waitFor({ state: 'attached' });
    }
  }

  async checkHomeNavigation(): Promise<void> {
    await this.page.getByTestId(this.homeLink).waitFor({ state: 'visible' });
    await this.page.click('[data-testid="home-link"]');
    await this.page.waitForURL('**/your-pension-search-results');
  }

  getHomeLink() {
    return this.page.getByTestId(this.homeLink);
  }
  getBackLink() {
    return this.page.getByTestId(this.backLink);
  }
}

export default BasePage;
