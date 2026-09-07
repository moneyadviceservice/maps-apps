import { type Page } from '@maps/playwright';

class DidYouUnderstand {
  constructor(private readonly page: Page) {}

  getFeedbackBanner() {
    return this.page.getByTestId('tool-feedback');
  }

  getPageHeading() {
    return this.page.getByRole('heading', {
      level: 1,
      name: 'Understand your pensions',
      exact: true,
    });
  }
}

export default DidYouUnderstand;
