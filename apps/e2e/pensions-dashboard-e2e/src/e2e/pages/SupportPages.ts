import { Page } from '@playwright/test';

interface SupportPages {
  findLinkAndSelect(page: Page, heading: any): Promise<void>;
  findBackButtonAndSelect(page: Page, heading: any): Promise<void>;
}

const supportPages: SupportPages = {
  async findLinkAndSelect(page: Page, heading: any): Promise<void> {
    const link = page.locator(`a:has-text("${heading}")`);
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.locator(`h1:text-is("${heading}")`).waitFor();
  },

  async findBackButtonAndSelect(page: Page, heading: any): Promise<void> {
    const backButton = page.locator('[data-testid="back"]');
    await backButton.click();
    await page.locator(`h1:has-text("${heading}")`).waitFor();
  },
};

export default supportPages;
