import { render } from '@testing-library/react';

import { UseTheSfsLayout } from './UseTheSfsLayout';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const pageMock = {
  title: 'test',
  seoTitle: 'test',
  seoDescription: 'test',
  downloads: [
    {
      fileName: 'Download',
      asset: {
        size: 1000,
        _path: '/asset.pdf',
        type: 'document',
      },
    },
  ],
  loginMessage: {
    loginIntro: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value:
                'You must be logged in to view this page. Please log in or register.',
            },
          ],
        },
      ],
    },
  },
  breadcrumbs: [
    {
      linkTo: '/use-the-sfs',
      text: 'SFS',
      description: '',
    },
  ],
  navigationGroup: [
    {
      title: null,
      childLinks: [
        {
          text: 'Use the SFS',
          linkTo: '/use-the-sfs',
          description: null,
        },
      ],
    },
    {
      title: 'test',
      childLinks: [
        {
          text: 'test',
          linkTo: '/test',
          description: null,
        },
      ],
    },
  ],
  content: [
    {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value:
                'It provides a single format for financial statements, allowing the debt advice sector and creditors to work together to achieve the right outcomes for people struggling with their finances.',
            },
          ],
        },
      ],
    },
  ],
  authorisedIntroText: null,
  authorisedContent: null,
};

describe('UseTheSfsLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <UseTheSfsLayout
        page={pageMock}
        slug={[]}
        lang="en"
        url="http://localhost:3000/en/test"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders correctly auth page content', () => {
    const { container } = render(
      <UseTheSfsLayout
        auth={true}
        page={pageMock}
        assetBlob={[
          {
            name: 'en/test.pdf',
            url: '/test.pdf',
            order: 0,
            displayName: 'test.pdf',
            container: 'test',
            size: 1000,
            contentType: 'application/pdf',
          },
        ]}
        slug={[]}
        lang="en"
        url="http://localhost:3000/en/"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
