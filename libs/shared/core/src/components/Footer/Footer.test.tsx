import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Footer } from '.';

import '@testing-library/jest-dom';

declare global {
  interface Window {
    CookieControl: {
      load: (config: unknown) => void;
      open: () => void;
      getCookie: (name: string) => string | null;
      changeCategory: (categoryIndex: number, state: boolean) => void;
    };
  }
}

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

window.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
  changeCategory: jest.fn(),
  getCookie: jest.fn(),
};

describe('Footer component', () => {
  it('renders correctly', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toMatchSnapshot();
  });

  it('opens the cookie consent modal', () => {
    render(<Footer />);
    const button = screen.getByTestId('cookie-button');
    fireEvent.click(button);
    expect(window.CookieControl.open).toHaveBeenCalled();
  });

  it('renders the footer with the correct className', () => {
    render(<Footer className="test-class" />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('test-class');
  });

  it('renders an alternative privacy policy link if provided', () => {
    render(<Footer altPrivacyLink="https://example.com/privacy-policy" />);
    const privacyLink = screen.getByText('Privacy notice');
    expect(privacyLink).toHaveAttribute(
      'href',
      'https://example.com/privacy-policy',
    );
  });

  it('renders an alternative cookie policy link if provided', () => {
    render(<Footer altCookieLink="https://example.com/cookie-policy" />);
    const cookieLink = screen.getByText('Cookies');
    expect(cookieLink).toHaveAttribute(
      'href',
      'https://example.com/cookie-policy',
    );
  });

  it('renders an alternative contact us link if provided', () => {
    render(<Footer altContactUs="https://example.com/contact-us" />);
    const contactLink = screen.getByText('Contact us');
    expect(contactLink).toHaveAttribute(
      'href',
      'https://example.com/contact-us',
    );
  });

  it('renders with grid layout', () => {
    render(<Footer layout="grid" />);
    const footerGrid = screen.getAllByTestId('footer-grid');
    expect(footerGrid).toHaveLength(3);
  });

  it('does not render the Trustpilot widget by default', () => {
    render(<Footer />);

    expect(screen.queryByTestId('trustpilot-widget')).not.toBeInTheDocument();
  });

  it('renders a Trustpilot widget next to Plain Numbers when enabled', () => {
    render(<Footer showTrustpilot />);

    expect(screen.getAllByTestId('trustpilot-widget')).toHaveLength(1);
  });

  it('renders a Trustpilot widget in the grid layout when enabled', () => {
    render(<Footer layout="grid" showTrustpilot />);

    expect(screen.getAllByTestId('trustpilot-widget')).toHaveLength(1);
  });

  it('does not render Trustpilot widgets when showTrustpilot is false', () => {
    render(<Footer showTrustpilot={false} />);

    expect(screen.queryByTestId('trustpilot-widget')).not.toBeInTheDocument();
  });

  it('does not open cookie preferences when CookieControl is unavailable', () => {
    const originalCookieControl = window.CookieControl;

    try {
      // @ts-expect-error testing the uninitialised CookieControl branch
      delete window.CookieControl;

      render(<Footer />);

      expect(() =>
        fireEvent.click(screen.getByTestId('cookie-button')),
      ).not.toThrow();
    } finally {
      window.CookieControl = originalCookieControl;
    }
  });
});
