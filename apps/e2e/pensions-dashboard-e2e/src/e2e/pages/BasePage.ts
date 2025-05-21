import { Page } from '@playwright/test';

type BasePage = {
  header: string;
  footer: string;
  metaRobots: string;
  burgerIcon: string;
  burgerMenu: string;
  logoutLink: string;
  cyLink: string;
  aboutToLeave: string;
  confirmLogout: string;
  closeBurgerMenu: string;
  logoutFromModal: string;
  assertHeader(page: Page): Promise<boolean>;
  assertFooter(page: Page): Promise<boolean>;
  clickBurgerIcon(page: Page): Promise<void>;
  assertBurgerMenu(page: Page): Promise<boolean>;
  logoutSuccessfully(page: Page): Promise<void>;
  logoutSuccessfullyJSDisabled(page: Page): Promise<void>;
  closeBurgerMenuButton(page: Page): Promise<void>;
};

const basePage: BasePage = {
  header: 'header',
  footer: 'footer',
  metaRobots: 'meta[name="robots"]',
  burgerIcon: 'summary[data-testid="nav-toggle"]',
  burgerMenu: 'nav.t-header-navigation',
  logoutLink: `nav a[data-testid="logout-link"]`,
  cyLink: `nav a.border:text-is("Cymraeg")`,
  aboutToLeave: `You’re about to leave`,
  confirmLogout: `a:has-text("Yes, exit the Dashboard")`,
  closeBurgerMenu: 'nav-toggle',
  logoutFromModal: 'logout-yes',

  async assertHeader(page: Page): Promise<boolean> {
    const headerLocator = page.getByTestId(this.header);
    await headerLocator.waitFor();
    return await headerLocator.isVisible();
  },

  async assertFooter(page: Page): Promise<boolean> {
    const footerLocator = page.getByTestId(this.footer);
    await footerLocator.waitFor();
    return await footerLocator.isVisible();
  },

  async clickBurgerIcon(page: Page): Promise<void> {
    const burgerLocator = page.locator(this.burgerIcon);
    await burgerLocator.waitFor({ state: 'visible' });
    await burgerLocator.click();
    await page.locator(this.burgerMenu).waitFor({ state: 'visible' });
  },

  async assertBurgerMenu(page: Page): Promise<boolean> {
    const logoutVisible = await page.locator(this.logoutLink).isVisible();
    const cyLinkVisible = await page.locator(this.cyLink).isVisible();
    return logoutVisible && cyLinkVisible;
  },

  async logoutSuccessfully(page: Page): Promise<void> {
    await page.locator(this.logoutLink).click();
    await page
      .locator(`h2:has-text("${this.aboutToLeave}")`)
      .waitFor({ state: 'visible' });

    // Wait for modal to be fully visible and interactive
    const logoutButton = page.getByTestId(this.logoutFromModal);
    await logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await logoutButton.waitFor({ state: 'attached' });
    await logoutButton.click({ timeout: 5000 });
  },

  async logoutSuccessfullyJSDisabled(page: Page): Promise<void> {
    await page.locator(this.logoutLink).click();
    await page.getByRole('link', { name: 'Yes, exit the Dashboard' }).waitFor();
    await page.getByRole('link', { name: 'Yes, exit the Dashboard' }).click();
  },

  async closeBurgerMenuButton(page: Page): Promise<void> {
    await page.getByTestId(this.closeBurgerMenu).click();
  },
};

export default basePage;
