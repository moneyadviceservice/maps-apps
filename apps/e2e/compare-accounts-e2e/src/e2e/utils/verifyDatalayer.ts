import type { Page } from '@lib/test.lib';
import { expect } from '@lib/test.lib';

type AdobeEvent = {
  event: string;
  page?: Record<string, unknown>;
  tool?: Record<string, unknown>;
  [key: string]: unknown;
};

type AdobeDataLayer = AdobeEvent[];

export async function verifyDatalayer(
  page: Page,
  eventName: string,
  locale: string,
  expectedValues: {
    page: Record<string, unknown>;
    tool: Record<string, unknown>;
  },
) {
  const timeout = 5000;
  const pollInterval = 250;
  const maxAttempts = Math.ceil(timeout / pollInterval);

  let matchingEvent: AdobeEvent | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dataLayer = await page.evaluate<AdobeDataLayer>(() => {
      const w = window as unknown as { adobeDataLayer?: AdobeDataLayer };
      return w.adobeDataLayer ?? [];
    });

    matchingEvent =
      dataLayer.find((entry: AdobeEvent) => entry.event === eventName) ?? null;

    if (matchingEvent) break;

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  if (!matchingEvent) {
    throw new Error(
      `Event "${eventName}" not found in adobeDataLayer for locale "${locale}" after ${timeout}ms`,
    );
  }

  // Validate page fields
  for (const [key, expected] of Object.entries(expectedValues.page)) {
    expect(matchingEvent.page?.[key]).toBe(expected);
  }

  // Validate tool fields
  for (const [key, expected] of Object.entries(expectedValues.tool)) {
    expect(matchingEvent.tool?.[key]).toBe(expected);
  }
}
