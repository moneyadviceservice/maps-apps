import { Page } from '@playwright/test';

type PensionsNotShowingPage = {
  pageHeading: string;
  headingCheckStatePension: string;
  pageLoads(page: Page): Promise<void>;
};

const pensionsNotShowingPage: PensionsNotShowingPage = {
  pageHeading: `h1:text-is("Pensions not showing")`,

  headingCheckStatePension: '    Check your State Pension forecast',

  async pageLoads(page): Promise<void> {
    await page.locator(this.pageHeading).waitFor();
  },
};

export default pensionsNotShowingPage;
