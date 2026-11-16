import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

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

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('does not render search when headerEndSlot is passed', () => {
    render(<Header headerEndSlot={<span>slot</span>} />);
    expect(screen.queryByTestId('search-toggle')).not.toBeInTheDocument();
  });

  it('renders headerEndSlot in the end cluster', () => {
    render(
      <Header showLanguageSwitcher={false} headerEndSlot={<span>slot</span>} />,
    );
    expect(screen.getByTestId('header-end-slot')).toBeInTheDocument();
  });
});
