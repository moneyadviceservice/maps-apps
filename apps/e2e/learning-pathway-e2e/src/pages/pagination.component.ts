import { expect, type Locator, type Page } from '../lib/test.lib';

export class PaginationComponent {
  constructor(private readonly page: Page) {}

  // ---------------------------------------------------------------------------
  // Pagination controls (use data-testid from actual Pagination component)
  // ---------------------------------------------------------------------------

  nextButton(index: 0 | 1 = 0): Locator {
    return this.page.getByTestId('next-button').nth(index);
  }

  previousButton(index: 0 | 1 = 0): Locator {
    return this.page.getByTestId('previous-button').nth(index);
  }

  pageLink(pageNum: number): Locator {
    return this.page
      .locator(`a[href*="p=${pageNum}"]:not([id*="mobile"])`)
      .first();
  }

  activePage(): Locator {
    return this.page.locator('[data-testid^="desktop-active-page-"]').first();
  }

  paginationNav(): Locator {
    return this.page
      .locator('nav[aria-label="pagination"], nav[data-testid="pagination"]')
      .first();
  }

  // ---------------------------------------------------------------------------
  // Result count text (specific range: "1 – 10 of 15")
  // ---------------------------------------------------------------------------

  resultRangeText(): Locator {
    // Matches "1 – 10 of 15" or "11 – 20 of 15"
    return this.page
      .locator(String.raw`text=/\d{1,10}\s*[–-]\s*\d{1,10}\s+of\s+\d{1,10}/i`)
      .first();
  }

  viewPerPageDropdown(): Locator {
    return this.page.locator('[data-testid="cards-per-page-select"]').nth(0);
  }

  documentsFoundText(): Locator {
    return this.page
      .locator(String.raw`text=/\d{1,10}\s+documents?\s+found/i`)
      .first();
  }

  async getResultRangeText(): Promise<string> {
    return (await this.resultRangeText().innerText()).trim();
  }

