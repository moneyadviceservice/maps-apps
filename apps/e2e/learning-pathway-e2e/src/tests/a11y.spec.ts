import { directoryPage as directoryPageData } from 'src/data/directoryPage.data';
import AxeBuilder from '@axe-core/playwright';

import { expect, Page, test } from '../lib/test.lib';
import LandingPage from '../pages/landing.page';
import { StickyNavComponent } from '../pages/sticky-nav.component';
import { A11yUtilities } from '../utils/a11y.lib';

const axe = (page: Page) =>
  /** @ts-expect-error This is caused by a mismatch in types that AxeBuilder and Playwright have */
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .include('[data-testid="sticky-nav-content"]');

/**
 * @story 55562 - Learning Pathway: Sticky Navigation: Links - states of the hover and the focus states
 */
test.describe(
  'Sticky navigation accessibility',
  { tag: ['@nocrossbrowser'] },
  () => {
    test('the opened sticky nav panel has no WCAG 2.1 AA violations', async ({
      page,
    }) => {
      const landingPage = new LandingPage(page);
      const stickyNav = new StickyNavComponent(page);

      await landingPage.navigateToPage(directoryPageData.sidebarLink);
      await page.setViewportSize({ width: 375, height: 844 });
      await page.reload({ waitUntil: 'load' });

      await stickyNav.scrollPastStartBoundary();
      await stickyNav.assertVisible();
      await stickyNav.open();

      const a11yResults = await axe(page).analyze();
      A11yUtilities.createA11yHtmlReport('StickyNav', a11yResults);

      expect(a11yResults.violations).toEqual([]);
    });
  },
);
