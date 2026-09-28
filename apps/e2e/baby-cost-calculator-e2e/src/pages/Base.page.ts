import { Page } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class BasePage {
  constructor(protected readonly page: Page) {}

  get backButton() {
    return this.page.getByRole('button', { name: 'Back' });
  }

  get pageTitle() {
    return this.page.getByTestId('toolpage-span-title');
  }

  get url() {
    return this.page.url();
  }

  getTabByTitle(str: string) {
    return this.page
      .getByTestId('nav-tab-list')
      .getByRole('tab', { name: str, exact: true });
  }

  async goto(endpoint = '', options: GotoOptions = {}) {
    const { ignoreCookiesBanner = false } = options;
    await this.page.goto(endpoint);
    if (!ignoreCookiesBanner) {
      await this.acceptAllCookiesButton.click();
    }
  }

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  formatNegativeNumber(num: number): string {
    return Math.abs(num).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  get summaryTitle() {
    return this.page.getByTestId('summary-heading');
  }

  get summaryTable() {
    return this.page.locator(
      'div:has(> [data-testid="summary-heading"]) + table',
    );
  }

  get summaryRows() {
    return this.summaryTable.locator('tbody tr');
  }
}
