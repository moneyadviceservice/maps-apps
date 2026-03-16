import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { convertFormDataToObject } from 'utils/formHelpers';
import { buildListingsSearchParams } from 'utils/listingsPageFilters';

const LISTINGS_SCROLL_KEY = 'travel-insurance-listings-scroll';
/** Minimum time to show skeleton so fast responses don't cause a flash. */
const MIN_SKELETON_MS = 300;

export type UseListingsFilterFormOptions = {
  scrollKey?: string;
  minSkeletonMs?: number;
};

export type UseListingsFilterFormResult = {
  isFilterLoading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onFormBlurCapture: (e: React.FocusEvent<HTMLFormElement>) => void;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Storage full or unavailable (SSR, private browsing) – ignore.
  }
}

function safeSessionPop(key: string): string | null {
  try {
    const value = sessionStorage.getItem(key);
    if (value !== null) sessionStorage.removeItem(key);
    return value;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

/**
 * Encapsulates filter-form behaviour: URL sync, age submit-on-blur, scroll
 * save/restore, and minimum skeleton display time.
 */
export function useListingsFilterForm(
  lang: 'en' | 'cy',
  query: Record<string, string | string[] | undefined>,
  options: UseListingsFilterFormOptions = {},
): UseListingsFilterFormResult {
  const router = useRouter();
  const { scrollKey = LISTINGS_SCROLL_KEY, minSkeletonMs = MIN_SKELETON_MS } =
    options;

  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingStartedRef = useRef<number | null>(null);

  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  // Keep a ref to the router so callbacks don't re-create on router identity changes.
  const routerRef = useRef(router);
  routerRef.current = router;

  /* ---- Restore scroll after navigation; cleanup timers on unmount or when query/scrollKey change ---- */
  useEffect(() => {
    const saved = safeSessionPop(scrollKey);
    if (saved !== null) {
      const y = Number(saved);
      if (!Number.isNaN(y)) {
        requestAnimationFrame(() => globalThis.scrollTo(0, y));
      }
    }
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [queryKey, scrollKey]);

  /* ---- Clear loading state via router events (robust) ---- */
  useEffect(() => {
    const finishLoading = () => {
      if (!loadingStartedRef.current) {
        setIsFilterLoading(false);
        return;
      }

      const elapsed = Date.now() - loadingStartedRef.current;
      const remaining = minSkeletonMs - elapsed;

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

    router.events.on('routeChangeComplete', finishLoading);
    router.events.on('routeChangeError', finishLoading);
    return () => {
      router.events.off('routeChangeComplete', finishLoading);
      router.events.off('routeChangeError', finishLoading);
    };
  }, [router.events, minSkeletonMs]);

  /* ---- Build the URL and navigate ---- */
  const applyFormToUrl = useCallback(
    (form: HTMLFormElement) => {
      const formData = new FormData(form);
      const parsed = convertFormDataToObject(formData);
      const searchParams = buildListingsSearchParams(parsed);
      const langFromForm = (parsed.lang as string)?.trim() || lang;
      const search = searchParams.toString();
      const path = search
        ? `/${langFromForm}/listings?${search}`
        : `/${langFromForm}/listings`;
      routerRef.current.replace(path);
    },
    [lang],
  );

  const submitForm = useCallback(
    (form: HTMLFormElement) => {
      loadingStartedRef.current = Date.now();
      setIsFilterLoading(true);
      safeSessionSet(scrollKey, String(globalThis.scrollY));
      applyFormToUrl(form);
    },
    [applyFormToUrl, scrollKey],
  );

  const onFormChange = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      const form = e.currentTarget;
      if (form.id !== 'filter-menu') return;

      const changedName = (e.target as HTMLElement).getAttribute?.('name');
      if (changedName === 'age') return;

      submitForm(form);
    },
    [submitForm],
  );

  const onFormBlurCapture = useCallback(
    (e: React.FocusEvent<HTMLFormElement>) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute?.('name') !== 'age') return;
      const form = document.getElementById('filter-menu');
      if (form instanceof HTMLFormElement) submitForm(form);
    },
    [submitForm],
  );

  return { isFilterLoading, onFormChange, onFormBlurCapture };
}
