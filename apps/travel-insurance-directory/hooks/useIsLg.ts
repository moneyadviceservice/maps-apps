import { useEffect, useState } from 'react';

const LG_MEDIA_QUERY = '(min-width: 1024px)';

/**
 * Returns true when viewport is at least 1024px (lg breakpoint).
 * Updates only on page load and when viewport width crosses the breakpoint
 * (matchMedia 'change' fires on width resize, not on height-only resize).
 * Used so <details> can be "always open" on desktop with CSS alone.
 */
export function useIsLg(): boolean {
  const [isLg, setIsLg] = useState(true);
  useEffect(() => {
    const mq = globalThis.matchMedia(LG_MEDIA_QUERY);
    const handler = () => {
      setIsLg((prev) => (prev === mq.matches ? prev : mq.matches));
    };
    handler(); // run once on mount
    mq.addEventListener('change', handler); // run only when width crosses 1024px
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isLg;
}
