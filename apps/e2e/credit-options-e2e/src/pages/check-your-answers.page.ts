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

export class CheckYourAnswersPage extends BasePage {
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
      `/en/change-options?q-1=£${q1}&q-2=${q2}&q-3=${q3}&q-4=${q4}&q-5=${q5}&q-6=${q6}`,
    );
  }

  /**
   * An array of elements which are the customers values chosen in the journey
   */
  private get customersChoicesColumnData() {
    return this.page.locator('form dl dd p:nth-of-type(1)');
  }

  /**
   * An array of elements which are the buttons for changing an answer
   */
  private get changeButtonsColumn() {
    return this.page.locator('form dl dd button:nth-of-type(1)');
  }

  get tableCells() {
    return {
      howMuchToBorrow: this.customersChoicesColumnData.nth(0),
      whatsTheMoneyFor: this.customersChoicesColumnData.nth(1),
      howLongToWait: this.customersChoicesColumnData.nth(2),
      howQuicklyToRepay: this.customersChoicesColumnData.nth(3),
      haveYouBeenRefusedCredit: this.customersChoicesColumnData.nth(4),
      howGoodIsYourCreditScore: this.customersChoicesColumnData.nth(5),
    };
  }

  get changeButtons() {
    return {
      howMuchToBorrow: this.changeButtonsColumn.nth(0),
      whatsTheMoneyFor: this.changeButtonsColumn.nth(1),
      howLongToWait: this.changeButtonsColumn.nth(2),
      howQuicklyToRepay: this.changeButtonsColumn.nth(3),
      haveYouBeenRefusedCredit: this.changeButtonsColumn.nth(4),
      howGoodIsYourCreditScore: this.changeButtonsColumn.nth(5),
    };
  }

  /**
   * Get your action plan
   */
  get submitButton() {
    return this.page.getByTestId('next-page-button');
  }
}
