/**
 * Page Object Model representing pagination controls on the results page.
 *
 * Responsibilities:
 * - Locate and interact with pagination elements
 * - Provide helper methods to:
 *   - Wait for pagination to be ready
 *   - Retrieve total page count
 *   - Assert the currently active page
 *   - Interact with navigation controls (e.g., previous, back to top)
 *
 * Designed to improve test readability and maintainability by
 * encapsulating pagination behaviour in a reusable component.
 */
import { expect, type ExtendedPage, type Locator } from '@lib/test.lib';

export class PaginationPage {
  readonly page: ExtendedPage;

  readonly pageLinks: Locator;
  readonly clickableLinks: Locator;

  readonly previousLink: Locator;
  readonly nextLink: Locator;
  readonly backToTopLink: Locator;

  readonly activePage: Locator;

  constructor(page: ExtendedPage) {
    this.page = page;

    this.pageLinks = page.locator('[id^="page-"]');
    this.clickableLinks = page.locator('a[id^="page-"]');

    //
    // ✅ Previous (EN + CY safe)
    //
    this.previousLink = page
      .getByTestId('previous-button')
      .or(
        page.locator('[aria-label*="previous" i], [aria-label*="blaenorol" i]'),
      )
      .or(page.getByText(/previous|blaenorol/i));

    //
    // ✅ Next (EN + CY)
    //
    this.nextLink = page
      .getByTestId('next-button')
      .or(page.locator('[aria-label*="next" i], [aria-label*="nesaf" i]'))
      .or(page.getByText(/next|nesaf/i));

    //
    // ✅ Back to top (EN + CY)
    //
    this.backToTopLink = page.getByText(/back to top|nôl i'r brig/i).first();

    //
    // ✅ Active page
    //
    this.activePage = page.locator('[id^="page-"][aria-current="page"]');
  }

  async waitForReady() {
    await expect(this.pageLinks.first()).toBeVisible();
  }

  async getPageCount() {
    return this.pageLinks.count();
  }

  async expectPageActive(pageNumber: number) {
    const active = this.page.locator(
      `#page-${pageNumber}[aria-current="page"]`,
    );
    await expect(active).toBeVisible();
  }

  async expectAnyActivePageVisible() {
    await expect(this.activePage.first()).toBeVisible();
  }

  async clickPrevious() {
    await expect(this.previousLink.first()).toBeVisible();
    await this.previousLink.first().click();
  }

  async clickNext() {
    await expect(this.nextLink.first()).toBeVisible();
    await this.nextLink.first().click();
  }

  async clickBackToTop() {
    await expect(this.backToTopLink).toBeVisible();
    await this.backToTopLink.click();
  }
}
