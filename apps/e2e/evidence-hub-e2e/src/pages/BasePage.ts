import { Locator, Page } from '@playwright/test';

type BasePage = {
  clearInput(page: Page, name: string): Promise<void>;
  clickLink(page: Page, text: string): Promise<void>;
  fillInput(page: Page, name: string, value: string): Promise<void>;
  selectFilter(page: Page, name: string, values: string[]): Promise<void>;
  waitForPageLoad(page: Page, url: string): Promise<void>;
};

export const basePage: BasePage = {
  async clickLink(page: Page, text: string): Promise<void> {
    const link = page.getByRole('link', { name: text });
    await link.waitFor();
    await link.click();
    await page.waitForLoadState();
  },

  async fillInput(page: Page, name: string, value: string): Promise<void> {
    const locator: Locator = page
      .getByTestId('document-list-form-desktop')
      .locator(`input[name="${name}"]`);
    await locator.waitFor();
    await locator.fill(value);
  },

  async clearInput(page: Page, name: string): Promise<void> {
    const locator: Locator = page
      .getByTestId('document-list-form-desktop')
      .locator(`input[name="${name}"]`);
    await locator.waitFor();
    await locator.clear();
  },

  async selectFilter(
    page: Page,
    name: string,
    values: string[],
  ): Promise<void> {
    const locator: Locator = page
      .getByTestId('document-list-form-desktop')
      .locator('details')
      .filter({ hasText: name });
    await locator.waitFor();

    const classes = await locator.getAttribute('class');
    if (!classes.includes('tool-collapse')) {
      const titleLocator: Locator = page
        .getByTestId('document-list-form-desktop')
        .locator('summary')
        .filter({ hasText: name });
      await titleLocator.waitFor();
      await titleLocator.click();
    }

    for (const value of values) {
      const itemLocator: Locator = page
        .getByTestId('document-list-form-desktop')
        .locator('label')
        .filter({ hasText: value });
      await itemLocator.waitFor();
      await itemLocator.click();
    }
  },

  async waitForPageLoad(page: Page, url: string): Promise<void> {
    await page.waitForResponse('**/research-library.json**', {
      timeout: 10000,
    });
    await page.waitForLoadState();
    await page.waitForURL(url, {
      timeout: 10000,
    });
  },
};
