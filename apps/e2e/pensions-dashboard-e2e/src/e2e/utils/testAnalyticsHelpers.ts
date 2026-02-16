import { expect, Page } from '@maps/playwright';

// Define strict TypeScript interfaces
export type PageDetails = {
  event: string;
  categoryLevels: string[];
  lang: string;
  pageName: string;
  pageTitle: string;
  pageType: string;
  site: string;
  source: string;
  url: string;
  user: {
    loggedIn: boolean;
    sessionId: string;
    userId: string;
  };
};

export async function testcapturePageLoadReactEvent(
  page: Page,
  timeout = 5000,
): Promise<unknown> {
  try {
    // First ensure the adobeDataLayer exists
    await page.waitForFunction(
      () => typeof (window as any).adobeDataLayer !== 'undefined',
      { timeout, polling: 200 },
    );

    // Monitor the data layer for our specific event
    return await page.evaluate(async (eventName) => {
      const adobeDataLayer = (window as any).adobeDataLayer;

      // Option 1: Check if event already exists in history
      if (typeof adobeDataLayer.getHistory === 'function') {
        const history = adobeDataLayer.getHistory();
        const event = history.reverse().find((e: any) => e.event === eventName);
        if (event) return JSON.parse(JSON.stringify(event));
      }

      // Option 2: Check current state
      const state = adobeDataLayer.getState();
      if (state?.events) {
        const event = state.events.find((e: any) => e.event === eventName);
        if (event) return JSON.parse(JSON.stringify(event));
      }

      // Option 3: Listen for future events if not found immediately
      return new Promise((resolve) => {
        const handler = (event: any) => {
          if (event.event === eventName) {
            adobeDataLayer.removeEventListener('push', handler);
            resolve(JSON.parse(JSON.stringify(event)));
          }
        };
        adobeDataLayer.addEventListener('push', handler);
      });
    }, 'pageLoadReact');
  } catch (error) {
    console.error('Error capturing pageLoadReact event:', error);
    return null;
  }
}

export async function capturePageLoadReactEvent(
  page: Page,
  timeout = 10000,
  debug = false,
): Promise<unknown> {
  // Enable console monitoring
  if (debug) {
    await page.evaluate(() => {
      console.log('[DEBUG] Starting pageLoadReact event capture');
      if ((window as any).adobeDataLayer) {
        console.log(
          '[DEBUG] Adobe Data Layer found:',
          (window as any).adobeDataLayer,
        );
        console.log(
          '[DEBUG] Current state:',
          (window as any).adobeDataLayer.getState(),
        );
      } else {
        console.warn('[DEBUG] adobeDataLayer not found in window');
      }
    });
  }

  try {
    // 1. Primary Method: Adobe Data Layer with waiting
    const adlEvent = await attemptAdobeDataLayerCapture(page, timeout, debug);
    if (adlEvent) return normalizeCapturedEvent(adlEvent);

    // 2. Alternative Method: Other data layers
    const altEvent = await attemptAlternativeDataLayers(page, debug);
    if (altEvent) return normalizeCapturedEvent(altEvent);

    // 3. Fallback: Direct console monitoring and state dump
    if (debug) {
      await dumpDataLayerState(page);
    }

    console.error('pageLoadReact event not found in any data layer');
    return null;
  } catch (error) {
    console.error('Error capturing pageLoadReact event:', error);
    return null;
  }
}

