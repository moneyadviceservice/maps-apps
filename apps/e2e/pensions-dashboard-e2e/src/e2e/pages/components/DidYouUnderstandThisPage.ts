import { type Page } from '@maps/playwright';

class DidYouUnderstand {
  constructor(private readonly page: Page) {}

  get feedbackBanner() {
    return this.page.getByTestId('tool-feedback');
  }

  get pageHeading() {
    return this.page.getByRole('heading', {
      level: 1,
      name: 'Understand your pensions',
      exact: true,
    });
  }
}

export default DidYouUnderstand;
