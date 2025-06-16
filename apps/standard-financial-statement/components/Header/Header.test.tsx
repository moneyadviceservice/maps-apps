import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const siteConfig = {
  headerLogo: {
    image: {
      _path: '/content/dam/sfs/assets/logos/sfs-logo.png',
      width: 186,
      height: 101,
      mimeType: 'image/png',
    },
    altText: 'SFS Logo',
  },
  headerLogoMobile: {
    image: {
      _path: '/content/dam/sfs/assets/logos/sfs-logo.png',
      width: 186,
      height: 101,
      mimeType: 'image/png',
    },
    altText: 'SFS Logo',
  },
  headerLinks: [
    {
      linkTo: '/look-up-a-membership',
      text: 'Look up a membership',
      description: null,
    },
  ],
  accountLinks: [
    { linkTo: '/login', text: 'Login', description: null },
    { linkTo: '/register', text: 'Register', description: null },
  ],
  mainNavigation: [
    { linkTo: '/', text: 'Home', description: null },
    {
      linkTo: '/what-is-the-standard-financial-statement',
      text: 'What is the SFS?',
      description: null,
    },
    { linkTo: '/use-the-sfs', text: 'Use the SFS', description: null },
    {
      linkTo: '/apply-to-use-the-sfs',
      text: 'Apply to use SFS',
      description: null,
    },
    { linkTo: '/contact-us', text: 'Contact Us ', description: null },
  ],
};

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(
      <Header
        logoPath={'/logoPath'}
        logoPathMobile={'/logoPathMobile'}
        assetPath={'http://localhost:3000'}
        accountLinks={siteConfig.accountLinks}
        headerLinks={siteConfig.headerLinks}
        mainNavigation={siteConfig.mainNavigation}
      />,
    );
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened by a Space keypress', () => {
    render(
      <Header
        logoPath={'/logoPath'}
        logoPathMobile={'/logoPathMobile'}
        assetPath={'http://localhost:3000'}
        accountLinks={siteConfig.accountLinks}
        headerLinks={siteConfig.headerLinks}
        mainNavigation={siteConfig.mainNavigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.keyDown(navToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened with a click', () => {
    render(
      <Header
        logoPath={'/logoPath'}
        logoPathMobile={'/logoPathMobile'}
        assetPath={'http://localhost:3000'}
        accountLinks={siteConfig.accountLinks}
        headerLinks={siteConfig.headerLinks}
        mainNavigation={siteConfig.mainNavigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('nav-toggle');
    fireEvent.click(navToggle);
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the search is opened by a Space keypress', () => {
    render(
      <Header
        logoPath={'/logoPath'}
        logoPathMobile={'/logoPathMobile'}
        assetPath={'http://localhost:3000'}
        accountLinks={siteConfig.accountLinks}
        headerLinks={siteConfig.headerLinks}
        mainNavigation={siteConfig.mainNavigation}
      />,
    );
    const header = screen.getByTestId('header');
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.keyDown(searchToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened with a click', () => {
    render(
      <Header
        logoPath={'/logoPath'}
        logoPathMobile={'/logoPathMobile'}
        assetPath={'http://localhost:3000'}
        accountLinks={siteConfig.accountLinks}
        headerLinks={siteConfig.headerLinks}
        mainNavigation={siteConfig.mainNavigation}
      />,
    );
    const header = screen.getByTestId('header');
    const searchToggle = screen.getByTestId('search-toggle');
    fireEvent.click(searchToggle);
    expect(header).toMatchSnapshot();
  });
});
