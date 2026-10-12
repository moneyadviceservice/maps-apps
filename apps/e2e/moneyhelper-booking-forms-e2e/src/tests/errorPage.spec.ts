/* eslint-disable playwright/expect-expect */
import { AppErrorCode, StepName } from '@app/lib/constants';

import { Cookie, test } from '../fixtures/test.fixtures';
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
    await expectErrorPageAndNoFsid(
      page,
      cookies,
      `?status=${AppErrorCode.ROUTE_SETUP_FALLBACK}`,
    );
  });
});
