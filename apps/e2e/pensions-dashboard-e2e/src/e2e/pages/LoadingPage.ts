import { Locator, Page } from '@maps/playwright';

import commonHelpers from '../utils/commonHelpers';

type LoadingPage = {
  progressBar: string;
  nojsSpinner: string;
  waitForPensionsToLoad(page: Page): Promise<void>;
  waitForPensionsToLoadJSDisabled(page: Page): Promise<void>;
  getProgressBarColour(page: Page): Locator;
  getLoadingYourPensionsHeader(page: Page): Locator;
  getLoadingBarSubHeader(page: Page): Locator;
  getProgressBarContainer(page: Page): Locator;
  getProgressBarLabel(page: Page): Locator;
  getProgressBar(page: Page): Locator;
  getWarningText(page: Page): Locator;
  getGreenTick(page: Page): Locator;
  getCompletionText(page: Page): Locator;
};

const loadingPage: LoadingPage = {
  progressBar: 'progress',
  nojsSpinner: 'nonjs-spinner',

  async waitForPensionsToLoad(page: Page): Promise<void> {
    await page.getByTestId(this.progressBar).waitFor();
    await page.getByTestId(commonHelpers.backToTopLink).waitFor();
    await page
      .locator(`label.block:text-is("100% complete")`)
      .waitFor({ timeout: 100000 });
  },

  async waitForPensionsToLoadJSDisabled(page: Page): Promise<void> {
    await page.getByTestId(this.nojsSpinner).waitFor({ timeout: 100000 });
  },

  /**
   * Returns a promise already so no need for async.
   * Returns the colour of the progress bar, used for polling in awaits.
   */
  getProgressBarColour(page: Page) {
    return this.getProgressBarLabel(page).evaluate(
      (el) => getComputedStyle(el).color,
    );
  },

  getLoadingYourPensionsHeader(page: Page) {
    return page.getByRole('heading', { name: 'Loading your pensions' });
  },

  getLoadingBarSubHeader(page: Page) {
    return page.getByText(
      /This can take up to \d+ seconds\. Thanks for your patience\./,
    );
  },

  getProgressBarContainer(page: Page) {
    return page.getByTestId(this.progressBar);
  },

  getProgressBarLabel(page: Page) {
    return this.getProgressBarContainer(page).locator('label');
  },

  getProgressBar(page: Page) {
    return this.getProgressBarContainer(page).locator('#progress');
  },

  getWarningText(page: Page) {
    return page.locator(
      '[data-testid="loader"] p.text-base.font-bold.text-center',
    );
  },

  getGreenTick(page: Page) {
    return page.locator('.fill-green-600');
  },

  getCompletionText(page: Page) {
    return page.getByTestId(this.progressBar).getByText('100% complete');
  },
};

export default loadingPage;
