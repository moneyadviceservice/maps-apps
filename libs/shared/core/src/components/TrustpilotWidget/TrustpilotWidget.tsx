import { useEffect, useRef } from 'react';

import Script from 'next/script';

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: Element, forceReload?: boolean) => void;
    };
  }
}

export const TRUSTPILOT_SCRIPT_SRC =
  'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

const TRUSTPILOT_REVIEW_URL =
  'https://uk.trustpilot.com/review/www.moneyhelper.org.uk';

const loadWidget = (element: HTMLElement | null) => {
  if (element && window.Trustpilot) {
    window.Trustpilot.loadFromElement(element, true);
  }
};

export const TrustpilotWidget = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadWidget(ref.current);
  }, []);

  return (
    <>
      <Script
        id="trustpilot-bootstrap"
        src={TRUSTPILOT_SCRIPT_SRC}
        strategy="afterInteractive"
        data-testid="trustpilot-script"
        onLoad={() => loadWidget(ref.current)}
      />
      <div
        ref={ref}
        className="trustpilot-widget my-0 [&_iframe]:max-h-[100px]"
        data-locale="en-GB"
        data-template-id="53aa8807dec7e10d38f59f32"
        data-businessunit-id="6307bc8164f919af214eb216"
        data-style-height="150px"
        data-style-width="200px"
        data-theme="light"
        data-token="a55bb398-6aac-4455-b1bb-e228a7911933"
        data-testid="trustpilot-widget"
      >
        <a
          href={TRUSTPILOT_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Trustpilot rating for MoneyHelper. Opens in a new tab"
        >
          Trustpilot
        </a>
      </div>
    </>
  );
};
