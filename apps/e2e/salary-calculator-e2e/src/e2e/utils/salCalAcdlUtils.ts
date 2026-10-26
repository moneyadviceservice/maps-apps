import { expect, Page } from '@playwright/test';

type DataLayerEntry = {
  event?: string;
  demo?: Record<string, unknown>;
  page?: Record<string, unknown>;
  tool?: Record<string, unknown>;
  [key: string]: unknown;
};

export async function verifyDatalayer(
  page: Page,
  eventName: string,
  locale: string,
  expectedValues: Record<string, Record<string, unknown>>,
): Promise<void> {
  const timeout = 10000;
  const pollInterval = 250;
  const maxAttempts = Math.ceil(timeout / pollInterval);

  let matchingEvent: DataLayerEntry | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dataLayer = await page.evaluate(() => {
      return (
        (window as unknown as { adobeDataLayer?: DataLayerEntry[] })
          .adobeDataLayer ?? []
      );
    });

    matchingEvent =
      dataLayer.find((entry: DataLayerEntry) => entry.event === eventName) ??
      null;

    if (matchingEvent) break;

    await page.waitForTimeout(pollInterval);
  }

  if (!matchingEvent) {
    throw new Error(
      `Event "${eventName}" not found in adobeDataLayer for locale "${locale}" after ${timeout}ms`,
    );
  }

  // Validate demo (optional)
  if (expectedValues.demo) {
    for (const [key, expected] of Object.entries(expectedValues.demo)) {
      expect(matchingEvent.demo?.[key]).toBe(expected);
    }
  }

  // Validate page
  if (expectedValues.page) {
    for (const [key, expected] of Object.entries(expectedValues.page)) {
      expect(matchingEvent.page?.[key]).toBe(expected);
    }
  }

  // Validate tool
  if (expectedValues.tool) {
    for (const [key, expected] of Object.entries(expectedValues.tool)) {
      expect(matchingEvent.tool?.[key]).toStrictEqual(expected);
    }
  }

  // Validate tool.outcome (optional)
  if (expectedValues.tool?.outcome) {
    const expectedOutcome = expectedValues.tool.outcome as Record<
      string,
      unknown
    >;
    const actualOutcome = matchingEvent.tool?.outcome as Record<
      string,
      unknown
    >;

    for (const [key, expected] of Object.entries(expectedOutcome)) {
      expect(actualOutcome?.[key]).toStrictEqual(expected);
    }
  }
}
