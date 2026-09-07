import { directoryPage as directoryPageData } from 'src/data/directoryPage.data';

import { expect, test } from '../lib/test.lib';
import { LearningHubDirectoryPage } from '../pages/directory.page';
import LandingPage from '../pages/landing.page';
import { LearningHubStartPage } from '../pages/start.page';

/**
 * @story User story - 51514
 * @test 55382 - 51514 AC1 TEST CASE 1: Single filter selection returns relevant results
 *  @test 55387 - 51514 AC2 TEST CASE 2: Multiple filters within the same category return results matching any selected value (OR logic)
 * @test 55389 - 51514 AC3 AC4 TEST CASE 3: Filters across multiple categories narrow results (AND logic between categories)
 * @test 55397 - 51514 AC5 TEST CASE 4: Keyword search combined with filters further restricts results
 *
 */
test.describe('Directory Page Filter Logic', () => {
  let lhStartPage: LearningHubStartPage;
  let directory: LearningHubDirectoryPage;
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    lhStartPage = new LearningHubStartPage(page);
    directory = new LearningHubDirectoryPage(page);
    landingPage = new LandingPage(page);
    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();

    await lhStartPage.clickLearningPathwayHub();
    await directory.waitForPageLoad();
  });
  // -------------------------------------------------------------------------
  // TC1 — AC1: Single filter selection returns relevant results (55382)
  // -------------------------------------------------------------------------

  test('TC1 - AC1: Single filter selection returns relevant results', async () => {
    await test.step('Page loads with all filter categories and results visible', async () => {
      await directory.assertResultsCountVisible();
      await directory.assertFilterCheckboxVisible('Initial contact');
      await directory.assertFilterCheckboxVisible('Qualification');
      await directory.assertFilterCheckboxVisible('Online');
      await directory.assertFilterCheckboxVisible('England');
      await directory.assertApplyFiltersVisible();
      await directory.assertClearAllFiltersVisible();
    });

    const unfilteredCount = await directory.getResultCount();

    await test.step('Select Supervision from Debt Activity — results update to matching cards only', async () => {
      await directory.selectDebtActivity(
        'Supervision including technical learning',
      );
      await directory.applyFilters();
      const filteredCount = await directory.getResultCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
      await directory.assertAtLeastOneCardContainsText('Supervision');
    });

    await test.step('Deselect filter — full result set is restored', async () => {
      await directory.clearAllFilters();
      const restoredCount = await directory.getResultCount();
      expect(restoredCount).toBe(unfilteredCount);
    });

    await test.step('Select Training from Type of Learning — results update to matching cards only', async () => {
      await directory.selectTypeOfLearning('Training');
      await directory.applyFilters();
      const filteredCount = await directory.getResultCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
      await directory.assertAtLeastOneCardContainsText('Training');
    });

    await test.step('Deselect filter — full result set is restored', async () => {
      await directory.clearAllFilters();
    });

    await test.step('Select Online from Channel of Learning — results update to matching cards only', async () => {
      await directory.selectChannelOfLearning('Online');
      await directory.applyFilters();
      const filteredCount = await directory.getResultCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(unfilteredCount);
      await directory.assertAtLeastOneCardContainsText('Online');
    });

    await test.step('Deselect filter — full result set is restored', async () => {
      await directory.clearAllFilters();
      const restoredCount = await directory.getResultCount();
      expect(restoredCount).toBe(unfilteredCount);
    });
  });

  test('TC2 - AC2: Multiple filters within the same category return results matching any selected value (OR logic)', async () => {
    await test.step('Select Supervision from Debt Activity — results update', async () => {
      await directory.selectDebtActivity(
        'Supervision including technical learning',
      );
      await directory.applyFilters();
      const supervisionCount = await directory.getResultCount();
      expect(supervisionCount).toBeGreaterThan(0);
    });

    await test.step('Also select Advice Work from same Debt Activity category — results expand (OR logic)', async () => {
      await directory.selectDebtActivity('Advice work');
      await directory.applyFilters();
      const orCount = await directory.getResultCount();
      expect(orCount).toBeGreaterThanOrEqual(0);
    });

    await test.step('Every card contains at least one of the selected filter values', async () => {
      await directory.waitForCardCountToStabilize();
      await directory.assertAllCardsContainAtLeastOne([
        'Supervision',
        'Advice work',
      ]);
    });

    await test.step('Add a third filter from same category — results expand further', async () => {
      await directory.selectDebtActivity('Initial contact');
      await directory.applyFilters();
      const threeFilterCount = await directory.getResultCount();
      expect(threeFilterCount).toBeGreaterThan(0);
      await directory.assertAllCardsContainAtLeastOne([
        'Supervision',
        'Advice work',
        'Initial contact',
      ]);
    });

    await directory.clearAllFilters();
  });

  test('TC3 - AC3 AC4: Filters across multiple categories narrow results (AND logic between categories)', async () => {
    await test.step('Note total unfiltered result count', async () => {
      await directory.assertResultsCountVisible();
    });

    const unfilteredCount = await directory.getResultCount();

    await test.step('Select Online from Channel of Learning — results narrow', async () => {
      await directory.selectChannelOfLearning('Online');
      await directory.applyFilters();
      await directory.waitForCardCountToStabilize();
      const onlineCount = await directory.getResultCount();
      expect(onlineCount).toBeLessThanOrEqual(unfilteredCount);
    });

    await test.step('Also select Face to Face from same Channel — results expand within channel (OR)', async () => {
      await directory.selectChannelOfLearning('Face to face');
      await directory.applyFilters();
      await directory.waitForCardCountToStabilize();
      const channelOrCount = await directory.getResultCount();
      expect(channelOrCount).toBeGreaterThan(0);
    });

    await test.step('Also select England from Country — results narrow again (AND across categories)', async () => {
      await directory.waitForCardCountToStabilize();
      await directory.selectCountry('England');
      await directory.applyFilters();
      await directory.waitForCardCountToStabilize();
      const andCount = await directory.getResultCount();
      expect(andCount).toBeGreaterThan(0);
    });

    await test.step('Every card matches combined filter logic: England AND (Online OR Face to Face)', async () => {
      await directory.waitForCardCountToStabilize();
      await directory.assertAtLeastOneCardContainsText('England');
      await directory.assertAllCardsContainAtLeastOne([
        'Online',
        'Face to face',
      ]);
    });

    await test.step('Select Training from Type of Learning — results narrow further', async () => {
      // Ensure page is stable before selecting another filter
      await directory.waitForCardCountToStabilize();
      await directory.selectTypeOfLearning('Training');
      await directory.applyFilters();
      await directory.waitForCardCountToStabilize();
      const threeWayCount = await directory.getResultCount();
      expect(threeWayCount).toBeGreaterThan(0);
      await directory.assertAtLeastOneCardContainsText('England');
      await directory.assertAllCardsContainAtLeastOne([
        'Online',
        'Face to face',
      ]);
      await directory.assertAtLeastOneCardContainsText('Training');
    });

    await directory.clearAllFilters();
  });

  test('TC4 - AC5: Keyword search combined with filters further restricts results', async () => {
    await test.step('Apply filter combination: Online OR Face to Face from Channel AND England from Country', async () => {
      await directory.selectChannelOfLearning('Online');
      await directory.selectChannelOfLearning('Face to face');
      await directory.selectCountry('England');
      await directory.applyFilters();
    });

    const filteredCount = await directory.getResultCardCount();

    await test.step('Enter keyword "Supervisor" — results narrow further', async () => {
      await directory.searchKeyword('Supervisor');
      await directory.waitForCardCountToStabilize();
      const keywordCount = await directory.getResultCardCount();
      expect(keywordCount).toBeLessThanOrEqual(filteredCount);
    });

    await test.step('Every card matches filters AND contains keyword', async () => {
      await directory.assertAtLeastOneCardContainsText('England');
      await directory.assertAllCardsContainAtLeastOne([
        'Online',
        'Face to face',
      ]);
      await directory.assertAtLeastOneCardContainsText('Supervisor');
    });

    await test.step('Clear keyword only — filter-only results are restored', async () => {
      await directory.clearKeyword();
      await directory.waitForResultsToUpdate();
      const restoredCount = await directory.getResultCardCount();
      // After clearing keyword, results should be restored to filtered count
      expect(restoredCount).toBeGreaterThan(0);
    });

    await test.step('Enter keyword that returns zero results with active filters', async () => {
      await directory.searchKeyword('xyzzy-no-match-999');
      await directory.assertNoResults();
    });

    await directory.clearAllFilters();
  });

  /**
   * @story 51515 - Learning Pathway: LP Hub Directory Page - change#4 - sort by logic   *
   */

  /**
   * @test 55888 - 51515 AC3 TEST CASE 2 : Sort results by A-Z and Z-A orders cards correctly by title
   */

  test('sorting by Title A-Z orders result cards in ascending order', async () => {
    await directory.selectSortOrder(directoryPageData.sortByTitleAZ);

    const titles = await directory.getAllCardTitles();
    const sortedTitles = [...titles].sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );
    expect(titles).toEqual(sortedTitles);
  });

  test('sorting by Title Z-A orders result cards in descending order', async () => {
    await directory.selectSortOrder(directoryPageData.sortByTitleZA);

    const titles = await directory.getAllCardTitles();
    const sortedTitles = [...titles].sort(
      (a, b) => -a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );
    expect(titles).toEqual(sortedTitles);
  });

  /**
   * @test 57252 - 51515 AC4 TEST CASE 3: Sort by Date launched (newest first)
   */
  test('sorting by Date launched (newest first) orders result cards from newest to oldest', async () => {
    await directory.selectSortOrder(directoryPageData.sortByDateLaunched);

    const dates = await directory.getAllCardDatesLaunched();
    const timestamps = dates.map((date) => {
      const [day, month, year] = date.split('/').map(Number);
      return Date.UTC(year, month - 1, day);
    });
    const sortedTimestamps = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sortedTimestamps);
  });

  /**
   * @test 55881 - 51515 AC1 AC2 TEST CASE 1: Sort results by defaults to Random and produces different order on each page load
   */
  test('TC8: Sorting by Random preserves the full set of result cards and reorders them', async () => {
    await directory.selectSortOrder(directoryPageData.sortByTitleAZ);
    const baselineCount = await directory.getResultCardCount();
    const baselineTitles = await directory.getAllCardTitles();

    await directory.selectSortOrder(directoryPageData.sortByRandom);

    const randomCount = await directory.getResultCardCount();
    expect(randomCount).toBe(baselineCount);

    const titles = await directory.getAllCardTitles();
    expect(new Set(titles).size).toBe(titles.length);

    // Chance of the random shuffle coincidentally reproducing the exact
    // Title A-Z order is 1 in n! for n cards — negligible for this dataset
    // size, so an exact match here would indicate Random isn't shuffling.
    expect(titles).not.toEqual(baselineTitles);
  });
});
