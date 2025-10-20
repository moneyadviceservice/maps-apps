import { render } from '@testing-library/react';

import { PageSectionLayout } from './PageSectionLayout';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('PageSectionLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <PageSectionLayout
        page={{
          title: 'test',
          seoTitle: 'test',
          seoDescription: 'test',
          sideNavigationLinks: [
            {
              linkTo: '/what-is-the-sfs/find-free-debt-advice',
              text: 'Find debt advice',
              description: null,
            },
          ],
          section: [
            {
              json: [
                {
                  nodeType: 'header',
                  style: 'h2',
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Who we are',
                    },
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
      ></PageSectionLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
