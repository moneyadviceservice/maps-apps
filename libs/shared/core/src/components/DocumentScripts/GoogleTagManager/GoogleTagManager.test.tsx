import Script from 'next/script';

import { render, screen } from '@testing-library/react';

import { GoogleTagManager } from './';

import '@testing-library/jest-dom';

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Record<string, unknown>[] | undefined;
  // eslint-disable-next-line no-var
  var gtag: ((...args: unknown[]) => void) | undefined;
}

jest.mock('next/script', () => {
  return jest.fn(({ onLoad }) => {
    if (onLoad) {
      onLoad();
    }
    return null;
  });
});

const MockScript = Script as jest.Mock;

describe('GoogleTagManager', () => {
  beforeEach(() => {
    MockScript.mockClear();
    globalThis.dataLayer = undefined;
    globalThis.gtag = undefined;
  });

  it('should render the noscript iframe for Google Tag Manager', () => {
    render(<GoogleTagManager />);
    const noScript = screen.getByTestId('google-tag-manager-no-script');
    expect(noScript).toBeInTheDocument();
    expect(noScript.innerHTML).toContain(
      '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NQD7M4S" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
    );
  });

  it('should render the Next.js Script component with the correct props', () => {
    const testNonce = 'test-nonce-123';
    render(<GoogleTagManager nonce={testNonce} />);

    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({
        src: `https://www.googletagmanager.com/gtm.js?id=GTM-NQD7M4S`,
        strategy: 'afterInteractive',
        'data-testid': 'google-tag-manager',
        nonce: testNonce,
      }),
      {},
    );
  });

  it('should not initialize Civic Cookie Consent when useCivicCookieConsent is false', () => {
    render(<GoogleTagManager useCivicCookieConsent={false} />);

    expect(globalThis.dataLayer).toBeUndefined();
    expect(globalThis.gtag).toBeUndefined();
  });

  it('should initialize Civic Cookie Consent when useCivicCookieConsent is true', () => {
    render(<GoogleTagManager useCivicCookieConsent={true} />);

    expect(globalThis.dataLayer).toBeDefined();
    expect(typeof globalThis.gtag).toBe('function');
  });

  it('should set default consent to "denied" when Civic Cookie Consent is initialized', () => {
    const dataLayerPushSpy = jest.spyOn(Array.prototype, 'push');
    render(<GoogleTagManager useCivicCookieConsent={true} />);

    expect(dataLayerPushSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        'consent',
        'default',
        { ad_storage: 'denied', analytics_storage: 'denied' },
      ]),
    );
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'default_consent',
    });

    dataLayerPushSpy.mockRestore();
  });

  it('should preserve an existing dataLayer when initializing', () => {
    globalThis.dataLayer = [{ existing: 'data' }];
    render(<GoogleTagManager useCivicCookieConsent={true} />);

    expect(globalThis.dataLayer).toContainEqual({ existing: 'data' });
    expect(globalThis.dataLayer).toContainEqual({
      event: 'default_consent',
    });
    expect(globalThis.dataLayer.length).toBeGreaterThan(1);
  });
});
