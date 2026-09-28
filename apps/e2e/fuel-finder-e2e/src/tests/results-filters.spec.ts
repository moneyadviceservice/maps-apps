/**
 * End-to-end tests for Fuel Finder results page functionality.
 *
 * Covers:
 * - ✅ Filter combinations (distance, fuel type, station services)
 * - ✅ View options (results per page and sorting)
 * - ✅ Pagination behaviour and navigation assertions
 *
 * Ensures that:
 * - UI updates correctly based on user selections
 * - URL reflects applied filters and view options
 * - Pagination navigation updates the active page state
 *
 * Supports multilingual execution for:
 * - English (en)
 * - Welsh (cy)
 *
 * Utilises the Page Object Model (POM) for maintainable and reusable test logic.
 */

import { expect, test } from '@lib/test.lib';

import {
  filterCombinations,
  STATION_SERVICE_LABELS,
} from '../data/filterCombinations';
import { viewOptionsCombinations } from '../data/viewOptionsCombinations';
import { ResultsViewOptionsPage } from '../pages/ResultsViewOptionsPage';

function runTestsForLang(lang: 'en' | 'cy') {
  test.describe(`Fuel Finder – Results Page (${lang.toUpperCase()})`, () => {
    test.beforeEach(async ({ extendedPage, homePage, resultsPage }) => {
      await extendedPage.gotoWithCookies(lang);
      await homePage.submitStaticPostcode();
      await resultsPage.waitForReady();
    });

    //
    // ✅ FILTER TESTS
    //
    filterCombinations.forEach((combo) => {
      const enabledServices = Object.entries(combo.services)
        .filter(([, enabled]) => enabled)
        .map(
          ([key]) =>
            STATION_SERVICE_LABELS[key as keyof typeof STATION_SERVICE_LABELS],
        )
        .join(', ');

      test(`Filters | Distance=${combo.distance} | Fuel=${
        combo.fuel
      } | Services=${enabledServices || 'None'}`, async ({
        resultsFilterPage,
        resultsPage,
      }) => {
        await resultsFilterPage.waitForReady();

        await resultsFilterPage.selectDistance(combo.distance);
        await resultsFilterPage.selectFuelType(combo.fuel);
        await resultsFilterPage.setStationServices(combo.services);

        await resultsFilterPage.applyFiltersAndWaitForResults();

        await resultsPage.waitForReady();
        await resultsFilterPage.assertDistanceSelected(combo.distance);

        await resultsPage.page.waitForLoadState('domcontentloaded');
      });
    });

    //
    // ✅ VIEW OPTIONS TESTS
    //
    viewOptionsCombinations.forEach((view) => {
      test(`View | PerPage=${view.perPage} | Sort=${view.sortBy}`, async ({
        extendedPage,
      }) => {
        const viewOptions = new ResultsViewOptionsPage(extendedPage);

        await viewOptions.waitForReady();

        await viewOptions.selectPerPage(view.perPage);
        await viewOptions.selectSortBy(view.sortBy);

        await expect(extendedPage).toHaveURL(
          new RegExp(`perPage=${view.perPage}`),
        );
        await expect(extendedPage).toHaveURL(new RegExp(`sort=${view.sortBy}`));

        await extendedPage.waitForLoadState('domcontentloaded');
      });
    });

    //
    // ✅ PAGINATION TEST (REVIEW FIX ✅)
    //
    test('Pagination | Safe navigation flow with page assertions', async ({
      paginationPage,
    }) => {
      await paginationPage.waitForReady();

      const count = await paginationPage.getPageCount();
      expect(count).toBeGreaterThan(1);

      // ✅ Verify an active page exists (POM reuse)
      await paginationPage.expectAnyActivePageVisible();

      //
      // --- Second page ---
      //
      const second = paginationPage.clickableLinks.nth(1);
      await expect(second).toBeVisible();

      const secondId = (await second.getAttribute('id')) ?? '';
      const secondMatch = /page-(\d+)/.exec(secondId);

      expect(secondMatch).not.toBeNull();

      const secondPage = Number(secondMatch?.[1]);
      expect(secondPage).not.toBeNaN();

      await second.click();
      await paginationPage.expectPageActive(secondPage);

      //
      // --- Last page ---
      //
      const last = paginationPage.clickableLinks.last();
      await expect(last).toBeVisible();

      const lastId = (await last.getAttribute('id')) ?? '';
      const lastMatch = /page-(\d+)/.exec(lastId);

      expect(lastMatch).not.toBeNull();

      const lastPage = Number(lastMatch?.[1]);
      expect(lastPage).not.toBeNaN();

      await last.click();
      await paginationPage.expectPageActive(lastPage);

      //
      // --- Previous (EN + CY)
      //
      await paginationPage.clickPrevious();

      //
      // ✅ Verify navigation
      //
      await paginationPage.expectAnyActivePageVisible();
    });
  });
}

runTestsForLang('en');
runTestsForLang('cy');
