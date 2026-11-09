import { BasePage } from '@pages/Base.page';

export class NextSteps extends BasePage {
  private get nextStepsContainer() {
    return this.page.locator('*:has(> [data-testid="next-steps-heading"])');
  }
  get stepOne() {
    return this.nextStepsContainer.locator('li').first();
  }
  get stepTwo() {
    return this.nextStepsContainer.locator('li').nth(1);
  }
  get stepThree() {
    return this.nextStepsContainer.locator('li').nth(2);
  }
  get note() {
    return this.nextStepsContainer.locator('p').first();
  }
  get shareToolTitle() {
    return this.page.getByTestId('share-tool-title');
  }
}
