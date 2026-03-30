import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';

import { useRouter } from 'next/router';

const HEADER_OFFSET = 0;
const MAX_CONTENT_WAIT_ATTEMPTS = 50;
const extractPathname = (url: string): string =>
  url.split('#')[0]?.split('?')[0] ?? '';

/**
 * Executes scroll with double RAF for layout stability
 */
function executeScrollWithDoubleRAF(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

/**
 * Executes the scroll action - either to hash or to top
 */
function executeScroll(
  hash: string | null,
  scrollToHash: (hash: string) => boolean,
): void {
  if (hash && scrollToHash(hash)) return;
  window.scrollTo(0, 0);
}

/**
 * Waits for content to be ready, then executes scroll
 */
function createWaitForContentHandler(
  hash: string | null,
  scrollToHash: (hash: string) => boolean,
  attemptCountRef: MutableRefObject<number>,
): () => void {
  const waitForContentAndScroll = () => {
    attemptCountRef.current++;

    // Safety valve: don't wait forever
    if (attemptCountRef.current > MAX_CONTENT_WAIT_ATTEMPTS) {
      executeScroll(hash, scrollToHash);
      return;
    }

    // Check if content is ready (body has meaningful height)
    if (document.body.scrollHeight <= window.innerHeight) {
      requestAnimationFrame(waitForContentAndScroll);
      return;
    }

    // Double RAF for layout stability
    executeScrollWithDoubleRAF(() => {
      executeScroll(hash, scrollToHash);
    });
  };

  return waitForContentAndScroll;
}

/**
 * Hook for managing scroll restoration on Next.js route changes
 *
 * Features:
 * - Disables browser native scroll restoration
 * - Scrolls to hash link if URL contains a hash fragment
 * - Scrolls to top for all navigation when no hash is present
 * - Waits for content to be ready before handling scroll
 */
export function useScrollRestoration() {
  const router = useRouter();
  const attemptCountRef = useRef(0);

  // Disable browser native scroll restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const scrollToHash = useCallback((hash: string): boolean => {
    const id = hash.replace('#', '');
    if (!id) return false;

    const element = document.getElementById(id);
    if (!element) return false;

    const top =
      element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });

    // Accessibility: make element focusable temporarily if needed
    const hasTabIndex = element.hasAttribute('tabindex');
    if (hasTabIndex) {
      element.focus();
    } else {
      element.setAttribute('tabindex', '-1');
      element.focus();
      element.removeAttribute('tabindex');
    }

    return true;
  }, []);

  const extractHash = useCallback((url: string): string | null => {
    if (window.location.hash) {
      return window.location.hash;
    }
    if (!url.includes('#')) return null;
    return url.substring(url.indexOf('#'));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChangeComplete = (url: string) => {
      const isSamePage = extractPathname(url) === router.pathname;
      const hash = extractHash(url);
      attemptCountRef.current = 0;

      // If we navigated back/forward on the same page without a hash,
      // force scroll to top because browser restoration is disabled.
      if (isSamePage && !hash) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
        return;
      }

      const waitForContentAndScroll = createWaitForContentHandler(
        hash,
        scrollToHash,
        attemptCountRef,
      );

      // Start on next tick to allow React to begin rendering
      setTimeout(waitForContentAndScroll, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, extractHash, scrollToHash]);
}
