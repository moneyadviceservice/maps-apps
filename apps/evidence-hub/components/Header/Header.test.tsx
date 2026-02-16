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
  headerLinks: [
    {
      linkTo: '/look-up-a-membership',
      text: 'Look up a membership',
      description: null,
    },
  ],
  navigation: [],
};

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(
      <Header
        logo={siteConfig.headerLogo}
        assetPath={'http://localhost:3000'}
        navigation={siteConfig.navigation}
      />,
    );
    const header = screen.getByTestId('header');
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav opened by a SPACE keypress', () => {
    render(
      <Header
        logo={siteConfig.headerLogo}
        assetPath={'http://localhost:3000'}
        navigation={siteConfig.navigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('toggle-nav');
    fireEvent.keyDown(navToggle, { key: ' ' });
    expect(header).toMatchSnapshot();
  });

  it('renders correctly when the nav is opened with a CLICK', () => {
    render(
      <Header
        logo={siteConfig.headerLogo}
        assetPath={'http://localhost:3000'}
        navigation={siteConfig.navigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('toggle-nav');
    fireEvent.click(navToggle);
    expect(header).toMatchSnapshot();
  });
});
