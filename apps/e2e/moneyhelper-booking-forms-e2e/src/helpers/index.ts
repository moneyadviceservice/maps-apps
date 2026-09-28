import { expect, Page } from '@playwright/test';

import { SidebarType } from '../lib/constants';

/**
 * Helpers: For generic, stateless utilities and assertions that can be called from any test or page, not requiring page object context.
 */

/**
 * Dismiss the cookie banner if it appears. Civic is disabled in some apps
 * (`useCivicCookieConsent={false}`), so absence of the banner is OK.
 * Also skip when any cookies are already present (e.g. session `fsid`).
 */
export async function dismissCookieBanner(page: Page) {
  const cookies = await page.context().cookies();
  if (cookies.length > 0) return;

  const cookieButton = page.locator('#ccc-notify-accept');
  const visible = await cookieButton
    .waitFor({ state: 'visible', timeout: 3_000 })
    .then(() => true)
    .catch(() => false);
  if (!visible) return;

  await expect(cookieButton).toBeEnabled();
  await cookieButton.scrollIntoViewIfNeeded();
  await cookieButton.click();
}

/**
 * Assert the presence of the error summary component, used across multiple validation tests to avoid duplication (DRY)
 * @param page Playwright Page object
 */
export async function assertErrorSummary(page: Page) {
  const errorSummary = page.getByTestId('error-summary-container');
  await errorSummary.focus();
  await expect(errorSummary, 'Error summary should be visible').toBeVisible();

  const heading = page.getByTestId('error-summary-heading');
  await expect(heading, 'Error heading should be visible').toHaveText(
    'There was a problem',
  );

  const errorLink = page.getByTestId('error-link-0');
  await expect(errorLink, 'Error link should be visible').toBeVisible();
}

/**
 * Assert the presence of an inline error message for a specific field, used across multiple validation tests to avoid duplication (DRY)
 * @param page Playwright Page object
 * @param value
 */
export async function assertInlineError(page: Page, value: string | RegExp) {
  const error = page.getByTestId(`${value}-error`);
  await expect(error, 'Inline error should be visible').toBeVisible();
}

/** Assert the presence of the sidebar with the correct content based on the type (help or information), used across multiple tests to avoid duplication (DRY)
 * @param page Playwright Page object
 * @param sidebarType Type of sidebar to assert (help or information)
 */
export async function assertSidebar(page: Page, sidebarType: SidebarType) {
  const sidebarLocator = page.getByTestId(`${sidebarType}-sidebar`);
  await expect(
    sidebarLocator,
    `${sidebarType}-sidebar should be visible`,
  ).toBeVisible();
}
