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
});
