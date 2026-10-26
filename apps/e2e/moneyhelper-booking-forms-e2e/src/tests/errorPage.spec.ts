import { AppErrorCode, StepName } from '@app/lib/constants';
import { expect, test } from '@mhbf-e2e/lib/test.lib';
import { ErrorPage } from '@mhbf-e2e/pages/ErrorPage';

test.describe('Error Page', () => {
  // Direct access to error page
  test('shows error page when navigating directly to error page', async ({
    page,
  }) => {
    const errorPage = new ErrorPage(page);

    await errorPage.gotoErrorPage();

    await expect(errorPage.pageTitle(StepName.ERROR)).toBeVisible();
    expect(await errorPage.getFsidCookie()).toBeUndefined();
  });

  // Unknown route
  test('shows error page for unknown route', async ({ page }) => {
    const errorPage = new ErrorPage(page);

    await page.goto('/en/sdjksdkjds');

    await expect(page).toHaveURL(
      new RegExp(
        `/en/${StepName.ERROR}\\?status=${AppErrorCode.ROUTE_SETUP_FALLBACK}`,
      ),
    );
    await expect(errorPage.pageTitle(StepName.ERROR)).toBeVisible();
    expect(await errorPage.getFsidCookie()).toBeUndefined();
  });
});
