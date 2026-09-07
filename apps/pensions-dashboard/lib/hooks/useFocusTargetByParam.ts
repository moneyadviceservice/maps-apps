/**
 * Hook to focus an element using a search param which targets focus to an
 * element ID.
 */

import { useEffect } from 'react';

import { useRouter } from 'next/router';

export const useFocusTargetByParams = () => {
  const router = useRouter();

  useEffect(() => {
    const focusParam = router.query.focus as string | undefined;
    if (!focusParam) return;

    const element = document.getElementById(focusParam);
    if (element) {
      element.focus();
    }

    const { focus, ...rest } = router.query;
    router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    });
  }, [router]);
};
