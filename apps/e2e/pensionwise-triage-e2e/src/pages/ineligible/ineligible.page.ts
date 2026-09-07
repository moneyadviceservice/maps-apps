import { BasePage } from 'pages/base.page';
import { IneligiblePageData } from 'types/common.types';
import { ENV } from '@lib/env.lib';
import { Page as PlaywrightPage } from '@lib/test.lib';

type GotoOptions = {
  ignoreCookiesBanner?: boolean;
};

export class IneligibilityPage extends BasePage {
  constructor(
    protected readonly page: PlaywrightPage,
    public readonly data: IneligiblePageData,
  ) {
    super(page);
  }

  static readonly EXPECTED_PAGE_TITLE = 'Get your pension guidance';

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

  get acceptAllCookiesButton() {
    return this.page.locator('#ccc-notify-accept');
  }

  get phoneLink() {
    return this.page.getByRole('link', { name: 'call us at 0800 138 3944' });
  }
}
