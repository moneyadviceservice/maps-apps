import { expect, Page } from '@playwright/test';

export async function verifyDataLayer(
  page: Page,
  eventName: string,
  url: string | undefined,
  expectedValues: Record<string, any>,
): Promise<void> {
  const timeout = 5000;
  const pollInterval = 250;
  const maxAttempts = Math.ceil(timeout / pollInterval);
  let matchingEvents: any[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dataLayer = await page.evaluate(() => {
      return (window as any).adobeDataLayer || [];
    });

    matchingEvents = dataLayer.filter(
      (entry: any) => entry.event === eventName && entry.page?.url === url,
    );
    if (matchingEvents.length > 0) break;
    await page.waitForTimeout(pollInterval);
  }

  if (matchingEvents.length === 0) {
    throw new Error(
      `Event "${eventName}" not found in adobeDataLayer for "${url}" after ${timeout}ms`,
    );
  }

  if (expectedValues.eventInfo) {
    expect(matchingEvents.map((event) => event.eventInfo)).toEqual(
      expect.arrayContaining([expectedValues.eventInfo]),
    );
  }

  if (expectedValues.page) {
    expect(matchingEvents.map((event) => event.page)).toEqual(
      expect.arrayContaining([expectedValues.page]),
    );
  }

  if (expectedValues.tool) {
    expect(matchingEvents.map((event) => event.tool)).toEqual(
      expect.arrayContaining([expectedValues.tool]),
    );
  }
}
