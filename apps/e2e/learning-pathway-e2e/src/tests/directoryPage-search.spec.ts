import { searchPage as searchPageData } from 'src/data/searchPage.data';

import { expect, test } from '../lib/test.lib';
import LandingPage from '../pages/landing.page';
import { SearchPage } from '../pages/search.page';
import { LearningHubStartPage } from '../pages/start.page';

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
      await search.search(searchPageData.queries.keywordCountRelevance);
      await search.waitForCardCountToStabilize();

      const slugs = await search.getResultSlugsInOrder();
      expect(slugs.length).toBeGreaterThan(0);

      const moreKeywordsIndex = slugs.indexOf(
        searchPageData.docs.debtServiceSupervisors,
      );
      const fewerKeywordsIndex = slugs.indexOf(
        searchPageData.docs.capDebtAdvisorTraining,
      );
      expect(moreKeywordsIndex).toBeGreaterThanOrEqual(0);
      expect(fewerKeywordsIndex).toBeGreaterThanOrEqual(0);
      expect(moreKeywordsIndex).toBeLessThan(fewerKeywordsIndex);
    });

    await test.step('when relevance ties, the newer document ranks first', async () => {
      await search.search(searchPageData.queries.recencyTieBreak);
      await search.waitForCardCountToStabilize();

      const slugs = await search.getResultSlugsInOrder();
      const newerIndex = slugs.indexOf(
        searchPageData.docs.assessorInductionProgramme,
      );
      const olderIndex = slugs.indexOf(
        searchPageData.docs.helplineInductionProgramme,
      );
      expect(newerIndex).toBeGreaterThanOrEqual(0);
      expect(olderIndex).toBeGreaterThanOrEqual(0);
      expect(newerIndex).toBeLessThan(olderIndex);
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

    const slugs = await search.getResultSlugsInOrder();
    expect(slugs).toContain(searchPageData.docs.assessor);
  });

  /**
   * @test 57493 - 42009 AC4 TEST CASE 1: Field priority order
   */
  test('A title match ranks above documents matched only via body copy', async () => {
    await search.search(searchPageData.queries.fieldPriority);
    await search.waitForCardCountToStabilize();

    const slugs = await search.getResultSlugsInOrder();
    const titleMatchIndex = slugs.indexOf(
      searchPageData.docs.supportAndSupervisionSkills,
    );
    const bodyOnlyMatchIndex = slugs.indexOf(
      searchPageData.docs.debtServicesProgramme,
    );

    expect(titleMatchIndex).toBe(0);
    expect(bodyOnlyMatchIndex).toBeGreaterThan(titleMatchIndex);
    expect(slugs.length).toBeGreaterThan(1);
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

    const slugs = await search.getResultSlugsInOrder();
    expect(slugs[0]).toBe(searchPageData.docs.capDebtAdvisorTraining);
    expect(slugs.length).toBeGreaterThan(1);
  });
});
