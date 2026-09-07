import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import commonHelpers from '../utils/commonHelpers';
import { LocaleUtils } from '../utils/locale.util';
class BasePage {
  private readonly header = 'header';
  private readonly footer = 'footer';
  private readonly burgerIcon = '[data-testid="nav-toggle"]';
  private readonly burgerMenu = 'nav.t-header-navigation';
  private readonly logoutLink = 'logout-link';
  private readonly cyLink = `nav a.border:text-is("Cymraeg")`;
  private readonly closeBurgerMenu = 'nav-toggle';
  private readonly logoutFromModal = 'logout-yes';
  private readonly backLink = 'back';
  private readonly homeLink = 'home-link';

  async assertHeader(page: Page): Promise<boolean> {
    const headerLocator = page.getByTestId(this.header);
    await headerLocator.waitFor();
    return await headerLocator.isVisible();
  }

  async getPageTitle(page: Page): Promise<string> {
    return await page.title();
  }

  async assertFooter(page: Page): Promise<boolean> {
    const footerLocator = page.getByTestId(this.footer);
    await footerLocator.waitFor();
    return await footerLocator.isVisible();
  }

  async clickBurgerIcon(page: Page): Promise<void> {
    const burgerLocator = page.locator(this.burgerIcon);
    await burgerLocator.waitFor({ state: 'visible' });
    await burgerLocator.click();
    await page.locator(this.burgerMenu).waitFor({ state: 'visible' });
  }

  async assertBurgerMenu(page: Page): Promise<boolean> {
    const logoutVisible = await page
      .getByTestId('header')
      .getByTestId(this.logoutLink)
      .isVisible();
    const cyLinkVisible = await page.locator(this.cyLink).isVisible();
    return logoutVisible && cyLinkVisible;
  }

  async clickLogoutButtonFromModal(page: Page): Promise<void> {
    const logoutButton = page.getByTestId(this.logoutFromModal);
    await logoutButton.waitFor({ state: 'attached' });
    await logoutButton.click({ timeout: 5000 });
  }

  async logoutSuccessfully(page: Page, locale: Locale = 'en'): Promise<void> {
    const logoutHeadings = {
      en: /You['’]re about to leave/,
      cy: /Rydych chi ar fin gadael/,
    };

    await page.getByTestId('header').getByTestId(this.logoutLink).click();

    await page
      .getByRole('heading', { level: 2, name: logoutHeadings[locale] })
      .waitFor({ state: 'visible', timeout: 5000 });

    await this.clickLogoutButtonFromModal(page);
  }

  async logoutSuccessfullyJSDisabled(page: Page): Promise<void> {
    const aboutToLeaveText = LocaleUtils.getLocale(
      'site.logout.about-to-leave',
    );

    await page.getByTestId('header').getByTestId(this.logoutLink).click();
    await page.locator(`h1:has-text("${aboutToLeaveText.en}")`).waitFor();
    await page.getByRole('link', { name: 'Yes, exit the Dashboard' }).waitFor();
    await page.getByTestId(commonHelpers.backToTopLink).waitFor();
    await page.getByRole('link', { name: 'Yes, exit the Dashboard' }).click();
  }

  async openBurgerMenuButton(page: Page): Promise<void> {
    await page.getByTestId(this.closeBurgerMenu).click();
  }

  async closeBurgerMenuButton(page: Page): Promise<void> {
    const detailsMenu = page.locator('header details');

    const isOpen = await detailsMenu.evaluate((el: HTMLDetailsElement) =>
      el.hasAttribute('open'),
    );

    if (isOpen) {
      await page.getByTestId('nav-toggle').click();

      await page
        .locator('header details')
        .filter({ hasNot: page.locator('[open]') })
        .waitFor({ state: 'attached' });
    }
  }

  async checkHomeNavigation(page: Page): Promise<void> {
    await page.getByTestId(this.homeLink).waitFor({ state: 'visible' });
    await page.click('[data-testid="home-link"]');
    await page.waitForURL('**/your-pension-search-results');
  }

  getHomeLink(page: Page) {
    return page.getByTestId(this.homeLink);
  }
  getBackLink(page: Page) {
    return page.getByTestId(this.backLink);
  }
}

export default new BasePage();
