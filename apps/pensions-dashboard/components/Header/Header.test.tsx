import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened with a click', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by a Space keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by an Enter keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: 'Enter' });
    expect(header).toMatchSnapshot();
  });
});
