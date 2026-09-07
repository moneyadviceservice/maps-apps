/**
 * Research library keyword search: matching, empty state, relevance sort, and cross-field tokens.
 */
import { test } from '@lib/test.fixture';

import { researchLibraryCiE2eConstants as C } from '../data/researchLibraryCiE2eConstants.data';

test.describe('Research Library search', () => {
  test('keyword search returns matching document', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goTo();
    await researchLibraryPage.searchByKeyword(C.searchKeyword);
    await researchLibraryPage.assertResultsCount(C.search.keyword.count);
    await researchLibraryPage.assertResultsIncludeTitles(
      C.search.keyword.title,
    );
  });

  test('keyword search with no matches shows empty state', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goTo();
    await researchLibraryPage.searchByKeyword(C.noResultsKeyword);
    await researchLibraryPage.assertNoResults();
  });

  test('keyword search offers relevance sort', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goTo();
    await researchLibraryPage.fillKeyword(C.searchKeyword);
    await researchLibraryPage.searchButton().click();
    await researchLibraryPage.waitForPageLoad('**/en/research-library?**');
    await researchLibraryPage.expectRelevanceSortOptions();
  });

  test('keyword search matches when query words span title and body content', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goTo();
    await researchLibraryPage.searchByKeyword(C.search.crossFieldKeyword);
    await researchLibraryPage.assertResultsCount(
      C.search.crossFieldMatch.count,
    );
    await researchLibraryPage.assertResultsIncludeTitles(
      C.search.crossFieldMatch.title,
    );
  });

  test('keyword search does not match when a query token is absent from content', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goTo();
    await researchLibraryPage.searchByKeyword(
      C.search.crossFieldNoMatchKeyword,
    );
    await researchLibraryPage.assertNoResults();
  });
});
