import { Locator, Page } from '@playwright/test';

type CookiePolicyPage = {
  clickCookiesPolicyLink(page: Page, link: string): Promise<void>;
  getPageBody(page: Page): Locator;
  getSectionHeading(page: Page, sectionNumber: number): Locator;
  getSectionBody(page: Page, sectionNumber: number): Locator;
};

const cookiePolicyPage: CookiePolicyPage = {
  async clickCookiesPolicyLink(page, link): Promise<void> {
    await page.locator(link).click();
    //await page.locator('h1:text-is("Cookies")').waitFor();
  },

  getPageBody(page): Locator {
    return page.locator('body');
  },

  getSectionHeading(page, sectionNumber): Locator {
    return page.locator(`[data-testid="section${sectionNumber}"] > h2`);
  },

  getSectionBody(page, sectionNumber): Locator {
    return page.locator(`[data-testid="section${sectionNumber}"]`);
  },

  // async verifyPageName(page): Promise<void> {
  //     await expect(page).toHaveTitle(
  //           'Dashboard privacy notice | MoneyHelper Pensions Dashboard',
  //     );
  // }
};

export default cookiePolicyPage;
