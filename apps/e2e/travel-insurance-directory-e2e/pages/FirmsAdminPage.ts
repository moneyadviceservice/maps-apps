import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class FirmsAdminPage extends BasePage {
  //SELECTORS
  private readonly fcaNumberFieldTestId = 'fca-number';
  private readonly firmNameFieldTestId = 'firm-name';
  private readonly principalNameFieldTestId = 'principal-name';
  private readonly firmSearchButtonTestId = 'firms-search-button';
  private readonly firmsTableTestId = 'firms-table';
  private readonly firmsTableRowTestId = 'firms-table-row';
  private readonly noResultsTextTestId = 'no-results-text';
  private readonly resetSearchLinkTestId = 'reset-search-link';
  private readonly firmNameHref = '/admin/firms/tid-e2e-admin-main-';

  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  private fcaNumber(): Locator {
    return this.page.getByTestId(this.fcaNumberFieldTestId);
  }

  private firmName(): Locator {
    return this.page.getByTestId(this.firmNameFieldTestId);
  }

  private principalName(): Locator {
    return this.page.getByTestId(this.principalNameFieldTestId);
  }

  private firmSearchButton(): Locator {
    return this.page.getByTestId(this.firmSearchButtonTestId);
  }

  private firmsTable(): Locator {
    return this.page.getByTestId(this.firmsTableTestId);
  }

  private firmsTableHeader(headerText: string): Locator {
    return this.firmsTable().locator('th', { hasText: headerText });
  }

  private firmsTableRow(): Locator {
    return this.page.getByTestId(this.firmsTableRowTestId);
  }

  private getCell(rowIndex: number, columnIndex: number): Locator {
    return this.firmsTableRow().nth(rowIndex).locator('td').nth(columnIndex);
  }

  private noResultsText(): Locator {
    return this.page.getByTestId(this.noResultsTextTestId);
  }

  private resetSearchLink(): Locator {
    return this.page.getByTestId(this.resetSearchLinkTestId);
  }

  private fcaHeader(): Locator {
    return this.firmsTableHeader('FCA Number');
  }

  private firmNameHeader(): Locator {
    return this.firmsTableHeader('Firm name');
  }

  private principalHeader(): Locator {
    return this.firmsTableHeader('Principal');
  }

  private fcaColumn(): Locator {
    return this.firmsTableRow().locator('td:nth-child(1)');
  }

  private firmNameColumn(): Locator {
    return this.firmsTableRow().locator('td:nth-child(2)');
  }

  private principalColumn(): Locator {
    // Columns: FCA, Firm name, Status, Principal, ...
    return this.firmsTableRow().locator('td:nth-child(4)');
  }

  private firmNameLink(): Locator {
    return this.firmsTableRow()
      .first()
      .locator(`a[href^="${this.firmNameHref}"]`);
  }

  //ACTIONS

  /**
   * Navigates to the admin dashboard page.
   * @returns {Promise<void>}
   */
  async goto(): Promise<void> {
    await this.page.goto('/admin/dashboard');
  }

  /**
   * Fills in the FCA Number search input.
   * @param {number} fcaNumber - The FCA number to input.
   * @returns {Promise<void>}
   */
  async fillFcaNumber(fcaNumber: number): Promise<void> {
    await this.fcaNumber().fill(fcaNumber.toString());
  }

  /**
   * Fills in the Firm Name search input.
   * @param {string} firmName - The name of the firm to input.
   * @returns {Promise<void>}
   */
  async fillFirmName(firmName: string): Promise<void> {
    await this.firmName().fill(firmName);
  }

  /**
   * Fills in the Principal Name search input.
   * @param {string} principalName - The name of the principal to input.
   * @returns {Promise<void>}
   */
  async fillPrincipalName(principalName: string): Promise<void> {
    await this.principalName().fill(principalName);
  }

  /**
   * Clicks the search button to filter firms.
   * @returns {Promise<void>}
   */
  async clickFirmSearchButton(): Promise<void> {
    await this.firmSearchButton().click();
  }

  /**
   * Clicks the reset link to clear current search criteria.
   * @returns {Promise<void>}
   */
  async clickResetSearchLink(): Promise<void> {
    await this.resetSearchLink().click();
  }

  /**
   * Clicks the FCA column header to sort and verifies the applied sort order.
   * @param {'ascending' | 'descending'} expectedSort - The expected sort attribute value.
   * @returns {Promise<void>}
   */
  async clickFcaHeader(
    expectedSort: 'ascending' | 'descending',
  ): Promise<void> {
    await this.fcaHeader().click();
    await expect(this.fcaHeader()).toHaveAttribute(
      'aria-sort',
      `${expectedSort}`,
    );
  }

  /**
   * Clicks the Firm Name column header to sort and verifies the applied sort order.
   * @param {'ascending' | 'descending'} expectedSort - The expected sort attribute value.
   * @returns {Promise<void>}
   */
  async clickFirmNameHeader(
    expectedSort: 'ascending' | 'descending',
  ): Promise<void> {
    await this.firmNameHeader().click();
    await expect(this.firmNameHeader()).toHaveAttribute(
      'aria-sort',
      `${expectedSort}`,
    );
  }

  /**
   * Clicks the Principal column header to sort and verifies the applied sort order.
   * @param {'ascending' | 'descending'} expectedSort - The expected sort attribute value.
   * @returns {Promise<void>}
   */
  async clickPrincipalHeader(
    expectedSort: 'ascending' | 'descending',
  ): Promise<void> {
    await this.principalHeader().click();
    await expect(this.principalHeader()).toHaveAttribute(
      'aria-sort',
      `${expectedSort}`,
    );
  }

  /**
   * Waits for the FCA column data to be visible and extracts all text content.
   * @returns {Promise<string[]>} An array of text contents from the FCA column.
   */
  async getFcaColumnData(): Promise<string[]> {
    await expect(this.fcaColumn().first()).toBeVisible();
    return await this.fcaColumn().allTextContents();
  }

  /**
   * Waits for the Firm Name column data to be visible and extracts all text content.
   * @returns {Promise<string[]>} An array of text contents from the Firm Name column.
   */
  async getFirmNameColumnData(): Promise<string[]> {
    await expect(this.firmNameColumn().first()).toBeVisible();
    return await this.firmNameColumn().allTextContents();
  }

  /**
   * Waits for the Principal column data to be visible and extracts all text content.
   * @returns {Promise<string[]>} An array of text contents from the Principal column.
   */
  async getPrincipalColumnData(): Promise<string[]> {
    await expect(this.principalColumn().first()).toBeVisible();
    return await this.principalColumn().allTextContents();
  }

  /**
   * Clicks the link associated with the firm name.
   * @returns {Promise<void>}
   */
  async clickFirmNameLink(): Promise<void> {
    await this.firmNameLink().click();
  }

  // ASSERTIONS

  /**
   * Asserts that the first result row's FCA cell matches the expected value.
   * @param {number} fcaNumber - The expected FCA number text.
   * @returns {Promise<void>}
   */
  async assertResultFcaNumber(fcaNumber: number): Promise<void> {
    await expect(this.getCell(0, 0)).toHaveText(fcaNumber.toString());
  }

  /**
   * Asserts that the first result row's Firm Name cell matches the expected value.
   * @param {string} firmName - The expected firm name text.
   * @returns {Promise<void>}
   */
  async assertResultFirmName(firmName: string): Promise<void> {
    await expect(this.getCell(0, 1)).toHaveText(firmName);
  }

  /**
   * Asserts that the first result row's Principal Name cell matches the expected value.
   * @param {string} principalName - The expected principal name text.
   * @returns {Promise<void>}
   */
  async assertResultPrincipalName(principalName: string): Promise<void> {
    await expect(this.getCell(0, 3)).toHaveText(principalName);
  }

  /**
   * Asserts that the total number of rows in the firms table matches expectations.
   * @param {number} expectedNumOfResults - The expected row count.
   * @returns {Promise<void>}
   */
  async assertNumberOfResults(expectedNumOfResults: number): Promise<void> {
    await expect(this.firmsTableRow()).toHaveCount(expectedNumOfResults);
  }

  /**
   * Asserts that the 'No Results' text message is displayed on the screen.
   * @returns {Promise<void>}
   */
  async assertNoResultsDisplayed(): Promise<void> {
    await expect(this.noResultsText()).toBeVisible();
  }

  /**
   * Normalizes the whitespace of an array and asserts that its strings are sorted in ascending order.
   * @param {string[]} array - The array of strings to evaluate.
   * @returns {Promise<void>}
   */
  async assertDataSortedAscending(array: string[]): Promise<void> {
    array = array.map((name) => name.replace(/\s+/g, ' '));
    expect.soft(array).toEqual([...array].sort((a, b) => a.localeCompare(b)));
  }

  /**
   * Normalizes the whitespace of an array and asserts that its strings are sorted in descending order.
   * @param {string[]} array - The array of strings to evaluate.
   * @returns {Promise<void>}
   */
  async assertDataSortedDescending(array: string[]): Promise<void> {
    array = array.map((name) => name.replace(/\s+/g, ' '));
    expect.soft(array).toEqual([...array].sort((a, b) => b.localeCompare(a)));
  }
}
