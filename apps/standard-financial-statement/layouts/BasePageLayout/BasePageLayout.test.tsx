import { render } from '@testing-library/react';

import { BasePageLayout } from '.';

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
  headerLogoMobile: {
    image: {
      _path: '/test.png',
      width: 20,
      height: 20,
      mimeType: 'image/png',
    },
    altText: 'SFS Logo',
  },
  headerLinks: [
    {
      linkTo: '/test',
      text: 'test',
      description: null,
    },
  ],
  accountLinks: [{ linkTo: '/test', text: 'test', description: null }],
  mainNavigation: [{ linkTo: '/test', text: 'test', description: null }],
  footerLogo: {
    image: {
      _path: '/test',
      width: 10,
      height: 10,
      mimeType: 'image/png',
    },
    altText: 'test',
  },
  footerLinks: [{ linkTo: '/test', text: 'test', description: null }],
};

describe('BasePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <BasePageLayout
        siteConfig={siteConfig}
        assetPath=""
        pageTitle="test"
        breadcrumbs={[]}
        lang="en"
        slug={['/test']}
      >
        test content
      </BasePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
