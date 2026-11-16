import { expect, Page } from '@maps/playwright';

export type PageDetails = {
  event: string;
  categoryL1: string;
  categoryL2: string;
  lang: string;
  pageName: string;
  pageTitle: string;
  pageType: string;
  site: string;
  source: string;
  url: string;
  timeToGetResults: number;
  totalPensions: number;
  totalConfirmedPensions: number;
  totalIncompletePensions: number;
  totalUnsupportedPensions: number;
  confirmedPensions: any;
  unconfirmedPensions: any;
  unsupportedPensions: any;
};

export type PageLoadReactEvent = {
  event: string;
  page: {
    categoryL1: string;
    categoryL2: string;
    lang: string;
    pageName: string;
    pageTitle: string;
    pageType: string;
    site: string;
    source: string;
    url: string;
  };
  searchResults?: {
    timeToGetResults?: number;
    totalPensions?: number;
    totalConfirmedPensions?: number;
    totalIncompletePensions?: number;
    totalUnsupportedPensions?: number;
    confirmedPensions?: any;
    unconfirmedPensions?: any;
    unsupportedPensions?: any;
  };
};

export const setupAnalyticsCapture = async (page: Page) => {
  const capturedEvents: any[] = [];

  await page.exposeFunction('captureACDLEvent', (event: any) => {
    if (event.event === 'pageLoadReact') {
      capturedEvents.push(event);
    }
  });

  await page.addInitScript(() => {
    (window as any).adobeDataLayer = (window as any).adobeDataLayer || [];

    const originalPush = (window as any).adobeDataLayer.push;

    (window as any).adobeDataLayer.push = function (...args: any[]) {
      const event = args[0];
      if (typeof event === 'object' && event.event === 'pageLoadReact') {
        (window as any).captureACDLEvent(event);
      }
      return originalPush.apply((window as any).adobeDataLayer, args);
    };

    (window as any).adobeDataLayer.forEach((event: any) => {
      if (typeof event === 'object' && event.event === 'pageLoadReact') {
        (window as any).captureACDLEvent(event);
      }
    });
  });

  return capturedEvents;
};

/**
 * Install a robust hook to capture the first pageLoadReact event.
 * Call this BEFORE navigation so it runs as an init script.
 */
export async function installPageLoadReactHook(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const d: any = {};
    // Deferred-style holder for the first matching event
    d.resolved = false;
    d.promise = new Promise((resolve) => (d.resolve = resolve));
    (window as any).__pageLoadReactDeferred = d;

    // Ensure ADL exists to accept early pushes
    (window as any).adobeDataLayer = (window as any).adobeDataLayer || [];

    const resolveIfMatch = (evt: any) => {
      if (evt && typeof evt === 'object' && evt.event === 'pageLoadReact') {
        const holder = (window as any).__pageLoadReactDeferred;
        if (!holder?.resolved) {
          try {
            holder.resolved = true;
            holder.resolve(JSON.parse(JSON.stringify(evt)));
          } catch {
            holder.resolved = true;
            holder.resolve(evt);
          }
        }
      }
    };

    const scanNow = () => {
      try {
        const adl: any = (window as any).adobeDataLayer;

        // Array entries (pre-boot)
        if (Array.isArray(adl)) {
          for (let i = adl.length - 1; i >= 0; i--) resolveIfMatch(adl[i]);
        }

        // State/events (post-boot)
        if (adl?.getState) {
          const state = adl.getState();
          const found = state?.events?.find(
            (e: any) => e.event === 'pageLoadReact',
          );
          if (found) resolveIfMatch(found);
        }

        // History (if available)
        if (typeof adl?.getHistory === 'function') {
          const history = adl.getHistory();
          for (let i = history.length - 1; i >= 0; i--)
            resolveIfMatch(history[i]);
        }
      } catch {
        void 0;
      }
    };

    const hookFuture = () => {
      const adl: any = (window as any).adobeDataLayer;

      // Official listener
      if (adl && typeof adl.addEventListener === 'function') {
        const handler = (e: any) => resolveIfMatch(e);
        try {
          adl.addEventListener('push', handler);
          (window as any).__adlRemoveHandler = () => {
            try {
              adl.removeEventListener('push', handler);
            } catch {
              void 0;
            }
          };
        } catch {
          void 0;
        }
        return true;
      }

      // Fallback: wrap push
      if (adl && typeof adl.push === 'function') {
        const original = adl.push;
        const wrapped = function (...args: any[]) {
          try {
            resolveIfMatch(args[0]);
          } catch {
            void 0;
          }
          return original.apply(this, args as any);
        } as any;
        try {
          adl.push = wrapped;
          (window as any).__adlOriginalPush = original;
        } catch {
          void 0;
        }
        return true;
      }

      return false;
    };

    // Initial scan + hook
    scanNow();
    if (!hookFuture()) {
      const iv = setInterval(() => {
        if ((window as any).__pageLoadReactDeferred?.resolved) {
          clearInterval(iv);
          return;
        }
        scanNow();
        if (hookFuture()) clearInterval(iv);
      }, 100);
    }
  });
}

