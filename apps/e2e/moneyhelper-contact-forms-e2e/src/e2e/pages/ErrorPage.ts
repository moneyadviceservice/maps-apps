import { Cookie, expect, Page } from '@playwright/test';

import { StepName } from '../lib/constants';

/**
 * Helper for error page and fsid cookie assertion in Playwright tests.
 * Waits for error page, checks fsid cookie is unset, and asserts error title is visible.
 * @param page Playwright Page object
 * @param cookies Array of cookies to check for fsid
 * @param param Optional query parameter to check in the URL (e.g. '?status=104')
 */
export async function expectErrorPageAndNoFsid(
  page: Page,
  cookies: Cookie[],
  param = '',
) {
  await page.waitForURL(`/en/${StepName.ERROR}${param}`, { timeout: 20000 });
  cookies = await page.context().cookies();
  const fsidCookie = cookies.find((c) => c.name === 'fsid');
  expect(fsidCookie).toBeUndefined();
  await expect(page.getByTestId('error-title')).toBeVisible();
}
