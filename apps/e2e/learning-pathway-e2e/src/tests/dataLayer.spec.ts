import { framework as frameworkData } from '@data/framework.data';
import { updatePage as updatePageData } from '@data/updatePage.data';
import { expect, test } from '@lib/test.lib';
import FrameworkPage from '@pages/framework.page';
import LandingPage from '@pages/landing.page';
import { LearningHubStartPage } from '@pages/start.page';
import UpdatePage from '@pages/update.page';

function resolveSite(url: string): string {
  return /moneyhelper|localhost/.test(url) ? 'moneyhelper' : 'partner';
}

test.describe('Adobe Data Layer - Learning Pathway Hub Introduction', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.startLearningHub();
    await landingPage.acceptAllCookies();
  });

  /**
   * @story 58234 - 57095 - Learning pathway analytics: Integrate shared Analytics component and add pageLoad event into BasePageLayout
   */
  test('pageLoadReact', async ({ page }) => {
    const url = page.url();
    const site = resolveSite(url);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Learning pathway',
        lang: 'en',
        pageName: await landingPage.getPageName(),
        pageTitle: await page.title(),
        pageType: 'Learning pathway',
        site,
        source: 'direct',
        url,
      },
      tool: {
        toolName: 'Learning pathway',
        toolCategory: 'Learning pathway',
        toolStep: 1,
        stepName: 'Learning pathway hub -- Landing Page',
      },
    });
  });

  /**
   * @test 58247 - 57066 - AC1 TEST CASE 1: Learning Pathway Hub Introduction (pageLoadReact)
   * @test 58248 - 57066 - AC2 TEST CASE 1: Learning Pathway Hub Introduction (toolStart)
   */
  test('toolStart', async ({ page }) => {
    const url = page.url();
    const site = resolveSite(url);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      page: {
        categoryL1: 'Learning pathway',
        lang: 'en',
        pageName: await landingPage.getPageName(),
        pageTitle: await page.title(),
        pageType: 'Learning pathway',
        site,
        source: 'direct',
        url,
      },
      tool: {
        toolName: 'Learning pathway',
        toolCategory: 'Learning pathway',
        toolStep: 1,
        stepName: 'Learning pathway hub -- Landing Page',
      },
    });
  });
});

test.describe('Adobe Data Layer - Framework Page', () => {
  let framework: FrameworkPage;

  test.beforeEach(async ({ page }) => {
    framework = new FrameworkPage(page);
    await framework.navigateToPage(frameworkData.sidebarLink);
    await expect(page).toHaveURL(/\/framework(\/|$|\?)/);
    await expect(framework.backToTop).toBeVisible();
  });

  /**
   * @tests 58235 - 57065 - AC1 TEST CASE 1: Framework Page (pageLoadReact)
   */
  test('pageLoadReact', async ({ page }) => {
    const url = page.url();
    const site = resolveSite(url);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Framework',
        lang: 'en',
        pageName: 'Debt advice quality framework ',
        pageTitle: await page.title(),
        pageType: 'Framework',
        site,
        source: 'direct',
        url,
      },
      tool: {
        toolCategory: '',
        toolStep: '',
      },
    });
  });
});

test.describe('Adobe Data Layer - Latest Quality Updates Page', () => {
  let updatePage: UpdatePage;

  test.beforeEach(async ({ page }) => {
    updatePage = new UpdatePage(page);
    await updatePage.navigateToPage(updatePageData.sidebarLink);
    await expect(page).toHaveURL(/\/latest-updates(\/|$|\?)/);
    await expect(updatePage.currentGuidanceHeading).toBeVisible();
  });

  /**
   * @tests 58238 - 57068 - AC1 TEST CASE 1: Latest Quality Updates Page (pageLoadReact)
   */
  test('pageLoadReact', async ({ page }) => {
    const url = page.url();
    const site = resolveSite(url);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Framework',
        pageName: await updatePage.getPageName(),
        pageTitle: await page.title(),
        pageType: 'Framework',
        site,
        source: 'direct',
        url,
      },
      tool: {
        toolCategory: '',
        toolStep: '',
      },
    });
  });
});

test.describe('Adobe Data Layer - Learning Pathway Document Page', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page, directoryPage }) => {
    const lhStartPage = new LearningHubStartPage(page);
    landingPage = new LandingPage(page);

    await lhStartPage.startLearningHub();
    await landingPage.acceptAllCookies();
    await lhStartPage.clickLearningPathwayHub();
    await directoryPage.waitForPageLoad();
    await directoryPage.clickViewDocument(0);
    await expect(directoryPage.descriptionHeading).toBeVisible();
  });

  /**
   * @tests 58305 - 57069 - AC1 TEST CASE 1: Document Page (pageLoadReact)
   */
  test('pageLoadReact', async ({ page }) => {
    const url = page.url();
    const site = resolveSite(url);

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Learning pathway',
        lang: 'en',
        pageName: expect.stringContaining(await landingPage.getPageName()),
        pageTitle: expect.stringContaining(await page.title()),
        pageType: 'Learning pathway',
        site,
        source: 'direct',
        url,
      },
      tool: {
        toolCategory: '',
        toolStep: '',
      },
    });
  });
});
