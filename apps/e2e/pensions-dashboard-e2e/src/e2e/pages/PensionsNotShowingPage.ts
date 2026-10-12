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

  async goToPensionsNotShowingPage(): Promise<void> {
    await this.page.goto('/en/pensions-not-showing');
  }

  getToolIntro(): Locator {
    return this.page.getByTestId('tool-intro');
  }

  getSubheading(): Locator {
    return this.page.locator('h2');
  }

  getListParagraphs(): Locator {
    return this.page.locator('li > p');
  }

  getlinkLocatorExit(): Locator {
    return this.page.getByTestId('pensions-not-showing-logout-link');
  }

  getLogoutModal(): Locator {
    return this.page.getByTestId('pensions-not-showing-logout-link-dialog');
  }
  getLinkLocatorStatePension(): Locator {
    return this.page.locator('li > p > a').nth(0);
  }

  getLinkLocatorUse(): Locator {
    return this.page.locator('li > p > a').nth(1);
  }

  getNotIncludedHeading(): Locator {
    return this.page.getByTestId('not-included-heading');
  }

  getNotIncludedDescription(): Locator {
    return this.page.getByTestId('not-included-description');
  }
  getNotIncludedListItems(): Locator {
    return this.page.getByTestId('not-included-list').locator('li');
  }

  getNotIncludedFooter(): Locator {
    return this.page.getByTestId('not-included-footer');
  }
}
export default PensionsNotShowingPage;
