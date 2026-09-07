import { BasePage } from 'pages/base.page';
import { TransitionalPageData } from 'types/common.types';
import { ENV } from '@lib/env.lib';
import { Page } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class TransitionalPage extends BasePage {
  constructor(
    protected readonly page: Page,
    public readonly data: TransitionalPageData,
  ) {
    super(page);
  }

  static readonly EXPECTED_PAGE_TITLE = 'Get your pension guidance';

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  /**
   * Navigate to the Leave Pot Untouched calculator page.
   *
   * @param endpoint - Optional path suffix to navigate to a specific route under the page.
   * @param options - Navigation options.
   * @param options.ignoreCookiesBanner - If true, skips accepting the cookies banner after navigation.
   */
  async goto(options: GotoOptions = {}) {
    const { ignoreCookiesBanner = !ENV.CI } = options;
    await this.page.goto('/en/' + this.data.endpoint);
    if (!ignoreCookiesBanner) {
      await this.acceptAllCookiesButton.click();
    }
  }

  async continue() {
    await this.page.getByTestId('continue').click();
  }
}
