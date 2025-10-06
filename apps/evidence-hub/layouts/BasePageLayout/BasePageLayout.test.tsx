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
  mainNavigation: [{ linkTo: '/test', text: 'test', description: null }],
  footerLinks: [
    {
      title: 'test',
      childLinks: [
        { linkTo: '/test', text: 'test', description: null },
        { linkTo: '/test2', text: 'test2', description: null },
      ],
    },
  ],
};

describe('BasePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <BasePageLayout
        siteConfig={siteConfig}
        assetPath=""
        pageTitle="test"
        breadcrumbs={[]}
      >
        test content
      </BasePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
