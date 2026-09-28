import { Locator, Page } from '@maps/playwright';

class PensionsNotShowingPage {
  constructor(private readonly page: Page) {}

  private readonly pageHeading = `h1:text-is("Pensions not showing")`;

  async pageLoads(): Promise<void> {
    await this.page.locator(this.pageHeading).waitFor();
  }

  getPageHeading(): Locator {
    return this.page.locator(this.pageHeading);
  }
}

export default PensionsNotShowingPage;