// ===== Primary Capture Method =====
async function attemptAdobeDataLayerCapture(
  page: Page,
  timeout: number,
  debug: boolean,
): Promise<unknown> {
  try {
    // Wait for adobeDataLayer to exist
    await page.waitForFunction(
      () => typeof (window as any).adobeDataLayer !== 'undefined',
      { timeout, polling: 200 },
    );

    return await page.evaluate(
      ({ eventName, debug, timeoutMs }) => {
        const adl = (window as any).adobeDataLayer;
        if (debug) console.log('[DEBUG] Attempting Adobe Data Layer capture');

        // If ADL is an array, scan existing entries (newest first)
        if (Array.isArray(adl)) {
          for (let i = adl.length - 1; i >= 0; i--) {
            const entry = adl[i];
            if (
              entry &&
              typeof entry === 'object' &&
              entry.event === eventName
            ) {
              if (debug) console.log('[DEBUG] Found in array entries:', entry);
              return JSON.parse(JSON.stringify(entry));
            }
          }
        }

        // Check existing state
        const state = adl.getState();
        if (state?.events) {
          const event = state.events.find((e: any) => e.event === eventName);
          if (event) {
            if (debug) console.log('[DEBUG] Found in state.events:', event);
            return JSON.parse(JSON.stringify(event));
          }
        }

        // Check history if available
        if (typeof adl.getHistory === 'function') {
          const history = adl.getHistory();
          for (let i = history.length - 1; i >= 0; i--) {
            if (history[i]?.event === eventName) {
              if (debug) console.log('[DEBUG] Found in history:', history[i]);
              return JSON.parse(JSON.stringify(history[i]));
            }
          }
        }

        // Setup listener for future events
        return new Promise((resolve) => {
          const maxMs = typeof timeoutMs === 'number' ? timeoutMs : 2000;
          if (debug) console.log('[DEBUG] Setting up future event capture');

          // Strategy A: Official ADL event listener
          if (adl && typeof adl.addEventListener === 'function') {
            if (debug)
              console.log('[DEBUG] Using adobeDataLayer.addEventListener');
            const handler = (event: any) => {
              if (event && event.event === eventName) {
                if (debug)
                  console.log('[DEBUG] Event via addEventListener:', event);
                try {
                  adl.removeEventListener('push', handler);
                } catch {
                  /** Do nothing, this is intentional */
                }
                resolve(JSON.parse(JSON.stringify(event)));
              }
            };
            try {
              adl.addEventListener('push', handler);
            } catch {
              /** Do nothing, this is intentional */
            }

            setTimeout(() => {
              if (debug) console.log('[DEBUG] addEventListener timeout');
              try {
                adl.removeEventListener('push', handler);
              } catch {
                /** Do nothing, this is intentional */
              }
              resolve(null);
            }, maxMs);
            return;
          }

          // Strategy B: Intercept push if available
          if (adl && typeof adl.push === 'function') {
            if (debug)
              console.log('[DEBUG] Wrapping adobeDataLayer.push for capture');
            const originalPush = adl.push;
            const wrapped = function (...args: any[]) {
              try {
                const first = args[0];
                if (
                  first &&
                  typeof first === 'object' &&
                  first.event === eventName
                ) {
                  if (debug)
                    console.log('[DEBUG] Event via push wrapper:', first);
                  resolve(JSON.parse(JSON.stringify(first)));
                }
              } catch {
                /** Do nothing, this is intentional */
              }
              return originalPush.apply(adl, args as any);
            } as any;
            try {
              adl.push = wrapped;
            } catch {
              /** Do nothing, this is intentional */
            }

            setTimeout(() => {
              if (debug) console.log('[DEBUG] push wrapper timeout');
              try {
                adl.push = originalPush;
              } catch {
                /** Do nothing, this is intentional */
              }
              resolve(null);
            }, maxMs);
            return;
          }

          // Strategy C: Poll the array-like structure
          if (Array.isArray(adl)) {
            if (debug) console.log('[DEBUG] Polling ADL array for event');
            const startLen = adl.length;
            const interval = setInterval(() => {
              try {
                for (let i = adl.length - 1; i >= startLen; i--) {
                  const entry = adl[i];
                  if (
                    entry &&
                    typeof entry === 'object' &&
                    entry.event === eventName
                  ) {
                    if (debug) console.log('[DEBUG] Event via polling:', entry);
                    clearInterval(interval);
                    resolve(JSON.parse(JSON.stringify(entry)));
                    return;
                  }
                }
              } catch {
                /** Do nothing, this is intentional */
              }
            }, 100);

            setTimeout(() => {
              if (debug) console.log('[DEBUG] polling timeout');
              clearInterval(interval);
              resolve(null);
            }, maxMs);
            return;
          }

          // Fallback – nothing to hook into
          if (debug) console.log('[DEBUG] No suitable ADL hook found');
          setTimeout(() => resolve(null), maxMs);
        });
      },
      {
        eventName: 'pageLoadReact',
        debug,
        timeoutMs: Math.max(2000, Math.min(timeout, 15000)),
      },
    );
  } catch (error) {
    if (debug) console.log('[DEBUG] Adobe Data Layer capture failed');
    return null;
  }
}

// Ensure callers always receive a predictable shape
function normalizeCapturedEvent(raw: any): {
  event?: string;
  page?: any;
  user?: any;
} | null {
  if (!raw) return null;

  // If raw is a stringified JSON, try to parse
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return normalizeCapturedEvent(parsed);
    } catch {
      // Fallthrough – cannot parse
    }
  }

  // Common fields across different data layers
  const eventName =
    raw.event ||
    raw.name ||
    raw.type ||
    raw?.page?.event ||
    raw?.page?.name ||
    raw?.page?.type ||
    raw?.data?.event;

  const page = raw.page || raw.pageInfo || raw.data?.page || raw.payload?.page;
  const user = raw.user || raw.identity || raw.userInfo || raw.payload?.user;

  return {
    event: eventName,
    page,
    user,
  };
}

