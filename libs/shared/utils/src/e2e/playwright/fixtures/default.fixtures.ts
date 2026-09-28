import { expect as baseExpect, test as baseTest } from '@playwright/test';

import { createDataLayerMatcher } from '../assertions/data-layer';

export * from '@playwright/test';

export interface DefaultPlaywrightFixtures {
  setCookieControl: () => Promise<void>;
}

/**
 * Adds functionality to set the cookie policy cookie via a single function.
 */
export const test = baseTest.extend<DefaultPlaywrightFixtures>({
  setCookieControl: async ({ context }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;

    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);

    await provideFixture(async () => {
      await context.addCookies([
        {
          name: 'CookieControl',
          value: JSON.stringify({
            necessaryCookies: [],
            optionalCookies: {
              analytics: 'revoked',
              marketing: 'revoked',
            },
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
    });
  },
});

/**
 * Adds functionality to assert the windows data layer.
 *
 * @example
 * await expect(page).toHavePartialDataLayerEvent({ event: 'pageLoadReact' })
 */
export const expect = baseExpect.extend({
  toHaveDataLayerEvent: createDataLayerMatcher(false),
  toHavePartialDataLayerEvent: createDataLayerMatcher(true),
});
