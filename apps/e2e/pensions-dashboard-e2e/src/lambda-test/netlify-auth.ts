import { type BrowserContext, chromium, type Cookie } from 'playwright';
import { netlifyPasswordPage } from 'src/e2e/pages/NetlifyPasswordPage';
import { ENV } from '@env';
// Looks randomly generated, this may change in the future.
const netlifyCookieName = '1f0bf590-5ad7-40a2-813c-8c2a9334b19d';

export async function fetchNetlifyAuthCookie(
  baseUrl: string,
  password: string,
) {
  if (ENV.IGNORE_NETLIFY_AUTHENTICATION) {
    return;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(baseUrl);

    const passwordField = netlifyPasswordPage.passwordField(page);

    if (await passwordField.isVisible().catch(() => false)) {
      await netlifyPasswordPage.enterPassword(page, password);
      await netlifyPasswordPage.clickSubmit(page);

      const authCookie = await waitForAuthCookie(context);

      if (!authCookie) {
        throw new Error(
          'Netlify password page was shown and submitted, but no auth cookie was found.',
        );
      }

      return {
        name: authCookie.name,
        value: authCookie.value,
      };
    }
    if (
      await page
        .locator('text=Start')
        .isVisible()
        .catch(() => false)
    ) {
      return;
    }
    return;
  } finally {
    await browser.close();
  }
}

/**
 * Waits for a specific cookie to exist and returns it.
 */
async function waitForAuthCookie(
  context: BrowserContext,
  timeout = 10_000,
): Promise<Cookie | null> {
  const pollInterval = 200; // ms
  const maxTime = Date.now() + timeout;

  while (Date.now() < maxTime) {
    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === netlifyCookieName && c.value);
    if (cookie) return cookie;
    await new Promise((res) => setTimeout(res, pollInterval));
  }

  return null;
}
