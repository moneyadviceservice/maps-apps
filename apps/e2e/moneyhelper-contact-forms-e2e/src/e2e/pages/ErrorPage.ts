import { expect, Page } from '@playwright/test';

import { COOKIE_NAME, StepName } from '../lib/constants';

/**
 * Helper for error page and fsid cookie assertion in Playwright tests.
 * Waits for error page, checks fsid cookie is unset, and asserts error title is visible.
 * @param page Playwright Page object
 * @param param Optional query parameter to check in the URL (e.g. '?status=104')
 */
export async function expectErrorPageAndNoFsid(page: Page, param = '') {
  await page.waitForURL(`/en/${StepName.ERROR}${param}`, { timeout: 20000 });
  const cookies = await page.context().cookies();
  const fsidCookie = cookies.find((c) => c.name === COOKIE_NAME);
  expect(fsidCookie).toBeUndefined();
  await expect(page.getByTestId('error-title')).toBeVisible();
}
