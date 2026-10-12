import { BasePage } from '@pages/Base.page';

export class TeaserCards extends BasePage {
  async teaserCard(nth: number) {
    return this.page.getByTestId('teaserCard').nth(nth);
  }

  async teaserImage(nth: number) {
    return (await this.teaserCard(nth)).locator('img');
  }

  async teaserTitle(nth: number) {
    return (await this.teaserCard(nth)).locator('div').locator('h3');
  }

  async teaserDescription(nth: number) {
    return (await this.teaserCard(nth)).locator('div').locator('p');
  }
}
