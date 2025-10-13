import React from 'react';

import { render, screen } from '@testing-library/react';

import { DocumentScripts } from './DocumentScripts';

import '@testing-library/jest-dom/extend-expect';

// Mock the next/script module
jest.mock('next/script', () => {
  // eslint-disable-next-line react/display-name, react/prop-types
  return function ({ children, 'data-testid': dataTestId, ...props }) {
    return (
      <script data-testid={dataTestId} {...props}>
        {children}
      </script>
    );
  };
});

describe('DocumentScripts component', () => {
  it('renders all scripts by default', async () => {
    // Arrange
    render(<DocumentScripts />);

    // Act
    const civicCookieConsent = await screen.findByTestId(
      'civic-cookie-consent-default',
    );
    const googleTagManagerNoScript = await screen.findByTestId(
      'google-tag-manager-no-script',
    );
    const googleTagManager = await screen.findByTestId('google-tag-manager');
    const genesysLiveChat = await screen.findByTestId('genesys-live-chat');
    const adobeAnalytics = await screen.findByTestId('adobe-analytics');

    // Assert
    expect(civicCookieConsent).toBeInTheDocument();
    expect(googleTagManagerNoScript).toBeInTheDocument();
    expect(googleTagManager).toBeInTheDocument();
    expect(genesysLiveChat).toBeInTheDocument();
    expect(adobeAnalytics).toBeInTheDocument();
  });

  it('renders only Google Tag Manager scripts when useGoogleTagManager is true', async () => {
    // Arrange
    render(
      <DocumentScripts
        useGoogleTagManager={true}
        useCivicCookieConsent={false}
        useGenesysLiveChat={false}
        useAdobeAnalytics={false}
      />,
    );

    // Act
    const googleTagManagerNoScript = await screen.findByTestId(
      'google-tag-manager-no-script',
    );
    const googleTagManager = await screen.findByTestId('google-tag-manager');

    // Assert
    expect(googleTagManagerNoScript).toBeInTheDocument();
    expect(googleTagManager).toBeInTheDocument();

    // Ensure other scripts are not rendered
    expect(
      screen.queryByTestId('civic-cookie-consent-default'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('genesys-live-chat')).not.toBeInTheDocument();
    expect(screen.queryByTestId('adobe-analytics')).not.toBeInTheDocument();
  });

  it('renders only Civic Cookie Consent script when useCivicCookieConsent is true', async () => {
    // Arrange
    render(
      <DocumentScripts
        useGoogleTagManager={false}
        useCivicCookieConsent={true}
        useGenesysLiveChat={false}
        useAdobeAnalytics={false}
      />,
    );

    // Act
    const civicCookieConsent = await screen.findByTestId(
      'civic-cookie-consent-default',
    );

    // Assert
    expect(civicCookieConsent).toBeInTheDocument();

    // Ensure other scripts are not rendered
    expect(
      screen.queryByTestId('google-tag-manager-no-script'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('google-tag-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('genesys-live-chat')).not.toBeInTheDocument();
    expect(screen.queryByTestId('adobe-analytics')).not.toBeInTheDocument();
  });

  it('renders only Genesys Live Chat script when useGenesysLiveChat is true', async () => {
    // Arrange
    render(
      <DocumentScripts
        useGoogleTagManager={false}
        useCivicCookieConsent={false}
        useGenesysLiveChat={true}
        useAdobeAnalytics={false}
      />,
    );

    // Act
    const genesysLiveChat = await screen.findByTestId('genesys-live-chat');

    // Assert
    expect(genesysLiveChat).toBeInTheDocument();

    // Ensure other scripts are not rendered
    expect(
      screen.queryByTestId('google-tag-manager-no-script'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('google-tag-manager')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('civic-cookie-consent-default'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('adobe-analytics')).not.toBeInTheDocument();
  });

  it('renders only Adobe Analytics script when useAdobeAnalytics is true', async () => {
    // Arrange
    render(
      <DocumentScripts
        useGoogleTagManager={false}
        useCivicCookieConsent={false}
        useGenesysLiveChat={false}
        useAdobeAnalytics={true}
      />,
    );

    // Act
    const adobeAnalytics = await screen.findByTestId('adobe-analytics');

    // Assert
    expect(adobeAnalytics).toBeInTheDocument();

    // Ensure other scripts are not rendered
    expect(
      screen.queryByTestId('google-tag-manager-no-script'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('google-tag-manager')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('civic-cookie-consent-default'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('genesys-live-chat')).not.toBeInTheDocument();
  });
});
