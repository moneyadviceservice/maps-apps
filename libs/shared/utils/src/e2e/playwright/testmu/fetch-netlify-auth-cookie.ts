import {
  type BrowserContext,
  chromium,
  type Cookie,
  type Page,
} from 'playwright';

// Looks randomly generated, this may change in the future.
const netlifyCookieName = '1f0bf590-5ad7-40a2-813c-8c2a9334b19d';

function getPasswordField(page: Page) {
  return page.getByRole('textbox', { name: 'Password' });
}

async function enterPassword(page: Page, password: string) {
  const passwordInput = getPasswordField(page);
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(password);
}

async function clickSubmit(page: Page) {
  const submitButton = page.getByRole('button', { name: 'Submit' });
  await submitButton.waitFor({ state: 'visible' });
  await submitButton.click();
}

/**
 * Provided there's a netlify authentication steps (some applications have them, some don't)
 * Launch a browser to authenticate and extract the token.
 * This token then gets used in all tests going forward, to avoid re-authenticating.
 */
export async function fetchNetlifyAuthCookie() {
  if (!process.env.BASE_URL) {
    throw new Error(
      'Environment variable BASE_URL is not set, TestMu needs a BASE_URL environment variable to run',
    );
  }

  if (process.env.IGNORE_NETLIFY_AUTHENTICATION) {
    console.log(
      'Netlify authentication ignored, IGNORE_NETLIFY_AUTHENTICATION flag set to true',
    );
    return;
  }

  if (!process.env.NETLIFY_PASSWORD) {
    throw new Error(
      'Environment variable IGNORE_NETLIFY_AUTHENTICATION is not set, however no NETLIFY_PASSWORD variable was provided.',
    );
  }

  const baseURL = process.env.BASE_URL as string;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(baseURL);

    const passwordField = getPasswordField(page);
    if (await passwordField.isVisible().catch(() => false)) {
      await enterPassword(page, process.env.NETLIFY_PASSWORD);
      await clickSubmit(page);

      const authCookie = await waitForAuthCookie(context);

      if (!authCookie) {
        throw new Error(
          'Netlify password page was shown and submitted, but no auth cookie was found.',
        );
      }

      return {
        name: authCookie.name,
        value: authCookie.value,
        baseURL,
      };
    }
  } finally {
    await browser.close();
  }
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits for a specific cookie to exist and returns it.
 */

async function waitForAuthCookie(
  context: BrowserContext,
  timeout = 10_000,
): Promise<Cookie | null> {
  const pollInterval = 200;
  const deadline = Date.now() + timeout;

  const poll = async (): Promise<Cookie | null> => {
    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === netlifyCookieName && c.value);

    if (cookie || Date.now() >= deadline) {
      return cookie ?? null;
    }

    await delay(pollInterval);
    return poll();
  };

  return poll();
}
