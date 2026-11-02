import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { Header } from '.';
import { headerLogoMock, headerNavigationMock } from './headerMocks';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

const siteConfig = {
  headerLogo: headerLogoMock,
  navigation: headerNavigationMock,
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

  it('renders correctly when the nav opened by a SPACE keypress', async () => {
    render(
      <Header
        logo={siteConfig.headerLogo}
        assetPath={'http://localhost:3000'}
        navigation={siteConfig.navigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('toggle-nav');
    await waitFor(() => {
      fireEvent.keyDown(navToggle, { key: ' ' });
      expect(header).toMatchSnapshot();
    });
  });

  it('renders correctly when the nav is opened with a CLICK', async () => {
    render(
      <Header
        logo={siteConfig.headerLogo}
        assetPath={'http://localhost:3000'}
        navigation={siteConfig.navigation}
      />,
    );
    const header = screen.getByTestId('header');
    const navToggle = screen.getByTestId('toggle-nav');
    await waitFor(() => {
      fireEvent.click(navToggle);
      expect(header).toMatchSnapshot();
    });
  });
});
