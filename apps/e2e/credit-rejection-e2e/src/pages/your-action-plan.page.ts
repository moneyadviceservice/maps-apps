import { Locator, Page } from '@lib/test.lib';

export class YourActionPlanPage {
  constructor(private readonly page: Page) {}

  get header() {
    return this.page.locator('main h1');
  }

  get expandableSections() {
    return this.page.getByTestId('expandable-section');
  }

  get startAgainButton() {
    return this.page.getByTestId('start-again-link');
  }

  getSectionBody(section: Locator) {
    return section.locator('summary + div');
  }

  getSectionTitleByName(title: string) {
    return this.expandableSections.filter({
      hasText: title,
    });
  }
}
