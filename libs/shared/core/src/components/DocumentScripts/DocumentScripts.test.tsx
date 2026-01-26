import Script from 'next/script';

import { render, screen } from '@testing-library/react';

import { DocumentScripts } from './DocumentScripts';

import '@testing-library/jest-dom';

jest.mock('./GoogleTagManager', () => ({
  GoogleTagManager: jest.fn(({ nonce, useCivicCookieConsent }) => (
    <div
      data-testid="google-tag-manager-mock"
      data-nonce={nonce}
      data-civic-consent={useCivicCookieConsent}
    />
  )),
}));

jest.mock('./AdobeAnalytics', () => ({
  AdobeAnalytics: jest.fn(({ nonce }) => (
    <div data-testid="adobe-analytics-mock" data-nonce={nonce} />
  )),
}));

jest.mock('next/script', () => {
  return jest.fn((props) => {
    return <script data-testid={props['data-testid']}>{props.children}</script>;
  });
});
const MockScript = Script as jest.Mock;

describe('DocumentScripts', () => {
  beforeEach(() => {
    MockScript.mockClear();
    jest.spyOn(console, 'warn').mockImplementation(() => {
      // Suppress console output
    });
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('should render all scripts by default', () => {
    render(<DocumentScripts />);
    expect(screen.getByTestId('google-tag-manager-mock')).toBeInTheDocument();
    expect(screen.getByTestId('genesys-live-chat')).toBeInTheDocument();
    expect(screen.getByTestId('adobe-analytics-mock')).toBeInTheDocument();
  });

  it('should not render any scripts when all flags are false', () => {
    render(
      <DocumentScripts
        useGoogleTagManager={false}
        useGenesysLiveChat={false}
        useAdobeAnalytics={false}
      />,
    );
    expect(
      screen.queryByTestId('google-tag-manager-mock'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('genesys-live-chat')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('adobe-analytics-mock'),
    ).not.toBeInTheDocument();
  });

  it('should pass nonce to all child components', () => {
    const testNonce = 'test-nonce-value';
    render(<DocumentScripts nonce={testNonce} />);

    const gtmMock = screen.getByTestId('google-tag-manager-mock');
    const adobeMock = screen.getByTestId('adobe-analytics-mock');
    expect(gtmMock).toHaveAttribute('data-nonce', testNonce);
    expect(adobeMock).toHaveAttribute('data-nonce', testNonce);

    expect(MockScript).toHaveBeenCalledWith(
      expect.objectContaining({ nonce: testNonce }),
      {},
    );
  });

  it('should pass useCivicCookieConsent={true} prop to GoogleTagManager', () => {
    render(<DocumentScripts useCivicCookieConsent={true} />);
    const gtmMock = screen.getByTestId('google-tag-manager-mock');
    expect(gtmMock).toHaveAttribute('data-civic-consent', 'true');
  });

  it('should pass useCivicCookieConsent={false} prop to GoogleTagManager', () => {
    render(<DocumentScripts useCivicCookieConsent={false} />);
    const gtmMock = screen.getByTestId('google-tag-manager-mock');
    expect(gtmMock).toHaveAttribute('data-civic-consent', 'false');
  });

  it('should log a warning if useCivicCookieConsent is true but useGoogleTagManager is false', () => {
    render(
      <DocumentScripts
        useCivicCookieConsent={true}
        useGoogleTagManager={false}
      />,
    );
    expect(console.warn).toHaveBeenCalledWith('Civic cookie requires gtm');
  });

  it('should not log a warning if useGoogleTagManager is true', () => {
    render(
      <DocumentScripts
        useCivicCookieConsent={true}
        useGoogleTagManager={true}
      />,
    );
    expect(console.warn).not.toHaveBeenCalled();
  });
});
