import { directoryPage as directoryPageData } from '@data/directoryPage.data';
import { stickyNavData, stickyNavPages } from '@data/stickyNav.data';
import { expect, test } from '@lib/test.lib';
import LandingPage from '@pages/landing.page';
import { StickyNavComponent } from '@pages/sticky-nav.component';
import { contrastRatio, extractShadowColor } from '@utils/color-contrast.util';

const VISUAL_STYLE_PROPERTIES = [
  'color',
  'text-decoration-line',
  'outline-width',
  'outline-style',
  'box-shadow',
  'background-color',
];

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

/**
 * @story 55562 - Sticky navigation: apply different styling for hover and
 * focus states so links meet accessibility requirements (raised from an
 * accessibility review)
 */
test.describe('Sticky navigation link hover and focus states', () => {
  let landingPage: LandingPage;
  let stickyNav: StickyNavComponent;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    stickyNav = new StickyNavComponent(page);

    await landingPage.navigateToPage(directoryPageData.sidebarLink);
    await page.setViewportSize({ width: 375, height: 844 });
    await page.reload({ waitUntil: 'load' });

    await stickyNav.scrollPastStartBoundary();
    await stickyNav.assertVisible();
    await stickyNav.open();
  });

  /**
   * @test 57918 - 55562 AC1 TEST CASE 1: Sticky Hover state
   * @test 58932 - 55561 AC1 TEST CASE 1: Sticky nav panel open/close, and link hover/focus states
   */
  test('a link shows a distinct visual style on hover', async () => {
    await expect(stickyNav.content).toBeVisible();

    await stickyNav.toggle.click();
    await expect(stickyNav.content).toBeHidden();

    await stickyNav.toggle.click();
    await expect(stickyNav.content).toBeVisible();

    const link = stickyNav.links.first();
    await expect(link).toBeVisible();

    const defaultStyles = await stickyNav.getComputedStyles(
      link,
      VISUAL_STYLE_PROPERTIES,
    );

    await link.hover();
    const hoverStyles = await stickyNav.getComputedStyles(
      link,
      VISUAL_STYLE_PROPERTIES,
    );

    expect(hoverStyles['text-decoration-line']).toBe('underline');
    expect(hoverStyles.color).not.toBe(defaultStyles.color);
  });

  /**
   * @test 57919 - 55562 AC1 TEST CASE 2: Hover style does not apply to the current-page item
   */
  test('the current-page item is not an interactive link', async () => {
    const currentPageItem = stickyNav.content.locator('[aria-current="page"]');

    await expect(currentPageItem).toBeVisible();
    await expect(currentPageItem).not.toHaveRole('link');
  });

  /**
   * @test 57926 - 55562 AC2 TEST CASE 1: Sticky Focus state
   */
  test('a link shows a visible style on keyboard focus', async () => {
    const link = stickyNav.links.first();
    await expect(link).toBeVisible();

    const defaultStyles = await stickyNav.getComputedStyles(
      link,
      VISUAL_STYLE_PROPERTIES,
    );

    await link.focus();
    await expect(link).toBeFocused();

    const focusStyles = await stickyNav.getComputedStyles(
      link,
      VISUAL_STYLE_PROPERTIES,
    );

    const hasVisibleFocusIndicator = VISUAL_STYLE_PROPERTIES.some(
      (property) => focusStyles[property] !== defaultStyles[property],
    );
    expect(hasVisibleFocusIndicator).toBe(true);
  });

  /**
   * @test 57927 - 55562 AC2 TEST CASE 2: Focus indicator meets contrast requirements
   */
  test('the focus indicator has at least 3:1 contrast against the panel background', async () => {
    const link = stickyNav.links.first();
    await link.focus();
    await expect(link).toBeFocused();

    const { 'box-shadow': boxShadow } = await stickyNav.getComputedStyles(
      link,
      ['box-shadow'],
    );
    const { 'background-color': panelBackground } =
      await stickyNav.getComputedStyles(stickyNav.panel, ['background-color']);

    const indicatorColor = extractShadowColor(boxShadow);
    const ratio = contrastRatio(indicatorColor, panelBackground);

    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  // /**
  //  * @test 57929 - 55565 AC2 TEST CASE 3: Focus indicator does not appear on mouse click, only on keyboard focus
  //  */
  // test('the focus style does not appear when a link is activated with the mouse', async ({
  //   page,
  // }) => {
  //   const link = stickyNav.links.first();
  //   await expect(link).toHaveAttribute('href', /.+/);
  //   const href = await link.getAttribute('href');
  //   await page.route(`**${href}`, (route) => route.abort());

  //   const defaultStyles = await stickyNav.getComputedStyles(
  //     link,
  //     VISUAL_STYLE_PROPERTIES,
  //   );

  //   await link.click().catch(() => {
  //     // Navigation is aborted above so the click may reject; the resulting
  //     // style is still readable on the (still-attached) element.
  //   });

  //   const isFocusVisible = await link.evaluate((el) =>
  //     el.matches(':focus-visible'),
  //   );
  //   const stylesAfterClick = await stickyNav.getComputedStyles(
  //     link,
  //     VISUAL_STYLE_PROPERTIES,
  //   );

  //   expect(isFocusVisible).toBe(false);
  //   expect(stylesAfterClick).toEqual(defaultStyles);
  // });

  /**
   * @test 57935 - 55565 AC2 TEST CASE 4: Keyboard focus order through the panel is logical and trapped correctly
   */
  test('Tab moves through the toggle and links in order, wraps around, and Escape closes the panel', async ({
    page,
  }) => {
    const linkCount = await stickyNav.links.count();
    expect(linkCount).toBeGreaterThanOrEqual(2);

    await page.keyboard.press('Tab');
    await expect(stickyNav.toggle).toBeFocused();

    for (let i = 0; i < linkCount; i++) {
      await page.keyboard.press('Tab');
      await expect(stickyNav.links.nth(i)).toBeFocused();
    }

    await page.keyboard.press('Tab');
    await expect(stickyNav.toggle).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(stickyNav.links.nth(linkCount - 1)).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(stickyNav.content).toBeHidden();
  });
});
