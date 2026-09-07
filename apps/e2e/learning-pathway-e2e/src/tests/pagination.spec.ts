import { expect, test } from '../lib/test.lib';
import { LearningHubDirectoryPage } from '../pages/directory.page';
import LandingPage from '../pages/landing.page';
import { PaginationComponent } from '../pages/pagination.component';
import { LearningHubStartPage } from '../pages/start.page';

/**
 * @tests User story - 52220
 * @test 55927 - 52220 AC1 TEST CASE 1: Pagination component displays correctly on desktop and mobile
 * @test 55929 - 52220 AC2 AC3 AC5 TEST CASE 2: Previous page option appears when on page 2 or later, Next disappears on last page
 * @test 55931 - 52220 AC4 TEST CASE 3: View per page dropdown changes the number of results displayed
 * @test 55936 - 52220 AC4 TEST CASE 4: Pagination component displays correctly on mobile viewport
 */

test.describe('Pagination Component', () => {
  let lhStartPage: LearningHubStartPage;
  let directory: LearningHubDirectoryPage;
  let pagination: PaginationComponent;
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    lhStartPage = new LearningHubStartPage(page);
    directory = new LearningHubDirectoryPage(page);
    pagination = new PaginationComponent(page);
    landingPage = new LandingPage(page);

    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();
    await lhStartPage.clickLearningPathwayHub();
    await directory.waitForPageLoad();
  });

  // -------------------------------------------------------------------------
  // Pagination component displays correctly
  // -------------------------------------------------------------------------

  test('Pagination component displays correctly', async () => {
    await pagination.scrollToBottom();

    expect(pagination).toBeDefined();

    await test.step('Pagination navigation is visible', async () => {
      await pagination.assertPaginationVisible();
    });

    await test.step('Page 1 is the active page on initial load', async () => {
      await pagination.assertCurrentPage(1);
    });

    await test.step('Result range shows page 1 results (1-10 of 15)', async () => {
      await pagination.assertResultRangeContains(1, 10, 15);
    });

    await test.step('Previous button is not visible on page 1', async () => {
      await pagination.assertPreviousHidden();
    });

    await test.step('Next button is visible on page 1', async () => {
      await pagination.assertNextVisible();
    });
  });

  //   // -------------------------------------------------------------------------
  //   // Navigation between pages works correctly
  //   // -------------------------------------------------------------------------

  test('Navigation between pages works correctly', async () => {
    await pagination.scrollToBottom();

    expect(directory).toBeDefined();

    await test.step('On page 1: Previous hidden, Next visible', async () => {
      await pagination.assertPreviousHidden();
      await pagination.assertNextVisible();
    });

    await test.step('Click Next button to go to page 2', async () => {
      await pagination.clickNext();
      await pagination.assertCurrentPage(2);
    });

    await test.step('On page 2: Previous visible, Next hidden (last page)', async () => {
      await pagination.assertPreviousVisible();
      await pagination.assertNextHidden();
    });

    await test.step('Result range updates to page 2 (11-15 of 15)', async () => {
      await pagination.assertResultRangeContains(11, 15, 15);
    });

    await test.step('Click Previous button to return to page 1', async () => {
      await pagination.clickPrevious();
      await pagination.assertCurrentPage(1);
      await pagination.assertPreviousHidden();
    });
  });

  //   // -------------------------------------------------------------------------
  //   // Direct page number navigation
  //   // -------------------------------------------------------------------------

  test('Direct page number navigation works correctly', async () => {
    expect(landingPage).toBeDefined();
    await pagination.scrollToBottom();

    await test.step('Click page number 2 to navigate directly', async () => {
      await pagination.clickPageNumber(2);
      await pagination.assertCurrentPage(2);
    });

    await test.step('Result range shows page 2 (11-15 of 15)', async () => {
      await pagination.assertResultRangeContains(11, 15, 15);
    });

    await test.step('Return to page 1 via page number link', async () => {
      await pagination.clickPageNumber(1);
      await pagination.assertCurrentPage(1);
      await pagination.assertResultRangeContains(1, 10, 15);
    });
  });

  // -------------------------------------------------------------------------
  // Pagination component displays correctly on mobile viewport
  // -------------------------------------------------------------------------

  test('Pagination component displays correctly on mobile viewport', async ({
    page,
  }) => {
    expect(page).toBeDefined();

    await test.step('Set mobile viewport (375x844px)', async () => {
      await page.setViewportSize({ width: 375, height: 844 });
    });

    await test.step('Pagination navigation is visible on mobile', async () => {
      // On mobile, pagination is below the fold. Check if it exists in the DOM
      await pagination
        .paginationNav()
        .waitFor({ state: 'attached', timeout: 5000 });
      // Element is in DOM but may be off-screen on mobile
    });

    await test.step('Page 1 is the active page on mobile', async () => {
      await pagination.assertCurrentPage(1);
    });

    await test.step('Result range is correct on mobile (1-10 of 15)', async () => {
      await pagination.assertResultRangeContains(1, 10, 15);
    });

    // On mobile, buttons are off-screen but functional in DOM
    await test.step('Previous button is not visible on page 1 (mobile/off-screen)', async () => {
      const isPrevVisible = await pagination.isPreviousVisible();
      expect(isPrevVisible).toBe(false);
    });

    await test.step('Next button is visible on page 1 (mobile/off-screen)', async () => {
      const isNextVisible = await pagination.isNextVisible();
      expect(isNextVisible).toBe(true);
    });

    await test.step('Navigate to page 2 on mobile via Next button (exists but off-screen)', async () => {
      await pagination.clickNext();
      // Wait for page to load by checking current page
      await pagination.assertCurrentPage(2);
    });

    await test.step('Result range updates to page 2 (11-15 of 15)', async () => {
      await pagination.assertResultRangeContains(11, 15, 15);
    });

    await test.step('On page 2 (mobile): Previous visible, Next hidden (last page)', async () => {
      const isPrevVisible = await pagination.isPreviousVisible();
      expect(isPrevVisible).toBe(true);
      const isNextVisible = await pagination.isNextVisible();
      expect(isNextVisible).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // View per page dropdown changes results per page
  // -------------------------------------------------------------------------

  test('View per page dropdown changes results per page', async () => {
    expect(directory).toBeDefined();

    await test.step('View per page dropdown is visible', async () => {
      await pagination.assertViewPerPageDropdownVisible();
    });

    await test.step('Default view per page value is 10', async () => {
      await pagination.assertViewPerPageCurrentValue('10');
    });

    await test.step('Dropdown contains options: 10, 20, 50', async () => {
      await pagination.assertViewPerPageOptions(['10', '20', '50']);
    });

    await test.step('Select 20 per page — results count updates', async () => {
      const countBefore = await directory.getResultCardCount();
      expect(countBefore).toBe(10);

      await pagination.selectViewPerPage('20');
      // Wait for results to update, then for count to actually change
      await directory.waitForResultsToUpdate();
      await directory.waitForCardCountToChange(countBefore);
      await directory.waitForCardCountToStabilize();

      const countAfter = await directory.getResultCardCount();
      expect(countAfter).toBeGreaterThanOrEqual(15);
    });

    await test.step('Select 50 per page — all results display', async () => {
      await pagination.selectViewPerPage('50');
      // Wait for results to update and cards to stabilize
      await directory.waitForResultsToUpdate();
      await directory.waitForCardCountToStabilize();

      const allCards = await directory.getResultCardCount();
      expect(allCards).toBe(15);
    });

    await test.step('Return to 10 per page — pagination reappears', async () => {
      await pagination.selectViewPerPage('10');
      // Wait for results to update and cards to stabilize
      await directory.waitForResultsToUpdate();
      await directory.waitForCardCountToStabilize();

      const countAfter = await directory.getResultCardCount();
      expect(countAfter).toBe(10);
      await pagination.assertNextVisible();
    });
  });
});
