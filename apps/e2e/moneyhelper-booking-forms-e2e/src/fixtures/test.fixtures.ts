import { test as base } from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

export * from '@maps-react/utils/e2e/playwright/fixtures/default.fixtures';

interface CustomFixtures {
  cookieControl: void;
}

export const test = base.extend<CustomFixtures>({
  /**
   * Even if you don't import this fixture, it will still run.
   * This ensures the cookie are always set without using it in a test.
   */
  cookieControl: [
    async ({ setCookieControl }, use) => {
      await setCookieControl();
      await use();
    },
    { auto: true },
  ],
});
