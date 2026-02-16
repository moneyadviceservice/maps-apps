import { type BrowserContext, chromium, type Cookie } from 'playwright';

// Looks randomly generated, this may change in the future.
const netlifyCookieName = '1f0bf590-5ad7-40a2-813c-8c2a9334b19d';

export async function fetchNetlifyAuthCookie(
  baseUrl: string,
  password: string,
) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto(baseUrl);
  await page.locator('input[type="password"]').waitFor();
  await page.locator('input[type="password"]').fill(password);
  await page.locator('.button').click();

  const authCookie = await waitForAuthCookie(context);
  await browser.close();

  return {
    name: netlifyCookieName,
    value: authCookie.value,
  };
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
