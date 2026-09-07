import { expect, type Locator } from '@playwright/test';

import { DEFAULT_TIMEOUT } from '../data/constants.data';
import type { FilterGroup } from '../data/researchLibraryFilters.data';
import { BasePage } from './BasePage';

export class ResearchLibraryPage extends BasePage {
  private readonly desktopFormTestId = 'document-list-form-desktop';
  private readonly resultsCalloutTestId = 'information-callout';

  private desktopForm(): Locator {
    return this.page.getByTestId(this.desktopFormTestId);
  }

  searchButton(): Locator {
    return this.desktopForm().getByRole('button', { name: 'Search' });
  }

  applyFiltersButton(): Locator {
    return this.desktopForm().getByRole('button', { name: 'Apply filters' });
  }

  resultsPerPageSelect(): Locator {
    return this.desktopForm().getByLabel('Select items per page');
  }

  sortResultsSelect(): Locator {
    return this.desktopForm().getByLabel('Sort results by');
  }

  /**
   * Navigate to the research library with optional query parameters.
   *
   * @param query - URL query parameters (e.g. filters, limit, keyword).
   */
  async goTo(query?: Record<string, string>): Promise<void> {
    const queryString = query
      ? `?${new URLSearchParams(query).toString()}`
      : '';
    await this.goto(`/en/research-library${queryString}`);
    await this.waitForFiltersReady(DEFAULT_TIMEOUT);
  }

  /**
   * Load all fixture documents on one page (default page size is 10).
   *
   * @param query - Optional filters applied on navigation.
   */
  async goToAllResults(query?: Record<string, string>): Promise<void> {
    await this.goTo({ limit: '50', ...query });
    const isUnfiltered =
      !query || Object.keys(query).every((key) => key === 'limit');
    if (isUnfiltered) {
      await this.waitForPositiveResults();
    }
  }

  /**
   * Fill the keyword search input.
   *
   * @param value - Keyword text to enter.
   */
  async fillKeyword(value: string): Promise<void> {
    const locator = this.desktopForm().locator('input[name="keyword"]');
    await locator.waitFor({ timeout: DEFAULT_TIMEOUT });
    await locator.fill(value);
  }

  async clearKeyword(): Promise<void> {
    const locator = this.desktopForm().locator('input[name="keyword"]');
    await locator.waitFor({ timeout: DEFAULT_TIMEOUT });
    await locator.clear();
  }

  /**
   * Search by keyword and wait for results to load.
   *
   * @param keyword - Search term to submit.
   */
  async searchByKeyword(keyword: string): Promise<void> {
    await this.fillKeyword(keyword);
    await this.searchButton().click();
    await this.waitForPageLoad('**/en/research-library?**');
  }

  private async resolveFilterSection(
    form: Locator,
    group: FilterGroup,
  ): Promise<Locator> {
    const byTestId = form.getByTestId(group.key);
    if ((await byTestId.count()) > 0) {
      return byTestId;
    }

    return form.locator('details').filter({
      has: form
        .getByTestId('summary-block-title')
        .filter({ hasText: group.label }),
    });
  }

  private async findFilterCheckboxLabel(
    form: Locator,
    section: Locator,
    groupKey: string,
    value: string,
  ): Promise<Locator> {
    const byTestId = form.getByTestId(`filter-${groupKey}-${value}`);
    if ((await byTestId.count()) > 0) {
      return byTestId;
    }

    const byInputValue = section.locator(`label:has(input[value="${value}"])`);
    if ((await byInputValue.count()) > 0) {
      return byInputValue.first();
    }

    return section.getByRole('checkbox', { name: value, exact: true });
  }

  async waitForFiltersReady(timeout: number = DEFAULT_TIMEOUT): Promise<void> {
    const form = this.desktopForm();
    await form.waitFor({ state: 'visible', timeout });
    await form.locator('input[name="keyword"]').waitFor({
      state: 'visible',
      timeout,
    });
    await form
      .getByTestId('research-library-results-count')
      .or(form.getByText(/no results have been found/i))
      .waitFor({
        state: 'visible',
        timeout,
      });
  }

  /**
   * SSR can return an empty catalog while the document cache is still building on
   * cold start. Reload until we see results (or time out).
   */
  private async waitForPositiveResults(): Promise<void> {
    await expect(async () => {
      let total = await this.getTotalResultsCount();
      if (!total) {
        await this.page.reload();
        await this.waitForFiltersReady(DEFAULT_TIMEOUT);
        total = await this.getTotalResultsCount();
      }
      expect(total).toBeGreaterThan(0);
    }).toPass({ timeout: DEFAULT_TIMEOUT });
  }

  private async openFilterSection(section: Locator): Promise<void> {
    await section.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
    await section.scrollIntoViewIfNeeded();

    const isOpen = await section.evaluate(
      (el) => (el as HTMLDetailsElement).open,
    );
    if (!isOpen) {
      await section.locator('summary').click();
      await section.locator(':scope[open]').waitFor({
        timeout: DEFAULT_TIMEOUT,
      });
    }
  }

  private async clickFilterValue(
    form: Locator,
    group: FilterGroup,
    value: string,
  ): Promise<void> {
    const section = await this.resolveFilterSection(form, group);
    await this.openFilterSection(section);

    const label = await this.findFilterCheckboxLabel(
      form,
      section,
      group.key,
      value,
    );
    await label.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
    await label.click();
  }

