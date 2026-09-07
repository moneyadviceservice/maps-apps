import { stickyNavData, stickyNavPages } from 'src/data/stickyNav.data';

import { expect, test } from '../lib/test.lib';
import LandingPage from '../pages/landing.page';
import { StickyNavComponent } from '../pages/sticky-nav.component';

/**
 * @story 52213 - Debt Quality Site Migration: Create Component for Debt Quality Pages as per the figma (sticky for mobile)
 */
test.describe('Sticky mobile navigation', () => {
  let landingPage: LandingPage;
  let stickyNav: StickyNavComponent;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    stickyNav = new StickyNavComponent(page);
  });

  /**
   * @test 56378 - 52213 AC1 TEST CASE 1 : Javascript on - Sticky component navigation for mobile
   */
  for (const sidebarLink of stickyNavPages) {
    test(`is hidden on load, appears after the first heading, and hides again at the footer — ${sidebarLink}`, async ({
      page,
    }) => {
      await landingPage.navigateToPage(sidebarLink);

      await page.setViewportSize({ width: 375, height: 844 });
      await page.reload({ waitUntil: 'load' });

      await stickyNav.assertHidden();

      await stickyNav.scrollPastStartBoundary();
      await stickyNav.assertVisible();
      await expect(stickyNav.toggle).toHaveText(stickyNavData.toggleLabel);

      await stickyNav.scrollToFooter();
      await stickyNav.assertHidden();
    });
  }

  /**
   * @test 56379 - 52213 AC2 TEST CASE 1 : Javascript off - navigation banner appears at bottom of page
   */
  for (const sidebarLink of stickyNavPages) {
    test(`is never sticky and shows a static side navigation above the footer when JavaScript is disabled — ${sidebarLink}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.setViewportSize({ width: 375, height: 844 });

      try {
        const noScriptLandingPage = new LandingPage(page);
        const noScriptStickyNav = new StickyNavComponent(page);

        await noScriptLandingPage.navigateToPageWithoutCookieConsent(
          sidebarLink,
        );

        await noScriptStickyNav.assertHidden();

        await noScriptStickyNav.scrollToFooter();

        await expect(noScriptStickyNav.container).toBeHidden();
        await noScriptStickyNav.assertSideNavigationFallbackJustAboveFooter();
      } finally {
        await context.close();
      }
    });
  }
});
