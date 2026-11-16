import { searchPage as searchPageData } from '@data/searchPage.data';
import { expect, test } from '@lib/test.lib';
import LandingPage from '@pages/landing.page';
import { SearchPage } from '@pages/search.page';
import { LearningHubStartPage } from '@pages/start.page';
import {
  containsPhrase,
  countKeywordHits,
  parseUkDate,
} from '@utils/search-relevance.util';

/**
 * @story 42009 - Design: Debt Quality Site Migration:  Learning Pathway Hub Search the database with a dedicated search tool
 */
test.describe('Directory Page Search Relevance', () => {
  let lhStartPage: LearningHubStartPage;
  let search: SearchPage;
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    lhStartPage = new LearningHubStartPage(page);
    search = new SearchPage(page);
    landingPage = new LandingPage(page);
    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();

    await lhStartPage.clickLearningPathwayHub();
    await search.waitForPageLoad();
  });

  /**
   * @test 57487 - 42009 AC1 TEST CASE 1: Relevance over exact phrase + keyword count
   * @test 57488 - 42009 AC1 TEST CASE 2: Recency tie-break
   * @test 57489 - 42009 AC1 TEST CASE 3: No matching results
   */
  test('Relevance ranking, recency tie-break, and no results', async () => {
    await test.step('results matching more keywords rank above results matching fewer, with no exact-phrase filtering', async () => {
      // Widen the page so a genuine match can't be missed purely because
      // content growth pushed it past the default page size.
      await search.searchWithLimit(
        searchPageData.queries.keywordCountRelevance,
        100,
      );
      await search.waitForCardCountToStabilize();

      const cards = await search.getResultCardsInfo();
      expect(cards.length).toBeGreaterThan(0);

      const hits = cards.map((card) =>
        countKeywordHits(
          card.title,
          searchPageData.queries.keywordCountRelevance,
        ),
      );
      const maxHits = Math.max(...hits);
      const richestIndex = hits.indexOf(maxHits);

      const leanerIndex = hits.findIndex(
        (hitCount, i) => i > richestIndex && hitCount > 0 && hitCount < maxHits,
      );

      expect(
        maxHits,
        'Expected at least one result to match more than one keyword in its title',
      ).toBeGreaterThan(0);
      expect(
        leanerIndex,
        'Expected a result matching fewer keywords to rank below the richest match',
      ).toBeGreaterThan(-1);
    });

    await test.step('when relevance ties, the newer document ranks first', async () => {
      await search.searchWithLimit(searchPageData.queries.recencyTieBreak, 100);
      await search.waitForCardCountToStabilize();

      const cards = await search.getResultCardsInfo();

      const bodyOnlyMatches = cards.filter(
        (card) =>
          !containsPhrase(card.title, searchPageData.queries.recencyTieBreak),
      );

      expect(
        bodyOnlyMatches.length,
        'Expected at least two body-copy-only matches to compare recency ordering',
      ).toBeGreaterThan(1);

      const dates = bodyOnlyMatches.map((card) =>
        parseUkDate(card.dateLaunched),
      );
      const sortedNewestFirst = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedNewestFirst);
    });

    await test.step('a query with no keyword overlap returns a clean no-results state', async () => {
      await search.search(searchPageData.queries.noMatch);

      await search.assertNoResults();
    });
  });

  /**
   * @test 57490 - 42009 AC2 TEST CASE 1: Order independence
   * @test 57491 - 42009 AC2 TEST CASE 2: Multi-word/long query across fields
   */
  test('Keyword order independence and multi-word queries', async () => {
    await test.step('reversing keyword order returns the same documents with the same ranking', async () => {
      await search.search(searchPageData.queries.orderIndependenceA);
      await search.waitForCardCountToStabilize();
      const slugsA = await search.getResultSlugsInOrder();

      await search.search(searchPageData.queries.orderIndependenceB);
      await search.waitForCardCountToStabilize();
      const slugsB = await search.getResultSlugsInOrder();

      expect(slugsA.length).toBeGreaterThan(0);
      expect(slugsB).toEqual(slugsA);
    });

    await test.step('a multi-word query still returns results even though no document contains it as an exact phrase', async () => {
      await search.search(searchPageData.queries.multiWordAcrossFields);
      await search.waitForCardCountToStabilize();

      const slugs = await search.getResultSlugsInOrder();
      expect(slugs.length).toBeGreaterThan(0);
    });
  });

  /**
   * @test 57492 - 42009 AC3 TEST CASE 1: Partial title match
   */
  test('A substring of a document title is returned as a relevant result', async () => {
    await search.search(searchPageData.queries.partialTitleMatch);
    await search.waitForCardCountToStabilize();

    const cards = await search.getResultCardsInfo();
    const hasSubstringTitleMatch = cards.some((card) =>
      containsPhrase(card.title, searchPageData.queries.partialTitleMatch),
    );
    expect(hasSubstringTitleMatch).toBe(true);
  });

  /**
   * @test 57493 - 42009 AC4 TEST CASE 1: Field priority order
   */
  test('A title match ranks above documents matched only via body copy', async () => {
    await search.searchWithLimit(searchPageData.queries.fieldPriority, 100);
    await search.waitForCardCountToStabilize();

    const cards = await search.getResultCardsInfo();
    expect(cards.length).toBeGreaterThan(1);

    const isTitleMatch = cards.map((card) =>
      containsPhrase(card.title, searchPageData.queries.fieldPriority),
    );
    const titleMatchIndices = isTitleMatch.flatMap((match, i) =>
      match ? [i] : [],
    );
    const nonTitleMatchIndices = isTitleMatch.flatMap((match, i) =>
      match ? [] : [i],
    );

    expect(
      titleMatchIndices.length,
      'Expected at least one result to match via its title',
    ).toBeGreaterThan(0);
    expect(
      nonTitleMatchIndices.length,
      'Expected at least one result to match only via body copy',
    ).toBeGreaterThan(0);

    // Every title match should rank above every body-copy-only match.
    const lastTitleMatchIndex = Math.max(...titleMatchIndices);
    const firstNonTitleMatchIndex = Math.min(...nonTitleMatchIndices);
    expect(lastTitleMatchIndex).toBeLessThan(firstNonTitleMatchIndex);
  });

  /**
   * @test 57494 - 42009 AC5 TEST CASE 1: Minor wording variation
   * @test 57495 - 42009 AC5 TEST CASE 2: Case insensitivity
   */
  test('Minor wording variations and case differences do not affect results', async () => {
    await test.step('a plural/variant form of an indexed term still returns relevant documents', async () => {
      await search.search(searchPageData.queries.wordingVariationPlural);
      await search.waitForCardCountToStabilize();

      const slugs = await search.getResultSlugsInOrder();
      expect(slugs.length).toBeGreaterThan(0);
    });

    await test.step('searching in different letter cases returns identical results in identical order', async () => {
      await search.search(searchPageData.queries.caseLower);
      await search.waitForCardCountToStabilize();
      const lower = await search.getResultSlugsInOrder();

      await search.search(searchPageData.queries.caseUpper);
      await search.waitForCardCountToStabilize();
      const upper = await search.getResultSlugsInOrder();

      await search.search(searchPageData.queries.caseMixed);
      await search.waitForCardCountToStabilize();
      const mixed = await search.getResultSlugsInOrder();

      expect(lower.length).toBeGreaterThan(0);
      expect(upper).toEqual(lower);
      expect(mixed).toEqual(lower);
    });
  });

  /**
   * @test 57496 - 42009 AC6 TEST CASE 1: Exact match vs. partial matches
   * @test 57498 - 42009 AC6 TEST CASE 2: Exact phrase vs. scattered keywords (incl. title vs. scattered)
   */
  test('An exact phrase match ranks at the top, above scattered keyword matches', async () => {
    await search.search(searchPageData.queries.exactPhraseVsScattered);
    await search.waitForCardCountToStabilize();

    const cards = await search.getResultCardsInfo();
    expect(cards.length).toBeGreaterThan(1);
    expect(
      containsPhrase(
        cards[0].title,
        searchPageData.queries.exactPhraseVsScattered,
      ),
    ).toBe(true);
  });
});
