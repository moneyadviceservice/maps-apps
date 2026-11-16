import { cleanup, render } from '@testing-library/react';

import { AdminHeader } from './AdminHeader';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const user = { name: 'Joe Blogs', email: 'email@domain.com' };

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly with user', () => {
    const { getByTestId } = render(
      <AdminHeader
        logoPath={'/logoPath'}
        assetPath={'http://localhost:3000'}
        user={user}
      />,
    );

    const accountNav = getByTestId('admin-nav');
    expect(accountNav).toBeInTheDocument();

    const header = getByTestId('admin-header');
    expect(header).toMatchSnapshot();
  });

  it('renders correctly with no user', () => {
    const { getByTestId, queryByTestId } = render(
      <AdminHeader
        logoPath={'/logoPath'}
        assetPath={'http://localhost:3000'}
      />,
    );

    const adminNav = queryByTestId('admin-nav');
    expect(adminNav).not.toBeInTheDocument();

    const header = getByTestId('admin-header');
    expect(header).toMatchSnapshot();
  });
});
