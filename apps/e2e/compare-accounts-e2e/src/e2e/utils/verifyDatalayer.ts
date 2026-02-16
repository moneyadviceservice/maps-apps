import { expect, Page } from '@playwright/test';

export async function verifyDatalayer(
  page: Page,
  eventName: string,
  locale: string,
  expectedValues: Record<string, any>,
) {
  const timeout = 5000;
  const pollInterval = 250;
  const maxAttempts = Math.ceil(timeout / pollInterval);
  let matchingEvent: any = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dataLayer = await page.evaluate(() => {
      return (window as any).adobeDataLayer || [];
    });

    matchingEvent = dataLayer.find((entry: any) => entry.event === eventName);
    if (matchingEvent) break;
  }

  if (!matchingEvent) {
    throw new Error(
      `Event "${eventName}" not found in adobeDataLayer for locale "${locale}" after ${timeout}ms`,
    );
  }

  for (const [key, expected] of Object.entries(expectedValues.page)) {
    expect(matchingEvent.page[key]).toBe(expected);
  }

  for (const [key, expected] of Object.entries(expectedValues.tool)) {
    expect(matchingEvent.tool[key]).toBe(expected);
  }
}
