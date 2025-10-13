import { Page } from '@playwright/test';

type PensionsNotShowingPage = {
  pageHeading: string;
  pageLoads(page: Page): Promise<void>;
};

const pensionsNotShowingPage: PensionsNotShowingPage = {
  pageHeading: `h1:text-is("Pensions not showing")`,

  async pageLoads(page): Promise<void> {
    await page.locator(this.pageHeading).waitFor();
  },
};

export default pensionsNotShowingPage;
