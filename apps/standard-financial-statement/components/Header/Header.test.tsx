import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Header } from '.';

import '@testing-library/jest-dom';

// Mock useAnalytics hook
const mockAddEvent = jest.fn();
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

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

const headerImage = {
  src: '/images/test.jpg',
  width: 118,
  height: 64,
};

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(
      <Header
        headerLogo={headerImage}
        headerLogoMobile={headerImage}
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
        headerLogo={headerImage}
        headerLogoMobile={headerImage}
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
        headerLogo={headerImage}
        headerLogoMobile={headerImage}
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
        headerLogo={headerImage}
        headerLogoMobile={headerImage}
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
        headerLogo={headerImage}
        headerLogoMobile={headerImage}
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

  describe('AccountLinks analytics', () => {
    it('triggers analytics event when login link is clicked', () => {
      render(
        <Header
          headerLogo={headerImage}
          headerLogoMobile={headerImage}
          accountLinks={siteConfig.accountLinks}
          headerLinks={siteConfig.headerLinks}
          mainNavigation={siteConfig.mainNavigation}
        />,
      );

      // Find and click the login link (get first one to avoid multiple elements error)
      const loginLinks = screen.getAllByText('Login');
      const loginLink = loginLinks[0];
      fireEvent.click(loginLink);

      // Verify analytics event was triggered with correct payload
      expect(mockAddEvent).toHaveBeenCalledWith({
        event: 'login',
        eventInfo: {
          linkText: 'Header Login',
          destinationURL: 'Entra Login',
        },
      });
    });

    it('does not trigger analytics event when register link is clicked', () => {
      render(
        <Header
          headerLogo={headerImage}
          headerLogoMobile={headerImage}
          accountLinks={siteConfig.accountLinks}
          headerLinks={siteConfig.headerLinks}
          mainNavigation={siteConfig.mainNavigation}
        />,
      );

      // Find and click the register link (get first one to avoid multiple elements error)
      const registerLinks = screen.getAllByText('Register');
      const registerLink = registerLinks[0];
      fireEvent.click(registerLink);

      // Verify analytics event was NOT triggered
      expect(mockAddEvent).not.toHaveBeenCalled();

      // Verify window.open was NOT called
      expect(mockWindowOpen).not.toHaveBeenCalled();
    });

    it('prevents default behavior only for login links', () => {
      render(
        <Header
          headerLogo={headerImage}
          headerLogoMobile={headerImage}
          accountLinks={siteConfig.accountLinks}
          headerLinks={siteConfig.headerLinks}
          mainNavigation={siteConfig.mainNavigation}
        />,
      );

      const loginLinks = screen.getAllByText('Login');
      const loginLink = loginLinks[0];
      const mockEvent = {
        preventDefault: jest.fn(),
        currentTarget: { href: 'http://localhost/api/auth/signin' },
      };

      // Simulate the click event with our mock
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: mockEvent.preventDefault,
      });
      Object.defineProperty(clickEvent, 'currentTarget', {
        value: mockEvent.currentTarget,
      });

      loginLink.dispatchEvent(clickEvent);

      // Verify preventDefault was called for login link
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('allows normal behavior for non-login links', () => {
      render(
        <Header
          headerLogo={headerImage}
          headerLogoMobile={headerImage}
          accountLinks={siteConfig.accountLinks}
          headerLinks={siteConfig.headerLinks}
          mainNavigation={siteConfig.mainNavigation}
        />,
      );

      const registerLinks = screen.getAllByText('Register');
      const registerLink = registerLinks[0];
      const mockEvent = {
        preventDefault: jest.fn(),
        currentTarget: { href: '/en/register' },
      };

      fireEvent.click(registerLink, mockEvent);

      // Verify preventDefault was NOT called for non-login link
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});
