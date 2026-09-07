/**
 * Research library sort: published year descending with title A-Z within each year, and recently uploaded.
 */
import { expect, test } from '@lib/test.fixture';

import { researchLibraryCiE2eConstants as C } from '../data/researchLibraryCiE2eConstants.data';
import {
  groupTitlesByYear,
  sortTitlesAlphabetically,
} from '../utils/sort.util';

test.describe('Research Library sort', () => {
  test('sorts by published year then title A-Z', async ({
    researchLibraryPage,
  }) => {
    await test.step('Load research library results', async () => {
      await researchLibraryPage.goToAllResults();
      await researchLibraryPage.assertResultsCount(C.documentCount);
    });

    await test.step('Assert year descending and title A-Z within each year', async () => {
      const titles = await researchLibraryPage.getResultTitles();
      const years = await researchLibraryPage.getResultPublicationYears();

      expect(titles).toHaveLength(years.length);

      for (let i = 1; i < years.length; i++) {
        expect(years[i]).toBeLessThanOrEqual(years[i - 1]);
      }

      const titlesByYear = groupTitlesByYear(titles, years);

      for (const [year, yearTitles] of titlesByYear) {
        expect(yearTitles).toEqual(sortTitlesAlphabetically(yearTitles));
        expect(yearTitles.length).toBeGreaterThan(0);
        expect(year).toBeGreaterThan(0);
      }

      const titles2022 = titlesByYear.get(2022) ?? [];
      expect(titles2022).toContain(C.sort.year2022.firstTitle);
      expect(titles2022).toContain(C.sort.year2022.lastTitle);
      expect(titles2022.indexOf(C.sort.year2022.lastTitle)).toBeGreaterThan(
        titles2022.indexOf(C.sort.year2022.firstTitle),
      );
    });
  });

  test('sorts by recently uploaded then title A-Z', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goToAllResults();
    await researchLibraryPage
      .sortResultsSelect()
      .selectOption('Recently Uploaded');
    await researchLibraryPage.waitForPageLoad(
      '**/en/research-library?**order=updated**',
    );

    await researchLibraryPage.assertResultsCount(C.documentCount);
    const titles = await researchLibraryPage.getResultTitles();
    expect(titles[0]).toBe(C.sort.year2022.firstTitle);
  });
});