/**
 * Wait for the first pageLoadReact event resolved by installPageLoadReactHook.
 * Returns undefined on timeout.
 */
export async function awaitPageLoadReact(
  page: Page,
  timeoutMs = 10000,
): Promise<any | undefined> {
  const payload = await page.evaluate((ms: number) => {
    const p = (window as any).__pageLoadReactDeferred?.promise as
      | Promise<unknown>
      | undefined;
    if (!p) return undefined;
    return Promise.race([
      p,
      new Promise((r) => setTimeout(() => r(undefined), ms)),
    ]);
  }, timeoutMs);
  return payload;
}

/**
 * Snapshot current ADL to find the latest pageLoadReact immediately due to other events and transition.
 */
export async function readPageLoadReactNow(
  page: Page,
): Promise<unknown | undefined> {
  return page.evaluate(() => {
    const isTargetEvent = (entry: any) =>
      entry &&
      typeof entry === 'object' &&
      (entry.event === 'pageLoadReact' ||
        entry.event === 'pensionSearchResults' ||
        entry.event === 'pensionRequiredActions');

    try {
      const adl: any = (window as any).adobeDataLayer;
      if (!adl) return undefined;

      // Array entries
      if (Array.isArray(adl)) {
        for (let i = adl.length - 1; i >= 0; i--) {
          const entry = adl[i];
          if (isTargetEvent(entry)) {
            return JSON.parse(JSON.stringify(entry));
          }
        }
      }

      // State/events
      if (adl?.getState) {
        const state = adl.getState();
        const found = state?.events?.find(isTargetEvent);
        if (found) return JSON.parse(JSON.stringify(found));
      }

      // History
      if (typeof adl?.getHistory === 'function') {
        const history = adl.getHistory();
        for (let i = history.length - 1; i >= 0; i--) {
          const h = history[i];
          if (isTargetEvent(h)) return JSON.parse(JSON.stringify(h));
        }
      }
    } catch {
      /* ignore */
    }
    return undefined;
  });
}

/**
 * Optional cleanup: remove listeners and restore original push, clear flags.
 */
