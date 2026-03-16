import { expect, Page } from '@playwright/test';

/**
 * Helpers: For generic, stateless utilities and assertions that can be called from any test or page, not requiring page object context.
 */

/**
 * Dismiss the cookie banner if it appears, checks for existing cookies to avoid unnecessary interactions.
 * Locate via the id which is language agnostic.
 * @param page Playwright Page object
 */
export async function dismissCookieBanner(page: Page) {
  const cookies = await page.context().cookies();
  if (cookies.length > 0) return;

  const cookieButton = page.locator('#ccc-notify-accept');
  await expect(cookieButton).toBeVisible({ timeout: 10000 });
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
  await expect(heading, 'Error heading should be visible').toBeVisible();

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
