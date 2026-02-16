import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Footer } from '.';

import '@testing-library/jest-dom';

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

  it('renders with grid layout', () => {
    render(<Footer layout="grid" />);
    const footerGrid = screen.getAllByTestId('footer-grid');
    expect(footerGrid.length).toEqual(5);
  });
});