export async function resetPageLoadReactHook(page: Page): Promise<void> {
  await page.evaluate(() => {
    try {
      const adl: any = (window as any).adobeDataLayer;
      const remove = (window as any).__adlRemoveHandler;
      if (typeof remove === 'function') {
        try {
          remove();
        } catch {
          /* ignore */
        }
      }
      if (adl && (window as any).__adlOriginalPush) {
        try {
          adl.push = (window as any).__adlOriginalPush;
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }

    delete (window as any).__adlOriginalPush;
    delete (window as any).__adlRemoveHandler;
    delete (window as any).__pageLoadReactDeferred;
  });
}

/**
 *  get the snapshot and verify it matches stored value
 *  in data/analyticDetails.ts file
 */

export async function verifyAnalytics(
  page: Page,
  pageDetails: PageDetails,
  pageOptions: any,
): Promise<void> {
  // reload is necessary to ensure the correct pageLoadReact event is captured
  // depending on the pageOptions, e.g tabs does not require any timeout after reload otherwise test fails
  // but for other pages it is necessary to wait for the page to load
  if (
    pageOptions === 'summaryTab' ||
    pageOptions === 'incomeAndValuesTab' ||
    pageOptions === 'aboutThisPensionTab' ||
    pageOptions === 'contactTabAnalytics'
  ) {
    await page.reload();
  } else {
    await page.reload();
    await page.waitForTimeout(2000);
  }

  // Wait for the page to be fully loaded before reading analytics data
  await page.waitForLoadState('load');

  // Add retry logic for headless mode
  let snapshot = await readPageLoadReactNow(page);
  let retryCount = 0;
  const maxRetries = 3;

  while (!snapshot && retryCount < maxRetries) {
    await page.waitForTimeout(1000);
    snapshot = await readPageLoadReactNow(page);
    retryCount++;
  }

  if (!snapshot)
    throw new Error(
      'No relevant event found in the Adobe Data Layer snapshot after retries.',
    );

  // Type assertion to handle the unknown type
  const typedSnapshot = snapshot as any;
  const handlers = {
    pageLoadReact: () => {
      /* handle as PageLoadReactEvent */
    },
    pensionSearchResults: () => {
      /* handle as PensionSearchResultsEvent */
    },
    pensionRequiredActions: () => {
      /* handle as PensionRequiredActionsEvent */
    },
  };

  handlers[typedSnapshot.event]?.();
  // Common assertions across all options
  expect(typedSnapshot?.event).toBe(pageDetails.event);
  expect(typedSnapshot?.page.categoryL1).toContain(pageDetails.categoryL1);
  expect(typedSnapshot?.page.categoryL2).toContain(pageDetails.categoryL2);
  expect(typedSnapshot?.page.lang).toContain(pageDetails.lang);
  expect(typedSnapshot?.page.pageName).toContain(pageDetails.pageName);
  expect(typedSnapshot?.page.pageTitle).toContain(pageDetails.pageTitle);
  expect(typedSnapshot?.page.pageType).toContain(pageDetails.pageType);
  expect(typedSnapshot?.page.site).toContain(pageDetails.site);
  expect(typedSnapshot?.page.source).toContain(pageDetails.source);
  expect(typedSnapshot?.page.url).toContain(pageDetails.url);

  // Only check searchResults and or requiredActions if present
  if (typedSnapshot.searchResults || typedSnapshot.requiredActions) {
    switch (pageOptions) {
      case 'nonPensionPages':
        break;
      case 'pensionFoundPage':
        expect(typedSnapshot?.searchResults.timeToGetResults).toBeGreaterThan(
          0,
        );
        expect(typedSnapshot.searchResults.timeToGetResults).toBeLessThan(100);
        expect(typedSnapshot.searchResults.confirmedPensions.length).toBe(7);
        expect(typedSnapshot.searchResults.incompletePensions.length).toBe(8);
        expect(typedSnapshot.searchResults.unsupportedPensions.length).toBe(4);
        expect(typedSnapshot.searchResults.unconfirmedPensions.length).toBe(2);
        break;
      case 'pendingPensionPage':
        expect(typedSnapshot.searchResults.timeToGetResults).toBeGreaterThan(0);
        expect(typedSnapshot.searchResults.timeToGetResults).toBeLessThan(100);
        expect(typedSnapshot.searchResults.confirmedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unsupportedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unconfirmedPensions.length).toBe(2);
        expect(typedSnapshot.searchResults.incompletePensions.length).toBe(8);
        break;
      case 'pendingPensionBreakdownPage':
        expect(typedSnapshot.searchResults.confirmedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unsupportedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unconfirmedPensions.length).toBe(0);
        expect(typedSnapshot.searchResults.incompletePensions.length).toBe(8);
        break;
      case 'confirmedPensionPage':
        expect(typedSnapshot.searchResults.timeToGetResults).toBeGreaterThan(0);
        expect(typedSnapshot.searchResults.timeToGetResults).toBeLessThan(100);
        expect(typedSnapshot.searchResults.confirmedPensions.length).toBe(7);
        expect(typedSnapshot.searchResults.incompletePensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unsupportedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unconfirmedPensions.length).toBe(2);
        break;
      case 'pendingPensionDetailsPage':
        expect(typedSnapshot.searchResults.timeToGetResults).toBeGreaterThan(0);
        expect(typedSnapshot.searchResults.timeToGetResults).toBeLessThan(100);
        expect(typedSnapshot.searchResults.confirmedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unsupportedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unconfirmedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.incompletePensions.length).toBe(1);
        break;
      case 'pensionNeedingActionPage':
        expect(typedSnapshot?.requiredActions.length).toBe(2);
        break;
      case 'summaryTab':
      case 'incomeAndValuesTab':
      case 'aboutThisPension':
      case 'contactTabAnalytics':
      case 'statePensionPage':
        expect(typedSnapshot.searchResults.timeToGetResults).toBeGreaterThan(0);
        expect(typedSnapshot.searchResults.timeToGetResults).toBeLessThan(100);
        expect(typedSnapshot.searchResults.confirmedPensions.length).toBe(1);
        expect(typedSnapshot.searchResults.incompletePensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unsupportedPensions).toBe(undefined);
        expect(typedSnapshot.searchResults.unconfirmedPensions).toBe(undefined);
        break;
      default:
        throw new Error(
          'No relevant event found in the Adobe Data Layer snapshot.',
        );
    }
  }
}
