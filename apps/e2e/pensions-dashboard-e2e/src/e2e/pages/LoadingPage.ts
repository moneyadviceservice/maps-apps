import { Page } from '@playwright/test';

type LoadingPage = {
  progressBar: string;
  pageHeading: string;
  nojsSpinner: string;
  header: string;
  introText: string;
  informationCard: string;
  waitForPensionsToLoad(page: Page): Promise<void>;
  waitForPensionsToLoadJSDisabled(page: Page): Promise<void>;
};

const loadingPage: LoadingPage = {
  progressBar: 'progress',
  pageHeading: `h1:text-is("Searching for your pensions")`,
  nojsSpinner: 'nonjs-spinner',
  header: 'h1',
  introText: 'intro-text',
  informationCard: 'information-callout',

  async waitForPensionsToLoad(page: Page): Promise<void> {
    await page.getByTestId(this.progressBar).waitFor();
    await page
      .locator(`label.block:text-is("100% complete")`)
      .waitFor({ timeout: 100000 });
  },

  async waitForPensionsToLoadJSDisabled(page: Page): Promise<void> {
    await page.getByTestId(this.nojsSpinner).waitFor({ timeout: 100000 });
  },
};

export default loadingPage;
