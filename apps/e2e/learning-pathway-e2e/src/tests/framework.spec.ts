import { framework as frameworkData } from '@data/framework.data';
import { expect, test } from '@lib/test.lib';
import FrameworkPage from '@pages/framework.page';
import LandingPage from '@pages/landing.page';

/**
 * @story 56965 - Learning Pathway: Remove Debt Quality Home Page from AEM and React
 */
test.describe('About the framework page', () => {
  let landingPage: LandingPage;
  let framework: FrameworkPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    framework = new FrameworkPage(page);
  });

  /**
   * @test 57725 - 56965 - AC1 TEST CASE 1 : Page is reachable from sidebar Javascript On
   */
  test('loads successfully via the sidebar link', async ({ page }) => {
    await landingPage.navigateToPage(frameworkData.sidebarLink);

    await expect(page).toHaveURL(/\/framework(\/|$|\?)/);
    await expect(framework.heading).toBeVisible();
    await expect(framework.backToTop).toBeVisible();
  });
});
