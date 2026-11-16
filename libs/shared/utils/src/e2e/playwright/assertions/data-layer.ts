import {
  expect as baseExpect,
  type ExpectMatcherState,
  type Page,
} from '@playwright/test';

export * from '@playwright/test';

type DataLayerGenericItem = {
  event: string;
  page?: unknown;
  tool?: unknown;
  eventInfo?: unknown;
};

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
export const createDataLayerMatcher = (isPartial: boolean) => {
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

export async function toHaveNoDataLayerEvent(
  this: ExpectMatcherState,
  page: Page,
  expected: Pick<DataLayerGenericItem, 'event'>,
  options?: { timeout?: number },
) {
  const timeout = options?.timeout ?? 5000;
  const interval = 100;
  let matchingEvents: DataLayerGenericItem[] = [];
  const endTime = Date.now() + timeout;

  do {
    const dataLayer = await getDataLayer(page);
    matchingEvents = dataLayer.filter((item) => item.event === expected.event);

    if (matchingEvents.length > 0) {
      break;
    }

    const remainingTime = endTime - Date.now();
    if (remainingTime > 0) {
      // Ignoring SonarQube here since this is an acceptable pattern in Playwright.
      await page.waitForTimeout(Math.min(interval, remainingTime)); // NOSONAR
    }
  } while (Date.now() < endTime);

  const pass = matchingEvents.length === 0;

  const message = () => {
    const header = `Expected page to have no dataLayer event named ${this.utils.printExpected(
      expected.event,
    )}`;
    const receivedStr = pass
      ? ''
      : `\n\nMatching Data Layer events:\n${this.utils.printReceived(
          matchingEvents,
        )}`;

    return `${header}${receivedStr}`;
  };

  return { pass, message };
}
