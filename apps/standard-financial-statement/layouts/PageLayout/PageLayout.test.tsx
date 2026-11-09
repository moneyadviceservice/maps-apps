import { render } from '@testing-library/react';

import { PageLayout } from './PageLayout';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('PageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PageLayout
        assetPath=""
        page={{
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
          embed: {
            url: {
              en: 'https://debt-advice-locator.moneyhelper.org.uk/en/question-1?isEmbedded=true',
              cy: 'https://debt-advice-locator.moneyhelper.org.uk/cy/question-1?isEmbedded=true',
            },
            api: 'https://debt-advice-locator.moneyhelper.org.uk/api/embed',
            id: 'debt-advice-locator',
          },
          introText: {
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Intro text',
                  },
                ],
              },
            ],
          },
          sideNavigationLinks: [
            {
              linkTo: '/what-is-the-sfs/find-free-debt-advice',
              text: 'Find debt advice',
              description: null,
            },
          ],
          governanceList: [
            {
              link: {
                linkTo: '/what-is-the-sfs/find-free-debt-advice',
                text: 'Find debt advice',
                description: null,
              },
              governanceLogo: {
                altText: 'test',
                image: {
                  _path: '/content/dam/sfs/assets/logos/sfs-logo.png',
                  width: 186,
                  height: 101,
                  mimeType: 'image/png',
                },
              },
            },
          ],
          content: [
            {
              json: [
                {
                  nodeType: 'header',
                  style: 'h2',
                  content: [
                    { nodeType: 'text', value: 'Who created the SFS?' },
                  ],
                },
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
        }}
        slug={[]}
        lang="en"
        url="http://localhost:3000/en/test"
      ></PageLayout>,
    );

    expect(container).toMatchSnapshot();
  });
});
