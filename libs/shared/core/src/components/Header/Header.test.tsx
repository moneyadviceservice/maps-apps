import React from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

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

  it('renders correctly when the search is opened with a click', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.click(searchToggle);
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the search is opened by a Space keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.keyDown(searchToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the search is opened by an Enter keypress', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.keyDown(searchToggle, { key: 'Enter' });
    expect(header).toMatchSnapshot();
  });
});
