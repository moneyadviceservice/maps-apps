import { Locator, Page } from '@playwright/test';

type BasePage = {
  assertHeading(page: Page, text: string): Promise<boolean>;
  assertTitle(page: Page, text: string): Promise<boolean>;
};

export const basePage: BasePage = {
  async assertHeading(page: Page, text: string): Promise<boolean> {
    const locator: Locator = page.getByRole('heading', {
      name: text,
      exact: true,
    });
    await locator.waitFor();
    return await locator.isVisible();
  },

  async assertTitle(page: Page, text: string): Promise<boolean> {
    const locator: Locator = page.getByTestId('toolpage-span-title');
    await locator.waitFor();
    if ((await locator.textContent()) === text) {
      return await locator.isVisible();
    }
    return false;
  },
};