// ===== Alternative Data Layers =====
async function attemptAlternativeDataLayers(
  page: Page,
  debug: boolean,
): Promise<unknown> {
  return page.evaluate((debug) => {
    if (debug) console.log('[DEBUG] Checking alternative data layers');

    // 1. DigitalData (common in Adobe implementations)
    if ((window as any).digitalData) {
      const dd = (window as any).digitalData;
      if (dd.event && dd.event.eventName === 'pageLoadReact') {
        if (debug) console.log('[DEBUG] Found in digitalData:', dd.event);
        return JSON.parse(JSON.stringify(dd.event));
      }

      // Check page attributes
      if (dd.page && dd.page.pageInfo && dd.page.pageInfo.pageName) {
        const pageName = dd.page.pageInfo.pageName;
        if (pageName.includes('pageLoadReact')) {
          const event = {
            event: 'pageLoadReact',
            page: dd.page,
          };
          if (debug)
            console.log('[DEBUG] Constructed from digitalData:', event);
          return JSON.parse(JSON.stringify(event));
        }
      }
    }

    // 2. dataLayer (Google Tag Manager standard)
    if ((window as any).dataLayer) {
      const dl = (window as any).dataLayer;
      for (let i = dl.length - 1; i >= 0; i--) {
        const entry = dl[i];
        if (entry.event === 'pageLoadReact') {
          if (debug) console.log('[DEBUG] Found in dataLayer:', entry);
          return JSON.parse(JSON.stringify(entry));
        }
      }
    }

    // 3. Custom implementations
    if ((window as any).pageLoadReactEvent) {
      if (debug) console.log('[DEBUG] Found custom event property');
      return JSON.parse(JSON.stringify((window as any).pageLoadReactEvent));
    }

    return null;
  }, debug);
}

// ===== Debug Utilities =====
async function dumpDataLayerState(page: Page): Promise<void> {
  await page.evaluate(() => {
    console.groupCollapsed('[DEBUG] Data Layer State Dump');

    // Adobe Data Layer
    if ((window as any).adobeDataLayer) {
      try {
        console.log('adobeDataLayer:', (window as any).adobeDataLayer);
        console.log('getState():', (window as any).adobeDataLayer.getState());
        if (typeof (window as any).adobeDataLayer.getHistory === 'function') {
          console.log(
            'getHistory():',
            (window as any).adobeDataLayer.getHistory(),
          );
        }
      } catch (e) {
        console.error('Error accessing adobeDataLayer:', e);
      }
    }

    // DigitalData
    console.log('digitalData:', (window as any).digitalData);

    // dataLayer
    console.log('dataLayer:', (window as any).dataLayer);

    // Custom properties
    console.log('pageLoadReactEvent:', (window as any).pageLoadReactEvent);
    console.log('ACDLEvent:', (window as any).ACDLEvent);

    console.groupEnd();
  });
}

export async function verifyTestAnalytics(
  page: Page,
  pageDetails: PageDetails,
): Promise<void> {
  const event = (await capturePageLoadReactEvent(page, 15000, true)) as {
    event?: string;
    page?: Partial<Omit<PageDetails, 'event' | 'user'>>;
    user?: Partial<PageDetails['user']>;
  };
  expect(event).toBeDefined();

  // We can use the non-null assertion operator (!) because the `expect` above
  // will throw and stop execution if `event` is null or undefined.
  expect(event?.event).toContain(pageDetails.event);
  expect(event?.page?.categoryLevels).toBeDefined();
  expect(event?.page?.categoryLevels).toEqual(pageDetails.categoryLevels);
  expect(event?.page?.lang).toBeDefined();
  expect(event?.page?.lang).toContain(pageDetails.lang);
  expect(event?.page?.pageName).toBeDefined();
  expect(event?.page?.pageName).toContain(pageDetails.pageName);
  expect(event?.page?.pageTitle).toBeDefined();
  expect(event?.page?.pageTitle).toContain(pageDetails.pageTitle);
  expect(event?.page?.pageType).toBeDefined();
  expect(event?.page?.pageType).toContain(pageDetails.pageType);
  expect(event?.page?.site).toBeDefined();
  expect(event?.page?.site).toContain(pageDetails.site);
  expect(event?.page?.source).toBeDefined();
  expect(event?.page?.source).toContain(pageDetails.source);
  expect(event?.page?.url).toBeDefined();
  expect(event?.page?.url).toContain(pageDetails.url);
  expect(event?.user?.loggedIn).toBe(pageDetails.user.loggedIn);
  expect(event?.user?.sessionId).toContain(pageDetails.user.sessionId);
  expect(event?.user?.userId).toContain(pageDetails.user.userId);
}
