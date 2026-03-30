import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const mockLocationAssign = jest.fn();

describe('Header component', () => {
  const originalLocation = globalThis.location;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    Object.defineProperty(globalThis, 'location', {
      value: { ...originalLocation, href: '', assign: mockLocationAssign },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('renders correctly', () => {
    render(<Header />);
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('renders header and nav without language switcher', () => {
    const { queryByTestId, getByTestId } = render(
      <Header showLanguageSwitcher={false} />,
    );
    const langSwitch = queryByTestId('language-switcher');
    expect(langSwitch).not.toBeInTheDocument();

    const navToggle = getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    const navLangLinkContainer = queryByTestId('nav-lang-link-container');
    const navLangLink = queryByTestId('nav-lang-link');
    expect(navLangLinkContainer).not.toBeInTheDocument();
    expect(navLangLink).not.toBeInTheDocument();
  });

  it('renders correctly when the nav is opened with a click', () => {
    const { getByTestId } = render(<Header />);
    const header = getByTestId('header');
    const navToggle = getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    const navLangLinkContainer = getByTestId('nav-lang-link-container');
    const navLangLink = getByTestId('nav-lang-link');
    expect(navLangLinkContainer).toBeInTheDocument();
    expect(navLangLink).toBeInTheDocument();
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

  it('submits search form with correct URL without tracking parameters', () => {
    render(<Header />);
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.click(searchToggle);

    const searchInput = screen.getByPlaceholderText(
      'How can we help you today?',
    );
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    const form = document.querySelector(
      '.t-header-search-form',
    ) as HTMLFormElement;
    fireEvent.submit(form);

    expect(globalThis.location.href).toBe(
      'https://www.moneyhelper.org.uk/en/search-results.html?q=test%20query',
    );
  });
});