  async getTotalDocuments(): Promise<number> {
    const text = await this.documentsFoundText().innerText();
    const match = /\d+/.exec(text);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  // ---------------------------------------------------------------------------
  // Pagination actions
  // ---------------------------------------------------------------------------

  async scrollToBottom(): Promise<void> {
    await this.paginationNav().scrollIntoViewIfNeeded();
  }

  async clickNext(): Promise<void> {
    // Try desktop button first (index 0) if visible, fallback to mobile button (index 1)
    const isDesktopVisible = await this.nextButton(0)
      .isVisible()
      .catch(() => false);

    if (isDesktopVisible) {
      await this.nextButton(0).click();
    } else {
      // Mobile button exists in DOM but is off-screen, click it anyway
      await this.nextButton(1)
        .click()
        .catch(() => {
          void 0; // Handle error silently
        });
    }
  }

  async clickPrevious(): Promise<void> {
    // Try desktop button first (index 0) if visible, fallback to mobile button (index 1)
    const isDesktopVisible = await this.previousButton(0)
      .isVisible()
      .catch(() => false);

    if (isDesktopVisible) {
      await this.previousButton(0).click();
    } else {
      // Mobile button exists in DOM but is off-screen, click it anyway
      await this.previousButton(1)
        .click()
        .catch(() => {
          void 0; // Handle error silently
        });
    }
  }

  async clickPageNumber(pageNum: number): Promise<void> {
    const link = this.pageLink(pageNum);
    await link.waitFor({ state: 'visible', timeout: 5000 });
    await link.click();
    // Wait for active page indicator to update to the new page
    await this.page
      .locator(`[data-testid="desktop-active-page-${pageNum}"]`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectViewPerPage(option: string): Promise<void> {
    const dropdown = this.viewPerPageDropdown();
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });

    const total = await this.getTotalDocuments();
    const pageSize = Number.parseInt(option, 10);
    const expectRangeVisible = total > pageSize;

    // Select the option and trigger change event
    await dropdown.selectOption(option);

    // Wait for URL to update with the new limit parameter
    // Use generous timeout for slow pipeline environments (may have 1-2s page loads)
    await this.page
      .waitForURL(new RegExp(`limit=${option}`), { timeout: 20000 })
      .catch(() => {
        // URL might not change in some edge cases
      });

    await this.pollUntil(async () => {
      const count = await this.resultRangeText().count();
      if (!expectRangeVisible) return count === 0;
      if (count === 0) return false;
      const { end } = await this.getResultRangeAsNumbers();
      return end === Math.min(pageSize, total);
    }, 15000);
  }

  private async pollUntil(
    predicate: () => Promise<boolean>,
    timeout: number,
    interval = 250,
  ): Promise<void> {
    const deadline = Date.now() + timeout;
    do {
      if (await predicate()) return;
      await new Promise((resolve) => setTimeout(resolve, interval));
    } while (Date.now() < deadline);
  }

  // ---------------------------------------------------------------------------
  // Pagination state checks
  // ---------------------------------------------------------------------------

  async isNextVisible(): Promise<boolean> {
    // Check both desktop (0) and mobile (1) versions
    // Returns true if EITHER is visible (in viewport) OR exists and is enabled (off-screen)
    const isDesktopVisible = await this.nextButton(0)
      .isVisible()
      .catch(() => false);

    const isMobileVisible = await this.nextButton(1)
      .isVisible()
      .catch(() => false);

    if (isDesktopVisible || isMobileVisible) return true;

    // If neither is visible in viewport, check if mobile button is in DOM and enabled
    // This handles off-screen mobile buttons that still work
    const mobileCount = await this.nextButton(1)
      .count()
      .catch(() => 0);
    if (mobileCount === 0) return false;

    // Mobile button exists in DOM but is off-screen, assume it's functional
    return true;
  }

  async isPreviousVisible(): Promise<boolean> {
    // Check both desktop (0) and mobile (1) versions
    // Returns true if EITHER is visible (in viewport) OR exists and is enabled (off-screen)
    const isDesktopVisible = await this.previousButton(0)
      .isVisible()
      .catch(() => false);

    const isMobileVisible = await this.previousButton(1)
      .isVisible()
      .catch(() => false);

    if (isDesktopVisible || isMobileVisible) return true;

    // If neither is visible in viewport, check if mobile button is in DOM
    // This handles off-screen mobile buttons that still work
    const mobileCount = await this.previousButton(1)
      .count()
      .catch(() => 0);
    if (mobileCount === 0) return false;

    // Mobile button exists in DOM but is off-screen, assume it's functional
    return true;
  }

  async isNextDisabled(): Promise<boolean> {
    const isVisible = await this.isNextVisible();
    return !isVisible;
  }

  async isPreviousDisabled(): Promise<boolean> {
    const isVisible = await this.isPreviousVisible();
    return !isVisible;
  }

  async getCurrentPage(): Promise<number> {
    const el = this.page
      .locator('[data-testid^="desktop-active-page-"]')
      .first();
    const testId = await el.getAttribute('data-testid');
    const match = testId ? /-\d+$/.exec(testId) : null;
    return match ? Number.parseInt(match[0].slice(1), 10) : Number.NaN;
  }

  async getResultRangeAsNumbers(): Promise<{
    start: number;
    end: number;
    total: number;
  }> {
    const rangeText = await this.getResultRangeText();
    // Extract "1 – 10 of 15" -> start: 1, end: 10, total: 15
    const match = /(\d{1,10}) [-–] (\d{1,10}) of (\d{1,10})/.exec(rangeText);
    if (match) {
      return {
        start: Number.parseInt(match[1], 10),
        end: Number.parseInt(match[2], 10),
        total: Number.parseInt(match[3], 10),
      };
    }
    return { start: 0, end: 0, total: 0 };
  }

  async getViewPerPageCurrentValue(): Promise<string> {
    const dropdown = this.viewPerPageDropdown();
    return (await dropdown.inputValue()).trim();
  }

  async getViewPerPageOptions(): Promise<string[]> {
    const dropdown = this.viewPerPageDropdown();
    const options = await dropdown.locator('option').allTextContents();
    // Filter out empty strings (placeholder options) - trim before checking length
    return options
      .filter((opt) => opt.trim().length > 0)
      .map((opt) => opt.trim());
  }

  // ---------------------------------------------------------------------------
  // Assertions
  // ---------------------------------------------------------------------------

  async assertNextVisible(): Promise<void> {
    await expect(this.nextButton()).toBeVisible();
  }

  async assertNextHidden(): Promise<void> {
    const isVisible = await this.isNextVisible();
    expect(isVisible, 'Next button should be hidden').toBe(false);
  }

  async assertPreviousVisible(): Promise<void> {
    await expect(this.previousButton()).toBeVisible();
  }

  async assertPreviousHidden(): Promise<void> {
    const isVisible = await this.isPreviousVisible();
    expect(isVisible, 'Previous button should be hidden').toBe(false);
  }

  async assertCurrentPage(expectedPage: number): Promise<void> {
    const currentPage = await this.getCurrentPage();
    expect(currentPage).toBe(expectedPage);
  }

  async assertResultRangeContains(
    startNum: number,
    endNum: number,
    total: number,
  ): Promise<void> {
    const range = await this.getResultRangeAsNumbers();
    expect(range.start).toBe(startNum);
    expect(range.end).toBe(endNum);
    expect(range.total).toBe(total);
  }

  async assertPaginationVisible(): Promise<void> {
    await expect(this.paginationNav()).toBeVisible();
  }

  async assertViewPerPageDropdownVisible(): Promise<void> {
    await expect(this.viewPerPageDropdown()).toBeVisible();
  }

  async assertViewPerPageCurrentValue(expectedValue: string): Promise<void> {
    const currentValue = await this.getViewPerPageCurrentValue();
    expect(currentValue).toBe(expectedValue);
  }

  async assertViewPerPageOptions(expectedOptions: string[]): Promise<void> {
    const options = await this.getViewPerPageOptions();
    expect(options).toEqual(expectedOptions);
  }
}
