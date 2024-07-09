import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

window.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
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
});
