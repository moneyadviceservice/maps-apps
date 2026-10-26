import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import type CommonHelpers from '../utils/commonHelpers';

class LoadingPage {
  constructor(private readonly page: Page) {}

  readonly progressBarId = 'progress';
  readonly nojsSpinner = 'nonjs-spinner';

  async waitForPensionsToLoad(
    commonHelpers: CommonHelpers,
    locale: Locale = 'en',
  ): Promise<void> {
    const loadingLabels = {
      en: '100% complete',
      cy: '100% Wedi’i gwblhau',
    };

    await this.page.getByTestId(this.progressBarId).waitFor();
    await this.page.getByTestId(commonHelpers.backToTopLink).waitFor();

    await this.page
      .locator(`label.block:text-is("${loadingLabels[locale]}")`)
      .waitFor({ timeout: 100000 });
  }

  async waitForPensionsToLoadJSDisabled(): Promise<void> {
    await this.page.getByTestId(this.nojsSpinner).waitFor({ timeout: 100000 });
  }

  /**
   * Returns a promise already so no need for async.
   * Returns the colour of the progress bar, used for polling in awaits.
   */
  get progressBarColour() {
    return this.progressBarLabel.evaluate((el) => getComputedStyle(el).color);
  }

  get loadingYourPensionsHeader() {
    return this.page.getByRole('heading', { name: 'Loading your pensions' });
  }

  get loadingBarSubHeader() {
    return this.page.getByText(
      /This can take up to \d+ seconds\. Thanks for your patience\./,
    );
  }

  get progressBarContainer() {
    return this.page.getByTestId(this.progressBarId);
  }

  get progressBarLabel() {
    return this.progressBarContainer.locator('label');
  }

  get progressBar() {
    return this.progressBarContainer.locator('#progress');
  }

  get warningText() {
    return this.page.locator(
      '[data-testid="loader"] p.text-base.font-bold.text-center',
    );
  }

  get greenTick() {
    return this.page.locator('.fill-green-800');
  }

  get completionText() {
    return this.page.getByTestId(this.progressBarId).getByText('100% complete');
  }
}

export default LoadingPage;
