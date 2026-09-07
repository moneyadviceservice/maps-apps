import { Page } from '@playwright/test';

import { basePage } from './basePage';

interface HomePage {
  startRetirementGuidance(page: Page): Promise<void>;
  handleCookies(page: Page): Promise<void>;
  clickWelshLink(page: Page): Promise<void>;
  clickEnglishLink(page: Page): Promise<void>;
}

const pageHeading = 'Get retirement guidance';

const homePage: HomePage = {
  async startRetirementGuidance(page: Page): Promise<void> {
    await page.goto('/');
    await basePage.waitForPageHeading(page, pageHeading);
  },
  async handleCookies(page) {
    await page
      .getByRole('button', { name: 'Accept all cookies' })
      .click({ timeout: 10000 })
      .catch(() => {
        console.log('Cookie banner not found');
      });
  },
  async clickWelshLink(page) {
    await page.getByRole('link', { name: 'Cymraeg' }).click();
  },
  async clickEnglishLink(page) {
    await page.getByRole('link', { name: 'English' }).click();
  },
};

export default homePage;
