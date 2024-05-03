/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@maps-digital/shared/hooks';

type Props = {
  isOpen: Dispatch<SetStateAction<boolean>>;
};

export const CookieConsent = ({ isOpen }: Props) => {
  const { initCookieConsent } = useCookieConsent();

  useEffect(() => {
    initCookieConsent();

    const body = document.querySelector('body');
    const observer = new MutationObserver((mutationsList) => {
      const ccc = mutationsList.find(
        (mutation) => (mutation.target as Node & { id: string }).id === 'ccc',
      );
      isOpen(!!ccc?.target.childNodes.length);
    });

    if (body) {
      observer.observe(body, {
        childList: true,
        subtree: true,
      });
    }
  }, []);

  return (
    <Script
      src={process.env.NEXT_PUBLIC_CIVIC_COOKIE_SCRIPT}
      strategy="beforeInteractive"
    />
  );
};
