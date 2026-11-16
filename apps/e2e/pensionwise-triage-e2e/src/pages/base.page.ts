import { Page } from '@lib/test.lib';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '') {
    await this.page.goto(path);
  }

  get pageTitle() {
    return this.page.getByTestId('page-title');
  }

  get sectionTitle() {
    return this.page.getByTestId('section-title');
  }

  get phaseBanner() {
    return this.page.getByTestId('phase-banner');
  }

  get feedbackLink() {
    return this.phaseBanner.getByRole('link');
  }
}
