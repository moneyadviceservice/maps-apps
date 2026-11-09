import { BasePage } from '@pages/Base.page';

export class Results extends BasePage {
  private get resultsCard() {
    return this.page.locator('#results');
  }
  get monthlyAmount() {
    return this.resultsCard.locator('dd').first();
  }
  get targetDate() {
    return this.resultsCard.locator('dd').nth(1);
  }
  get saveTotal() {
    return this.resultsCard.locator('dd').nth(2);
  }
  get reachGoalText() {
    return this.resultsCard.locator('p').nth(1);
  }
}
