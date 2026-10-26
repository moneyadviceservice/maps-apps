import {
  expect as baseExpect,
  test as baseTest,
  TestInfo,
} from '@playwright/test';

import { createDataLayerMatcher } from '../assertions/data-layer';
import * as testMu from '../testmu/testmu-setup';

export * from '@playwright/test';

export interface DefaultPlaywrightFixtures {
  /**
   * Configures the CookieControl consent cookie for the current test context.
   *
   * The fixture requires `baseURL` to be configured for the current Playwright
   * project and uses its hostname as the cookie domain. It sets analytics and
   * marketing cookies to `revoked` while marking the consent interaction as
   * completed for an anonymous user.
   *
   * @throws {Error} If the current Playwright project does not have a `baseURL`
   * configured.
   */
  setCookieControl: () => Promise<void>;
}

/**
 * Adds functionality to set the cookie policy cookie via a single function.
 */
export const test = baseTest.extend<DefaultPlaywrightFixtures>({
  setCookieControl: async ({ page }, provideFixture, testInfo) => {
    const baseURL = testInfo.project.use.baseURL;

    if (!baseURL) {
      throw new Error('baseURL must be configured');
    }

    const { hostname } = new URL(baseURL);

    await provideFixture(async () => {
      /**
       * Since this could be running in TestMu
       * It needs to find the exact page context that's running a test.
       */
      const context = page.context();
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

  /**
   * Provides a Playwright {@link Page} for the test.
   *
   * For projects that do not target TestMu/LambdaTest, the default Playwright page is
   * provided unchanged. TestMu/LambdaTest projects are delegated to the
   * TestMu utility, which selects the appropriate remote connection.
   *
   * After the test completes, the TestMu frontend dashboard is updated with the
   * latest test status. Any page created for TestMu/LambdaTest is closed during
   * fixture teardown.
   */
  page: async ({ page }, provide, testInfo: TestInfo): Promise<void> => {
    return testMu.provideTestMuPage(page, provide, testInfo);
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
