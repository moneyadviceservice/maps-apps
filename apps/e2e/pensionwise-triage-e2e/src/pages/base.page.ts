import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get pageTitle() {
    return this.page.getByTestId('page-title');
  }

  get sectionTitle() {
    return this.page.getByTestId('section-title');
  }
}
