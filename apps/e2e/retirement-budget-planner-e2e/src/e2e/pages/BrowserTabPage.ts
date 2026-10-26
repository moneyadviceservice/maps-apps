import { expect, Page } from '@playwright/test';

interface BrowserTabPage {
  getPageTitle(): Promise<string>;
  verifyTabTitle(expectedTitle: string): Promise<void>;
}

const browserTabPage = (page: Page): BrowserTabPage => {
  return {
    async getPageTitle(): Promise<string> {
      return page.title();
    },

    async verifyTabTitle(expectedTitle: string): Promise<void> {
      const actualTitle = await page.title();
      expect(actualTitle).toBe(expectedTitle);
    },
  };
};

export default browserTabPage;
