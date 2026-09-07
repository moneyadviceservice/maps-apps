/* eslint-disable no-restricted-imports */
import { App } from 'pages/app.page';
import { DataLayerGenericItem } from 'types/common.types';
import {
  expect as baseExpect,
  ExpectMatcherState,
  Page,
  test as base,
} from '@playwright/test';
export * from '@playwright/test';

interface CustomFixtures {
  app: App;
}

type DataLayerWindow = Window & { adobeDataLayer: DataLayerGenericItem[] };

/**
 * Helper to retrieve the Adobe Data Layer from the browser context
 */
async function getDataLayer(page: Page): Promise<DataLayerGenericItem[]> {
  return await page.evaluate(
    () => (window as unknown as DataLayerWindow).adobeDataLayer || [],
  );
}

/**
 * Custom Matcher Logic Refactor
 */
const createDataLayerMatcher = (isPartial: boolean) => {
  return async function (
    this: ExpectMatcherState,
    page: Page,
    expected: DataLayerGenericItem,
    options?: { timeout?: number; count?: number },
  ) {
    const timeout = options?.timeout ?? 5000;
    const count = options?.count ?? 1;
    let lastDataLayer: DataLayerGenericItem[] = [];

    let pass = false;
    try {
      await baseExpect
        .poll(
          async () => {
            lastDataLayer = await getDataLayer(page);
            const matches = lastDataLayer.filter((event) => {
              try {
                if (isPartial) {
                  baseExpect(event).toMatchObject(expected);
                } else {
                  baseExpect(event).toEqual(expected);
                }
                return true;
              } catch {
                return false;
              }
            });
            return matches.length;
          },
          { timeout },
        )
        .toBe(count);
      pass = true;
    } catch {
      pass = false;
    }

    const message = () => {
      const header = `Expected page ${pass ? 'NOT ' : ''}to have ${
        isPartial ? 'partial ' : ''
      }dataLayer event count: ${count}`;
      const expectedStr = this.utils.printExpected(expected);
      const receivedStr = pass
        ? ''
        : `\n\nReceived Data Layer:\n${this.utils.printReceived(
            lastDataLayer,
          )}`;

      return `${header}\nDetails: ${expectedStr}${receivedStr}`;
    };

    return { pass, message };
  };
};

export const expect = baseExpect.extend({
  toHaveDataLayerEvent: createDataLayerMatcher(false),
  toHavePartialDataLayerEvent: createDataLayerMatcher(true),
});

export const test = base.extend<CustomFixtures>({
  app: async ({ page }, provideFixture) => {
    await provideFixture(new App(page));
  },
});
