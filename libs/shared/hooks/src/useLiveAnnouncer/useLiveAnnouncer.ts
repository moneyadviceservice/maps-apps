import { useRef } from 'react';

type UseLiveAnnouncerProps = {
  reAnnounceIdenticalMessages?: boolean;
};

export const useLiveAnnouncer = <T extends HTMLElement = HTMLDivElement>({
  reAnnounceIdenticalMessages = true,
}: UseLiveAnnouncerProps) => {
  const ref = useRef<T>(null);

  const announce = (message: string) => {
    if (!ref.current) {
      return;
    }

    if (reAnnounceIdenticalMessages && message === ref.current.textContent) {
      message += `\u2060`; // ensure consecutive identical messages register as unique so they are announced by screen readers
    }

    ref.current.textContent = message;
  };

  return { ref, announce };
};
