import { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import useTranslation from '@maps-react/hooks/useTranslation';

import { useCookieBanner } from '../../hooks/useCookieBanner';
import {
  CookieBannerConfig,
  DEFAULT_COOKIE_BANNER_CONFIG,
} from './cookieBannerConfig';

export type CookieBannerProps = {
  config?: CookieBannerConfig;
};

const toAriaLabel = (label: ReactNode): string | undefined =>
  typeof label === 'string' ? label : undefined;

export const CookieBanner = ({
  config = DEFAULT_COOKIE_BANNER_CONFIG,
}: CookieBannerProps) => {
  const { z } = useTranslation();
  const {
    dialogRef,
    isMounted,
    isOpen,
    analyticsChecked,
    setAnalyticsChecked,
    marketingChecked,
    setMarketingChecked,
    handleReject,
    handleSave,
    handleAcceptAll,
    handleButtonKeyDown,
  } = useCookieBanner();

  if (!isMounted) {
    return null;
  }

  const { text } = config;
  const rejectLabel = z(text.reject);
  const saveLabel = z(text.closeLabel);
  const acceptLabel = z(text.accept);

  return (
    <div className="cmp-mps-cookie-banner">
      <dialog
        ref={dialogRef}
        data-testid="mps-cookie-banner"
        className={twMerge(
          'fixed inset-0 z-[1000] m-auto w-[90vw] max-w-[800px] rounded-lg border border-gray-300 bg-white p-6',
          'backdrop:bg-black/50 open:flex open:flex-col',
        )}
        aria-modal={isOpen ? 'true' : 'false'}
        aria-labelledby="mps-cookie-banner-title"
      >
        <h2 id="mps-cookie-banner-title" className="text-2xl font-semibold">
          {z(text.title)}
        </h2>
        <hr className="my-5 border-gray-300" />

        <p className="mb-5">{z(text.intro)}</p>

        <div className="mb-1 flex items-center gap-3">
          <input
            id="cookie-banner-necessary"
            name="cookie-banner-necessary"
            type="checkbox"
            disabled
            checked
            readOnly
            className="scale-125"
          />
          <label htmlFor="cookie-banner-necessary" className="font-semibold">
            {z(text.necessaryTitle)}
          </label>
        </div>
        <p className="mb-5">{z(text.necessaryDescription)}</p>

        <div className="mb-1 flex items-center gap-3">
          <input
            id="cookie-banner-analytics"
            name="cookie-banner-analytics"
            type="checkbox"
            autoFocus
            checked={analyticsChecked}
            onChange={(event) => setAnalyticsChecked(event.target.checked)}
            className="scale-125"
          />
          <label htmlFor="cookie-banner-analytics" className="font-semibold">
            {z(text.optionalCookies.analytics.label)}
          </label>
        </div>
        <p className="mb-5">{z(text.optionalCookies.analytics.description)}</p>

        <div className="mb-1 flex items-center gap-3">
          <input
            id="cookie-banner-marketing"
            name="cookie-banner-marketing"
            type="checkbox"
            checked={marketingChecked}
            onChange={(event) => setMarketingChecked(event.target.checked)}
            className="scale-125"
          />
          <label htmlFor="cookie-banner-marketing" className="font-semibold">
            {z(text.optionalCookies.marketing.label)}
          </label>
        </div>
        <p className="mb-5">{z(text.optionalCookies.marketing.description)}</p>

        <hr className="my-5 border-gray-300" />

        <div className="flex flex-col items-stretch gap-2 py-1 md:flex-row md:items-start">
          <Button
            type="button"
            variant="secondary"
            data-button-type="reject-additional"
            aria-label={toAriaLabel(rejectLabel)}
            onClick={handleReject}
            onKeyDown={(event) => handleButtonKeyDown(event, handleReject)}
          >
            {rejectLabel}
          </Button>

          <Button
            type="button"
            variant="secondary"
            data-button-type="save"
            aria-label={toAriaLabel(saveLabel)}
            onClick={handleSave}
            onKeyDown={(event) => handleButtonKeyDown(event, handleSave)}
          >
            {saveLabel}
          </Button>

          <Button
            type="button"
            variant="primary"
            data-button-type="accept-all"
            data-testid="cookie-banner-accept-all"
            aria-label={toAriaLabel(acceptLabel)}
            onClick={handleAcceptAll}
            onKeyDown={(event) => handleButtonKeyDown(event, handleAcceptAll)}
          >
            {acceptLabel}
          </Button>
        </div>
      </dialog>
    </div>
  );
};