  /**
   * Select one or more filter values within a filter group.
   *
   * @param group - Filter group metadata (key and label).
   * @param values - Tag keys to select within the group.
   */
  async selectFilter(group: FilterGroup, values: string[]): Promise<void> {
    await this.waitForFiltersReady();

    for (const value of values) {
      await expect(async () => {
        const form = this.desktopForm();
        await this.clickFilterValue(form, group, value);
      }).toPass({ timeout: DEFAULT_TIMEOUT });
    }
  }

  async selectYear(yearValue: string): Promise<void> {
    const yearLabels: Record<string, string> = {
      'last-2': 'Last 2 years',
      'last-5': 'Last 5 years',
      'more-than-5': 'More than 5 years ago',
      all: 'All years',
    };

    await this.waitForFiltersReady();
    const yearSection = this.desktopForm().getByTestId('year-of-publication');
    await this.openFilterSection(yearSection);

    const label = yearLabels[yearValue];
    const radio = label
      ? yearSection.getByLabel(label, { exact: true })
      : yearSection.locator(`input[name="year"][value="${yearValue}"]`);

    await radio.click();
  }

  async applyFilters(): Promise<void> {
    await this.applyFiltersButton().click();
    await this.waitForPageLoad('**/en/research-library?**');
  }

  async waitForPageLoad(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url, { timeout: DEFAULT_TIMEOUT });
    await this.waitForFiltersReady(DEFAULT_TIMEOUT);
  }

  /** Assert keyword search exposes relevance sort options. */
  async expectRelevanceSortOptions(): Promise<void> {
    await expect(this.sortResultsSelect()).toMatchAriaSnapshot(`
      - combobox "Sort results by":
        - option "Relevance" [selected]
        - option "Published Date"
        - option "Recently Uploaded"
    `);
  }

  private visibleResults(): Locator {
    return this.page
      .getByTestId(this.resultsCalloutTestId)
      .filter({ has: this.page.locator(':visible') });
  }

  async getVisibleResultsCount(): Promise<number> {
    return this.visibleResults().count();
  }

  /** Total matches from the results heading (not limited to the current page). */
  async getTotalResultsCount(): Promise<number | null> {
    const form = this.desktopForm();

    if (
      await form
        .getByText(/no results have been found/i)
        .isVisible()
        .catch(() => false)
    ) {
      return 0;
    }

    const countLocator = form.getByTestId('research-library-results-count');
    if ((await countLocator.count()) === 0) {
      return null;
    }

    const text = (await countLocator.textContent())?.trim() ?? '';
    const count = Number.parseInt(text, 10);

    return Number.isNaN(count) ? null : count;
  }

  /**
   * Assert the total document count in the results heading.
   *
   * @param count - Expected number of matching documents.
   */
  async assertResultsCount(count: number): Promise<void> {
    await expect(async () => {
      let total = await this.getTotalResultsCount();
      if (count > 0 && total !== count) {
        if (!total) {
          await this.page.reload();
          await this.waitForFiltersReady(DEFAULT_TIMEOUT);
          total = await this.getTotalResultsCount();
        }
      }
      expect(total).toBe(count);
    }).toPass({ timeout: DEFAULT_TIMEOUT });
  }

  async assertVisibleResultsCount(count: number): Promise<void> {
    await expect
      .poll(async () => this.getVisibleResultsCount(), {
        timeout: DEFAULT_TIMEOUT,
      })
      .toBe(count);
  }

  async assertResultsCountAtMost(max: number): Promise<void> {
    await expect
      .poll(async () => this.getVisibleResultsCount(), {
        timeout: DEFAULT_TIMEOUT,
      })
      .toBeLessThanOrEqual(max);
  }

  async assertResultsCountGreaterThan(min: number): Promise<void> {
    await expect
      .poll(async () => this.getVisibleResultsCount(), {
        timeout: DEFAULT_TIMEOUT,
      })
      .toBeGreaterThan(min);
  }

  async assertResultTitles(expectedTitles: string[]): Promise<void> {
    await expect
      .poll(async () => this.getResultTitles(), {
        timeout: DEFAULT_TIMEOUT,
      })
      .toEqual(expectedTitles);
  }

  async assertResultsIncludeTitles(...titles: string[]): Promise<void> {
    await expect
      .poll(async () => this.getResultTitles(), {
        timeout: DEFAULT_TIMEOUT,
      })
      .toEqual(expect.arrayContaining(titles));
  }

  async assertNoResults(): Promise<void> {
    await expect(
      this.desktopForm().getByText(/no results have been found/i),
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await this.assertResultsCount(0);
  }

  async getResultTitles(): Promise<string[]> {
    return this.visibleResults().locator('h3').allTextContents();
  }

  async getResultPublicationYears(): Promise<number[]> {
    const callouts = this.visibleResults();
    const count = await callouts.count();
    const years: number[] = [];

    for (let i = 0; i < count; i++) {
      const yearText = await callouts
        .nth(i)
        .locator('p')
        .filter({ hasText: 'Year of publication' })
        .textContent();
      const yearMatch = /(\d{4})/.exec(yearText ?? '');
      if (yearMatch) {
        years.push(Number(yearMatch[1]));
      }
    }

    return years;
  }

  async assertTitlesSortedAlphabetically(): Promise<void> {
    const titles = await this.getResultTitles();
    const sorted = [...titles].sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );
    expect(titles).toEqual(sorted);
  }
}
