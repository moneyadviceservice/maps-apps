import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class FirmAdminDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  rowHeaders(): Locator {
    return this.page.locator('table tbody tr td:first-child');
  }

  rowValue(header: string): Locator {
    return this.page
      .locator('table tbody tr', { hasText: header })
      .locator('td')
      .nth(1);
  }

  addToDirectoryButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to Directory' });
  }

  hideFromDirectoryButton(): Locator {
    return this.page.getByRole('button', { name: 'Hide from Directory' });
  }

  reregisterButton(): Locator {
    return this.page.getByRole('button', { name: 'Re-register' });
  }

  async clickAddToDirectory(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/admin\/firms\//),
      this.addToDirectoryButton().click(),
    ]);
  }

  async clickHideFromDirectory(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/admin\/firms\//),
      this.hideFromDirectoryButton().click(),
    ]);
  }
}
