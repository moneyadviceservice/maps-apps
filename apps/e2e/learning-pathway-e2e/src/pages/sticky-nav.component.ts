import { expect, type Locator, type Page } from '../lib/test.lib';

export class StickyNavComponent {
  constructor(private readonly page: Page) {}

  get container(): Locator {
    return this.page.getByTestId('sticky-nav');
  }

  get toggle(): Locator {
    return this.page.getByTestId('sticky-nav-toggle');
  }

  get startBoundary(): Locator {
    return this.page.locator('h2, [data-sticky-nav-start]').first();
  }

  get footer(): Locator {
    return this.page.locator('footer');
  }

  get sideNavigationFallback(): Locator {
    return this.page.locator('[data-testid="side-navigation"]:visible').first();
  }

  async scrollPastStartBoundary(): Promise<void> {
    await this.startBoundary.evaluate((el) => {
      window.scrollBy(0, el.getBoundingClientRect().top + 1);
    });
  }

  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async assertVisible(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  async assertHidden(): Promise<void> {
    await expect(this.container).toBeHidden();
  }

  async assertSideNavigationFallbackJustAboveFooter(): Promise<void> {
    await expect(this.sideNavigationFallback).toBeVisible();
    await expect(this.footer).toBeVisible();

    const precedesFooter = await this.sideNavigationFallback.evaluate((nav) => {
      const footer = document.querySelector('footer');
      if (!footer) return false;
      return Boolean(
        nav.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    expect(precedesFooter).toBe(true);
  }
}
