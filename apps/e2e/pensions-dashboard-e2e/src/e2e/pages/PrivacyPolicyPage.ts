import { Locator, Page } from '@maps/playwright';

type PrivacyPolicyPage = {
  clickStartPageLink(page: Page, link: string): Promise<void>;
  clickPrivacyFooterlink(page: Page, link: string): Promise<void>;
  getPageBody(page: Page): Locator;
  getSectionHeading(page: Page, sectionNumber: number): Locator;
  getSectionBody(page: Page, sectionNumber: number): Locator;
  getCookiePolicyLink(page: Page): Locator;
};

const privacyPolicyPage: PrivacyPolicyPage = {
  async clickStartPageLink(page, link): Promise<void> {
    await page.locator(link).first().click();
    await page.locator('h1:text-is("Privacy notice")').waitFor();
  },

  async clickPrivacyFooterlink(page, link): Promise<void> {
    await page.locator(`[data-testid="footer"] ${link}`).click();
    await page.locator('h1:text-is("Privacy notice")').waitFor();
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

  getCookiePolicyLink(page): Locator {
    return page.getByRole('link', { name: 'Read our cookie policy' });
  },
};

export default privacyPolicyPage;
