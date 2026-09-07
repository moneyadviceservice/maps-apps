import { searchPage as searchPageData } from 'src/data/searchPage.data';

import { LearningHubDirectoryPage } from './directory.page';

export class SearchPage extends LearningHubDirectoryPage {
  async search(keyword: string): Promise<void> {
    await this.searchKeyword(keyword);
  }

  async getResultSlugsInOrder(isMobileView = false): Promise<string[]> {
    const cards = this.resultCards(isMobileView);
    const count = await cards.count();
    const slugs: string[] = [];
    for (let i = 0; i < count; i++) {
      const testId = await cards.nth(i).getAttribute('data-testid');
      if (testId) {
        slugs.push(testId.replace(searchPageData.cardTestIdPrefix, ''));
      }
    }
    return slugs;
  }
}
