import { directoryPage as directoryPageData } from 'src/data/directoryPage.data';

import { expect, test } from '../lib/test.lib';
import LandingPage from '../pages/landing.page';
import { LearningHubStartPage } from '../pages/start.page';

/**
 * @story 51796 - Migration of Learning Hub Details Page: Evidence Summaries - All summary pages
 */
test.describe('Directory Page - View Document', () => {
  test.beforeEach(async ({ page, directoryPage }) => {
    const lhStartPage = new LearningHubStartPage(page);
    const landingPage = new LandingPage(page);
    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();
    await lhStartPage.clickLearningPathwayHub();
    await directoryPage.waitForPageLoad();
  });

  /**
   * @tests 55675 - 51796 AC1 TEST CASE 1: Learning pathway View document page
   * @tests 55683 - 51796 AC2 TEST CASE 2: Key information on lefthand side
   */
  test('clicking View document navigates correctly', async ({
    directoryPage,
  }) => {
    await expect(directoryPage.getCardViewDocumentLink(0)).toBeVisible();
    await directoryPage.clickViewDocument(0);

    await expect(directoryPage.descriptionHeading).toHaveText(
      directoryPageData.descriptionHeading,
    );
    await expect(directoryPage.keyInfoHeading).toBeVisible();
  });
});
