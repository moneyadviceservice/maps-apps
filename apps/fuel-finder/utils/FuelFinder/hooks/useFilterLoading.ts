import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

const MIN_SKELETON_MS = 300;
const DEFAULT_ROUTE_OPTIONS = { shallow: false };

export function useFilterLoading() {
  const router = useRouter();
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const loadingStartedRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentPathname = new URL(router.asPath, window.location.origin)
      .pathname;

    const handleStart = (
      url: string,
      { shallow }: { shallow: boolean } = DEFAULT_ROUTE_OPTIONS,
    ) => {
      if (shallow) return;
      const destinationPathname = new URL(url, window.location.origin).pathname;
      if (destinationPathname !== currentPathname) return;

      if (!loadingStartedRef.current) {
        loadingStartedRef.current = Date.now();
      }
      setIsFilterLoading(true);
    };

    const finishLoading = () => {
      if (!loadingStartedRef.current) return;

      const elapsed = Date.now() - loadingStartedRef.current;
      const remaining = MIN_SKELETON_MS - elapsed;

      if (remaining <= 0) {
        loadingStartedRef.current = null;
        setIsFilterLoading(false);
        return;
      }

      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(() => {
        loadingTimeoutRef.current = null;
        loadingStartedRef.current = null;
        setIsFilterLoading(false);
      }, remaining);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', finishLoading);
    router.events.on('routeChangeError', finishLoading);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', finishLoading);
      router.events.off('routeChangeError', finishLoading);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [router.events, router.asPath]);

  return { isFilterLoading };
}
