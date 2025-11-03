/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect } from 'react';

import Script from 'next/script';

import { useCookieConsent } from '@maps-react/hooks/useCookieConsent';

type Props = {
  isOpen: Dispatch<SetStateAction<boolean>>;
  config?: {
    locales?: unknown[];
    text?: unknown;
  };
};

export const CookieConsent = ({ isOpen, config }: Props) => {
  const { initCookieConsent } = useCookieConsent(config);

  useEffect(() => {
    initCookieConsent();

    const body = document.querySelector('body');
    const observer = new MutationObserver((mutationsList) => {
      const ccc = mutationsList.find(
        (mutation) => (mutation.target as Node & { id: string }).id === 'ccc',
      );
      isOpen(!!ccc?.target.childNodes.length);

      // Handle reject buttons when cookie consent banner appears
      if (ccc?.target.childNodes.length) {
        handleRejectButtons(ccc.target as HTMLElement);
      }
    });

    if (body) {
      observer.observe(body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleRejectButtons(el: HTMLElement) {
    const rejectButtons = [
      el.querySelector('#ccc-notify-reject'), // top banner reject button
      el.querySelector('#ccc-reject-settings'), // sidebar reject button
    ];

    rejectButtons.forEach((button) => {
      if (button && window.CookieControl) {
        button.addEventListener('click', () => {
          window.CookieControl.changeCategory(0, true); // category 0=Analytics
        });
      }
    });
  }

  return (
    <Script
      src={process.env.NEXT_PUBLIC_CIVIC_COOKIE_SCRIPT}
      strategy="beforeInteractive"
    />
  );
};
