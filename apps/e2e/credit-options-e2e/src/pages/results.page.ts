import { Page } from '@lib/test.lib';

import { BasePage } from './base.page';

/**
 * A bit yucky, but maps directly to the params in the URL.
 */
interface GotoParams {
  borrowAmount: number;
  whatsTheMoneyFor: number;
  howLongCouldYouWait: number;
  howQuicklyCanYouRepay: number;
  haveYouBeenRefusedCredit: number;
  whatsYourCreditScore: number;
}

export class ResultsPage extends BasePage {
  constructor(protected readonly page: Page) {
    super(page);
  }

  /**
   * Navigate directly to the results page.
   */
  async goto({
    borrowAmount: q1,
    whatsTheMoneyFor: q2,
    howLongCouldYouWait: q3,
    howQuicklyCanYouRepay: q4,
    haveYouBeenRefusedCredit: q5,
    whatsYourCreditScore: q6,
  }: GotoParams) {
    await this.page.goto(
      `/en/results?q-1=£${q1}&q-2=${q2}&q-3=${q3}&q-4=${q4}&q-5=${q5}&q-6=${q6}`,
    );
  }

  get startAgainButton() {
    return this.page.getByTestId('start-again-link');
  }

  findHeader(name: string) {
    return this.page.getByRole('heading', { name });
  }

  findParagraph(name: string) {
    return this.page.getByRole('paragraph').getByText(name);
  }
}
