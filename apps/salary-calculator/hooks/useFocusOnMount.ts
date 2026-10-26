import { useEffect, useRef } from 'react';

/**
 * Focuses and scrolls to the element when it mounts, unless focus has already
 * been placed. An element hidden at the current breakpoint cannot take focus,
 * so the first visible element in the tree wins.
 */
export const useFocusOnMount = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (document.activeElement !== document.body) return;

    ref.current?.focus();

    if (ref.current && document.activeElement === ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return ref;
};
