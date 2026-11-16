import { render } from '@testing-library/react';

import { AdminPageLayout } from './AdminPageLayout';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const siteConfig = {
  seoTitle: 'test',
  seoDescription: 'test',
  headerLogo: {
    image: {
      _path: '/test.png',
      width: 20,
      height: 20,
      mimeType: 'image/png',
    },
    altText: 'SFS Logo',
  },
};

const user = { name: 'Joe Blogs', email: 'email@domain.com' };

describe('BasePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <AdminPageLayout
        siteConfig={siteConfig}
        assetPath=""
        pageTitle="test"
        user={user}
      >
        test content
      </AdminPageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with crumbs', () => {
    const { getByTestId, getAllByText } = render(
      <AdminPageLayout
        siteConfig={siteConfig}
        assetPath=""
        pageTitle="test"
        user={user}
        crumbs={[{ label: 'crumb', link: '/slug' }]}
      >
        test content
      </AdminPageLayout>,
    );

    expect(getByTestId('breadcrumb-wrapper')).toBeInTheDocument();

    const crumb = getAllByText('crumb');
    expect(crumb[1]).toHaveAttribute('href', '/slug');
  });
});
