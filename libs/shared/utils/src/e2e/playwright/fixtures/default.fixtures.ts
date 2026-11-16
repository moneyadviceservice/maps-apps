import {
  expect as baseExpect,
  test as baseTest,
  TestInfo,
} from '@playwright/test';

import {
  createDataLayerMatcher,
  toHaveNoDataLayerEvent,
} from '../assertions/data-layer';
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

export const expect = baseExpect.extend({
  /**
   * Asserts an object exists in the data layer, this is an exact match check.
   *
   * Every key/pair value in the expected object must exist in the data layer.
   *
   * Any missing key/pair values in the data that are NOT in the expected object,
   * will be flagged and it will throw a failure.
   *
   * @see https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/1139998795/Asserting+the+Data+Layer
   *
   * @example
   * await expect(page).toHaveDataLayerEvent({
   *   event: 'toolInteraction',
   *   eventInfo: {
   *     reactCompName: 'How much is your pension currently worth?',
   *     reactCompType: 'MoneyInput',
   *     stepName: 'Estimate',
   *     toolName: 'Adjustable Income Estimator',
   *     toolStep: '1',
   *   },
   * });
   */
  toHaveDataLayerEvent: createDataLayerMatcher(false),
  /**
   * Asserts an object exists in the data layer, this is an partial match check.
   *
   * Only the key/pair value in the expected object must exist in the data layer.
   *
   * Any missing key/pair values in the data that are NOT in the expected object,
   * will be ignored, useful for when there is dynamic and un-relevent data in the object.
   *
   * @see https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/1139998795/Asserting+the+Data+Layer
   *
   * @example
   * await expect(page).toHaveDataLayerEvent({
   *   event: 'toolInteraction',
   *   eventInfo: {
   *     reactCompName: 'How much is your pension currently worth?'
   *   },
   * });
   */
  toHavePartialDataLayerEvent: createDataLayerMatcher(true),
  /**
   * Asserts that no data layer event with the specified event name exists.
   *
   * Only the `event` property is checked; all other event properties are ignored.
   * The data layer is checked repeatedly for 5 seconds by default to allow
   * asynchronously added events to appear. Provide a timeout to change this
   * observation period.
   *
   * @see https://mapswiki.atlassian.net/wiki/spaces/MQE/pages/1139998795/Asserting+the+Data+Layer
   *
   * @example
   * await expect(page).toHaveNoDataLayerEvent({ event: 'errorMessage' });
   * await expect(page).toHaveNoDataLayerEvent(
   *   { event: 'errorMessage' },
   *   { timeout: 1000 },
   * );
   */
  toHaveNoDataLayerEvent,
});
