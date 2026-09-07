/**
 * Research library filters: publication year, topic, evidence type, country, and combined filters.
 */
import { test } from '@lib/test.fixture';

import { researchLibraryCiE2eConstants as C } from '../data/researchLibraryCiE2eConstants.data';
import { researchLibraryFilters } from '../data/researchLibraryFilters.data';

const { groups, values, year } = researchLibraryFilters;

test.describe('Research Library filters', () => {
  test('filters by publication year via query', async ({
    researchLibraryPage,
  }) => {
    await test.step('Last 5 years', async () => {
      await researchLibraryPage.goToAllResults({ year: year['last-5'] });
      await researchLibraryPage.assertResultsCount(C.filters['last-5'].count);
      await researchLibraryPage.assertResultsIncludeTitles(
        C.filters['last-5'].title,
      );
    });

    await test.step('More than 5 years ago', async () => {
      await researchLibraryPage.goToAllResults({ year: year['more-than-5'] });
      await researchLibraryPage.assertResultsCount(
        C.filters['more-than-5'].count,
      );
      await researchLibraryPage.assertResultsIncludeTitles(
        C.filters['more-than-5'].title,
      );
    });
  });

  test('filters by topic', async ({ researchLibraryPage }) => {
    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.selectFilter(groups.topic, [values.topic.saving]);
    await researchLibraryPage.applyFilters();
    await researchLibraryPage.assertResultsCount(C.filters.topicSaving.count);

    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.selectFilter(groups.topic, [values.topic.debt]);
    await researchLibraryPage.applyFilters();
    await researchLibraryPage.assertResultsCount(C.filters.topicDebt.count);
  });

  test('filters by evidence type and country', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.selectFilter(groups.pageType, [
      values.pageType.evaluation,
    ]);
    await researchLibraryPage.applyFilters();
    await researchLibraryPage.assertResultsCount(
      C.filters.pageTypeEvaluation.count,
    );
    await researchLibraryPage.assertResultsIncludeTitles(
      C.filters.pageTypeEvaluation.title,
    );

    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.selectFilter(groups.countryOfDelivery, [
      values.countryOfDelivery.england,
    ]);
    await researchLibraryPage.applyFilters();
    await researchLibraryPage.assertResultsCount(
      C.filters.countryEngland.count,
    );
    await researchLibraryPage.assertResultsIncludeTitles(
      C.filters.countryEngland.title,
    );
  });

  test('filters by combined evidence type and country', async ({
    researchLibraryPage,
  }) => {
    await researchLibraryPage.goToAllResults();
    await researchLibraryPage.selectFilter(groups.pageType, [
      values.pageType.evaluation,
    ]);
    await researchLibraryPage.selectFilter(groups.countryOfDelivery, [
      values.countryOfDelivery.england,
    ]);
    await researchLibraryPage.applyFilters();
    await researchLibraryPage.assertResultsCount(
      C.filters.combinedEvaluationEngland.count,
    );
    await researchLibraryPage.assertResultsIncludeTitles(
      C.filters.combinedEvaluationEngland.title,
    );
  });
});
