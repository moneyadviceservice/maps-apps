import { expect, test } from '../lib/test.lib';
import { LearningHubDirectoryPage } from '../pages/directory.page';
import LandingPage from '../pages/landing.page';
import { LearningHubStartPage } from '../pages/start.page';

/**
 * @tests User story - 51505
 * @test 55540 - 51505 AC1 TEST CASE 1: Each result card displays the correct information
 * @test 55543 - 51505 AC2 TEST CASE 2: No results state displays correctly when filters return no matches
 */
test.describe('Directory Page - Display All Cards', () => {
  // -------------------------------------------------------------------------
  // TC1 — AC1: Each result card displays the correct information (55540)
  // -------------------------------------------------------------------------

  test('TC1 - AC1: Each result card displays the correct information', async ({
    page,
  }) => {
    const lhStartPage = new LearningHubStartPage(page);
    const directory = new LearningHubDirectoryPage(page);
    const landingPage = new LandingPage(page);
    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();
    await lhStartPage.clickLearningPathwayHub();
    await directory.waitForPageLoad();

    await test.step('Navigate to Learning Hub Directory page', async () => {
      await directory.waitForPageLoad();
      await directory.assertResultsCountVisible();
    });

    await test.step('Get visible result cards count', async () => {
      const cardCount = await directory.getResultCardCount();
      expect(cardCount).toBeGreaterThan(0);
    });

    await test.step('Verify all cards have all required elements', async () => {
      await directory.assertFirstNCardsHaveAllElements(0);
    });

    await test.step('Verify View document links are visible', async () => {
      const cardCount = await directory.getResultCardCount();
      const cardsToCheck = Math.min(cardCount, 2);
      for (let i = 0; i < cardsToCheck; i++) {
        await expect(directory.getCardViewDocumentLink(i)).toBeVisible();
      }
    });

    await test.step('Verify card metadata is present', async () => {
      const cardCount = await directory.getResultCardCount();
      const cardsToCheck = Math.min(cardCount, 2);
      for (let i = 0; i < cardsToCheck; i++) {
        const metadata = await directory.getCardMetadata(i);
        expect(metadata.length).toBeGreaterThan(0);
      }
    });

    await test.step('Verify all card elements are correctly stacked on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 844 });
      await directory.waitForPageLoad(true);
      await directory.assertFirstNCardsHaveAllElements(2, true);
    });
  });

  // -------------------------------------------------------------------------
  // TC2 — AC2: No results state displays correctly (55543)
  // -------------------------------------------------------------------------

  test('TC2 - AC2: No results state displays correctly when filters return no matches', async ({
    page,
  }) => {
    const directory = new LearningHubDirectoryPage(page);
    const landingPage = new LandingPage(page);

    await test.step('Navigate directly to zero-results URL', async () => {
      await directory.navigateToZeroResultsScenario();
      await landingPage.acceptAllCookies();
    });

    await test.step('Observe no result cards are displayed', async () => {
      const cardCount = await directory.getResultCardCount();
      expect(cardCount).toBe(0);
    });

    await test.step('Observe no results message is displayed', async () => {
      await directory.assertNoResultsMessage();
    });

    await test.step('Observe filters panel still shows active filters', async () => {
      await directory.assertFilterCheckboxVisible('Initial contact');
      await directory.assertFilterCheckboxVisible(
        'Supervision including technical learning',
      );
      await directory.assertFilterCheckboxVisible('Qualification');
      await directory.assertFilterCheckboxVisible('Online');
    });

    await test.step('Click Clear all filters', async () => {
      await directory.clearAllFilters();
      // Wait for cards to populate after clearing filters
      await directory.waitForCardCountToStabilize();
    });

    await test.step('Verify filters are cleared and full result set is restored', async () => {
      const cardCount = await directory.getResultCardCount();
      expect(cardCount).toBeGreaterThan(0);
      await directory.assertResultsCountVisible();
    });
  });
});
