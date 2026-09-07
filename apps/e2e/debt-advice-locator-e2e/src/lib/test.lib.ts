import { DebtAdviceLocatorPage } from '@pages/debt-advice-locator.page';
import {
  BrowserContext,
  expect as baseExpect,
  ExpectMatcherState,
  Page,
  test as base,
} from '@playwright/test';

export * from '@playwright/test';

interface CustomFixtures {
  debtAdviceLocatorPage: DebtAdviceLocatorPage;
  setCookieControl: () => Promise<void>;
}

async function setCookieControl(context: BrowserContext, hostname: string) {
  await context.addCookies([
    {
      name: 'CookieControl',
      value: JSON.stringify({
        necessaryCookies: [],
        optionalCookies: { analytics: 'revoked', marketing: 'revoked' },
        statement: {},
        consentDate: 0,
        consentExpiry: 0,
        interactedWith: true,
        user: 'anonymous',
      }),
      domain: hostname,
      path: '/',
    },
  ]);
}

async function getDataLayer(page: Page): Promise<unknown[]> {
  return page.evaluate(
    () =>
      (window as unknown as { adobeDataLayer?: unknown[] }).adobeDataLayer ||
      [],
  );
}

const toHavePartialDataLayerEvent = async function (
  this: ExpectMatcherState,
  page: Page,
  expected: Record<string, unknown>,
) {
  let received: unknown[] = [];
  let pass = false;

  try {
    await baseExpect
      .poll(async () => {
        received = await getDataLayer(page);
        return received.some((event) => {
          try {
            baseExpect(event).toMatchObject(expected);
            return true;
          } catch {
            return false;
          }
        });
      })
      .toBe(true);
    pass = true;
  } catch {
    pass = false;
  }

  return {
    pass,
    message: () =>
      `Expected the Adobe Data Layer to contain ${this.utils.printExpected(
        expected,
      )}, received ${this.utils.printReceived(received)}`,
  };
};

export const expect = baseExpect.extend({
  toHavePartialDataLayerEvent,
});

export const test = base.extend<CustomFixtures>({
  debtAdviceLocatorPage: async ({ page }, provideFixture) => {
    await provideFixture(new DebtAdviceLocatorPage(page));
  },
  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;
    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);
    await provideFixture(() => setCookieControl(context, hostname));
  },
});
