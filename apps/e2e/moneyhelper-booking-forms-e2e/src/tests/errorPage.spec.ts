/* eslint-disable playwright/expect-expect */
import { Cookie, test } from '@playwright/test';

import { StepName } from '../lib/constants';
import { expectErrorPageAndNoFsid } from '../pages/ErrorPage';

let cookies: Cookie[];

test.describe('Error Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    cookies = await page.context().cookies();
  });

  // Direct access to error page
  test('shows error page when navigating directly to error page', async ({
    page,
  }) => {
    await page.goto(`/en/${StepName.ERROR}`);
    await expectErrorPageAndNoFsid(page, cookies);
  });

  // Unknown route
  test('shows error page for unknown route', async ({ page }) => {
    await page.goto('/en/sdjksdkjds');
    await expectErrorPageAndNoFsid(page, cookies, '?status=902');
  });
});
