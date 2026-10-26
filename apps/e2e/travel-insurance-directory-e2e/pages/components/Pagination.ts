import { type Locator, type Page } from '@playwright/test';

import { BasePage } from '../basePage';

type Platform = 'desktop' | 'mobile';

export class Pagination extends BasePage {
  //SELECTORS

  private readonly paginationAriaLabel = 'pagination';
  private readonly previousButtonTestId = 'previous-button';
  private readonly nextButtonTestId = 'next-button';
  private readonly activePageTestId = '-active-page-';
  private readonly inactivePageTestId = '-inactive-page-';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS

  paginationComponent(): Locator {
    return this.page.getByRole('navigation', {
      name: this.paginationAriaLabel,
    });
  }

  previousButton(): Locator {
    return this.page.getByTestId(this.previousButtonTestId);
  }

  nextButton(): Locator {
    return this.page.getByTestId(this.nextButtonTestId);
  }

  activePage(platform: Platform = 'desktop', pageNumber?: number): Locator {
    if (pageNumber === undefined) {
      return this.page.getByTestId(
        new RegExp(`^${platform}${this.activePageTestId}`),
      );
    }

    return this.page.getByTestId(
      `${platform}${this.activePageTestId}${pageNumber}`,
    );
  }

  inactivePage(platform: Platform = 'desktop', pageNumber?: number): Locator {
    if (pageNumber === undefined) {
      return this.page.getByTestId(
        new RegExp(`^${platform}${this.inactivePageTestId}`),
      );
    }

    return this.page.getByTestId(
      `${platform}${this.inactivePageTestId}${pageNumber}`,
    );
  }

  //ACTIONS

  /**
   * Clicks the "Next" button to navigate to the next page.
   * @returns {Promise<void>} A promise that resolves when the click action completes.
   */
  async clickNextButton(): Promise<void> {
    await this.nextButton().click();
  }

  /**
   * Clicks the "Previous" button to navigate to the preceding page.
   * @returns {Promise<void>} A promise that resolves when the click action completes.
   */
  async clickpreviousButton(): Promise<void> {
    await this.previousButton().click();
  }

  /**
   * Clicks the last available inactive page number to jump to the final page.
   * @returns {Promise<void>} A promise that resolves when the click action completes.
   */
  async clickLastPage(): Promise<void> {
    await this.inactivePage().last().click();
  }
}
