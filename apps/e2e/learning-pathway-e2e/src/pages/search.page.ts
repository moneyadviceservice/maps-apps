import { searchPage as searchPageData } from '@data/searchPage.data';

import { LearningHubDirectoryPage } from './directory.page';

export type ResultCardInfo = {
  slug: string;
  title: string;
  dateLaunched: string;
};

export class SearchPage extends LearningHubDirectoryPage {
  async search(keyword: string): Promise<void> {
    await this.searchKeyword(keyword);
  }

  async searchWithLimit(keyword: string, limit: number): Promise<void> {
    await this.search(keyword);
    const url = new URL(this.page.url());
    url.searchParams.set('limit', String(limit));
    await this.page.goto(url.toString());
    await this.waitForPageLoad();
  }

  async getResultSlugsInOrder(isMobileView = false): Promise<string[]> {
    const cards = await this.getResultCardsInfo(isMobileView);
    return cards.map((card) => card.slug);
  }

  async getResultCardsInfo(isMobileView = false): Promise<ResultCardInfo[]> {
    const cards = this.resultCards(isMobileView);
    return cards.evaluateAll(
      (elements, prefix) =>
        elements.map((el) => {
          const testId = (el as HTMLElement).dataset.testid ?? '';
          const heading = el.querySelector('h2, h3, [role="heading"]');

          const dateLabel = Array.from(
            el.querySelectorAll('span.font-bold, div.font-bold'),
          ).find((node) => /Date Launched/i.test(node.textContent ?? ''));
          const dateText = dateLabel?.parentElement?.textContent ?? '';
          const dateMatch = /\d{1,2}\/\d{1,2}\/\d{4}/.exec(dateText);

          return {
            slug: testId.startsWith(prefix)
              ? testId.slice(prefix.length)
              : testId,
            title: (heading?.textContent ?? '').trim(),
            dateLaunched: dateMatch ? dateMatch[0] : '',
          };
        }),
      searchPageData.cardTestIdPrefix,
    );
  }
}
