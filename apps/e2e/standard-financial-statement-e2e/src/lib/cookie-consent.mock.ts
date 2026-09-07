import type { Page, Route } from '@playwright/test';

/** Blocks Civic cookie-consent API calls so tests are not blocked by the banner. */
export async function mockCookieConsentRoute(page: Page): Promise<void> {
  await page.route('**/c/v**', async (route: Route) => {
    try {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: '',
      });
    } catch {
      await route.continue();
    }
  });
}
