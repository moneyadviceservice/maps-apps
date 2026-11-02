import { Page } from '@lib/test.lib';
import { BasePage } from '@pages/base.page';

import { TResourcePageData } from '../../types/common.types';

export class BaseResourcePage extends BasePage {
  constructor(
    protected readonly page: Page,
    public readonly data: TResourcePageData,
  ) {
    super(page);
  }

  get backButton() {
    return this.page.getByTestId('tool-nav-prev');
  }

  get copyTheseDetailsButton() {
    return this.page.getByTestId('copy-to-clipboard-button');
  }

  get signOutButton() {
    return this.page.getByTestId('sign-out-button');
  }

  get makeAnotherReferralButton() {
    return this.page.getByTestId('restart-tool-button');
  }

  async goto() {
    await this.page.goto('/en/' + this.data.endpoint);
  }
}
