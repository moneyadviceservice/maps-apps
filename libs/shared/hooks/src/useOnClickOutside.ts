import { useEffect } from 'react';

export function useOnClickOutside(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.RefObject<any>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  handler: Function,
) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener('mousedown', listener);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener('touchstart', listener);
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.removeEventListener('mousedown', listener);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
