import { Locator, Page } from '@playwright/test';

type HomePage = {
  heading: string;
  footer: string;
  pageLevelHeading: string;
  privacyLink: string;
  accessibilityLink: string;
  cookiesLink: string;
  sitemapLink: string;
  subHeading: string;
  assertFooter(page: Page): Promise<boolean>;
  assertHeading(page: Page): Promise<boolean>;
  clickFooterLink(page: Page, linkName: string): Promise<void>;
  clickLink(page: Page, text: string): Promise<void>;
  clickMenuItem(page: Page, text: string): Promise<void>;
  clickNavLink(page: Page, text: string): Promise<void>;
  getHeading(page: Page): Promise<Locator>;
  getSubHeading(page: Page): Promise<Locator>;
  disableCookieConsent(page: Page): Promise<void>;
};

export const homePage: HomePage = {
  heading: 'h1:has-text("Introducing the Standard Financial Statement")',
  pageLevelHeading: 'h1',
  footer: 'footer',
  privacyLink: 'Privacy',
  accessibilityLink: 'Accessibility',
  cookiesLink: 'Cookies',
  sitemapLink: 'Sitemap',
  subHeading: 'p > strong',

  async assertHeading(page: Page): Promise<boolean> {
    const headingLocator = page.locator(this.heading);
    await headingLocator.waitFor();
    return await headingLocator.isVisible();
  },

  async getHeading(page: Page): Promise<Locator> {
    const headingLocator = page.locator(this.pageLevelHeading);
    await headingLocator.waitFor();
    await headingLocator.isVisible();
    return headingLocator;
  },

  async getSubHeading(page: Page): Promise<Locator> {
    const headingLocator = page.locator(this.subHeading);
    await headingLocator.waitFor();
    await headingLocator.isVisible();
    return headingLocator;
  },

  async assertFooter(page: Page): Promise<boolean> {
    const footerLocator = page.getByTestId(this.footer);
    await footerLocator.waitFor();
    return await footerLocator.isVisible();
  },

  async clickFooterLink(page: Page, linkName: string): Promise<void> {
    const link = page.getByRole('link', { name: linkName });
    await link.click();
    await page.waitForLoadState();
    await page.locator(`h1:has-text("${linkName}")`).waitFor();
  },

  async clickMenuItem(page: Page, text: string): Promise<void> {
    const link = page.getByTestId('header').getByRole('link', { name: text });
    await link.waitFor();
    await link.click();
    await page.waitForLoadState();
  },

  async clickLink(page: Page, text: string): Promise<void> {
    const link = page.getByRole('link', { name: text });
    await link.waitFor();
    await link.click();
    await page.waitForLoadState();
  },

  async clickNavLink(page: Page, text: string): Promise<void> {
    const link = page.locator(`nav li > a:has-text("${text}")`);
    await link.waitFor();
    await link.click();
    await page.waitForLoadState();
  },

  async disableCookieConsent(page: Page): Promise<void> {
    // Mock the API endpoint for cookie consent
    await page.route('**/c/v**', (route) => {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: '',
      });
    });
  },
};
