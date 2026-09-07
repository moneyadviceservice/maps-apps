import { type Page } from 'lib/test.lib';

const TOO_MANY_CELLS_ERROR =
  'Looks like there are too many columns in the results table.';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class CalculatorPage {
  constructor(private readonly page: Page) {}

  /**
   * Navigate to the Leave Pot Untouched calculator page.
   *
   * @param endpoint - Optional path suffix to navigate to a specific route under the page.
   * @param options - Navigation options.
   * @param options.ignoreCookiesBanner - If true, skips accepting the cookies banner after navigation.
   */
  async goto(endpoint = '', options: GotoOptions = {}) {
    const { ignoreCookiesBanner = false } = options;
    await this.page.goto('/en/leave-pot-untouched' + endpoint);
    if (!ignoreCookiesBanner) {
      // Civic cookie banner is injected via GTM and may not appear in e2e.
      const accept = this.acceptAllCookiesButton;
      if (await accept.isVisible({ timeout: 3000 }).catch(() => false)) {
        await accept.click();
      }
    }
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  get potField() {
    return this.page.locator('input#pot');
  }

  get monthlyField() {
    return this.page.locator('input#month');
  }

  get updateField() {
    return this.page.locator('input#updateMonth');
  }

  get submitButton() {
    return this.page.locator('button#submit');
  }

  get errorHeader() {
    return this.page.getByRole('heading', {
      name: 'Unable to submit the form',
    });
  }

  get errorHeaderMessage() {
    return this.page.getByTestId('error-link-0');
  }

  get errorHeaderLink() {
    return this.page.getByRole('link', {
      name: 'How much is your pension currently worth? - Enter a figure',
    });
  }

  /**
   * Retrieves data from the results table.
   * Extracts the innerText value from the second cell of each row.
   * @returns Promise that resolves to an array of strings containing table cell values
   * @example
   * const data = await calculatorPage.resultsTableData;
   * console.log(data); // ['100', '200', '300']
   * @throws Error if a table row does not contain exactly 2 cells
   */
  get resultsTableData(): Promise<string[]> {
    // 1. Find the locator
    const rows = this.page.locator('#results > table > tbody > tr');

    return rows
      .first()
      .waitFor() // Wait for at least one row to exist
      .then(() =>
        rows.evaluateAll((rows) => {
          const data: string[] = [];
          rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length !== 2) {
              throw new Error(TOO_MANY_CELLS_ERROR);
            }
            const value = cells[1].innerText.trim();
            data.push(value);
          });
          return data;
        }),
      );
  }
}
