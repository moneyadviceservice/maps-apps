import { expect, type Page } from '@playwright/test';

/**
 * Dismiss the cookie banner when present so it does not block interactions.
 * Supports the MPS cookie banner and the legacy Civic Cookie Control banner.
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
  const acceptButton = page
    .getByTestId('cookie-banner-accept-all')
    .or(page.locator('#ccc-notify-accept'));

  try {
    await acceptButton.waitFor({ state: 'visible', timeout: 3000 });
    await expect(acceptButton).toBeEnabled();
    await acceptButton.scrollIntoViewIfNeeded();
    await acceptButton.click();

    const mpsBanner = page.getByTestId('mps-cookie-banner');
    if ((await mpsBanner.count()) > 0) {
      await expect(mpsBanner).toHaveAttribute('aria-modal', 'false', {
        timeout: 5000,
      });
      return;
    }

    await acceptButton.waitFor({ state: 'hidden', timeout: 5000 });
  } catch {
    // Banner not shown in this environment.
  }
}
