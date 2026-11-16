import { startPage as startPageData } from '@data/startPage.data';
import { expect, test } from '@lib/test.lib';
import { LearningHubStartPage } from '@pages/start.page';

/**
 * @tests User Story 52210
 * @tests 55219 : 52210 AC5 TEST CASE 2: Welsh language option is available and the page renders fully in Welsh
 * 58059 - Currently commented out as we currently don't have Welsh translation
 */
// test.describe('AC5 - Welsh Language Support', () => {
//   let lhStartPage: LearningHubStartPage;
//   let landingPage: LandingPage;

//   test.beforeEach(async ({ page }) => {
//     lhStartPage = new LearningHubStartPage(page);
//     landingPage = new LandingPage(page);
//     await lhStartPage.startLearningHub();
//     await landingPage.acceptAllCookies();
//   });

//   // test('AC5.1: Welsh language option is available', async () => {
//   //   await expect(lhStartPage.welshLanguageLink).toBeVisible();
//   // });

//   test('AC5.2: User can switch to Welsh language', async ({ page }) => {
//     await lhStartPage.switchToWelsh();
//     await expect(page).toHaveURL(/\/cy($|\/)|language=cy/);
//   });

//   test('AC5.3: Page content displays in Welsh', async () => {
//     await lhStartPage.switchToWelsh();

//     // Verify Welsh content is displayed
//     // Replace with actual Welsh text from your app
//     await expect(lhStartPage.titleBanner).not.toContainText(
//       'Debt Advice Quality Framework',
//     );
//     // Verify Welsh text is present (Fframwaith Ansawdd Cyngor ar Ddyled)
//     await expect(lhStartPage.titleBanner).toContainText(
//       'Fframwaith Ansawdd Cyngor ar Ddyled',
//     );
//   });

//   test('AC5.4: User can switch back to English', async ({ page }) => {
//     // Switch to Welsh
//     await lhStartPage.switchToWelsh();
//     // Switch back to English
//     await lhStartPage.switchToEnglish();

//     await expect(page).toHaveURL(/\/en($|\/)|language=en/);
//     await expect(lhStartPage.titleBanner).toContainText(
//       'Debt Advice Quality Framework',
//     );
//   });
// });

test.describe('Error Page', () => {
  let lhStartPage: LearningHubStartPage;

  test.beforeEach(({ page }) => {
    lhStartPage = new LearningHubStartPage(page);
  });

  /**
   * @test 57120 - 55247 - AC1 TEST CASE 1 Error page appears
   * @test 57728 - 56567 - AC1 TEST CASE 1 : Error page has correct wording
   */
  test('shows an error page when navigating to a page that does not exist', async () => {
    await lhStartPage.goToNonExistentPage();

    await expect(lhStartPage.errorPageHeading).toBeVisible();
    await expect(lhStartPage.errorPageWhatYouCanDoHeading).toBeVisible();
    await expect(lhStartPage.errorPageSearchText).toBeVisible();

    await expect(lhStartPage.errorPageHomepageLink).toHaveAttribute(
      'href',
      startPageData.errorPageHomepageLinkHref,
    );
    await expect(lhStartPage.errorPageHubLink).toHaveAttribute(
      'href',
      startPageData.errorPageHubLinkHref,
    );
  });
});
