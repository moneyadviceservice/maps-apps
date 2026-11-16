import { render, screen } from '@testing-library/react';

import { SectionPageWithLinks } from './SectionPageWithLinks';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SectionPageWithLinks component', () => {
  it('renders correctly', () => {
    render(
      <SectionPageWithLinks
        sections={[
          {
            header: {
              id: 'test',
              text: 'test',
            },
            json: [
              {
                nodeType: 'header',
                style: 'h2',
                content: [
                  {
                    nodeType: 'text',
                    value: 'test',
                  },
                ],
              },
              {
                nodeType: 'table',
                content: [
                  {
                    nodeType: 'table-body',
                    content: [
                      {
                        nodeType: 'table-row',
                        content: [
                          {
                            nodeType: 'table-head',
                            content: [
                              {
                                nodeType: 'text',
                                value: 'Browser',
                              },
                            ],
                          },
                          {
                            nodeType: 'table-head',
                            content: [
                              {
                                nodeType: 'text',
                                value: 'Guidance',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        nodeType: 'table-row',
                        content: [
                          {
                            nodeType: 'table-data',
                            content: [
                              {
                                nodeType: 'text',
                                value: 'Internet Explorer',
                              },
                            ],
                          },
                          {
                            nodeType: 'table-data',
                            content: [
                              {
                                nodeType: 'link',
                                data: {
                                  href: 'https://support.microsoft.com/en-gb/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc',
                                },
                                value:
                                  'Microsoft help – How to delete cookie files in Internet Explorer',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        nodeType: 'table-row',
                        content: [
                          {
                            nodeType: 'table-data',
                            content: [
                              {
                                nodeType: 'text',
                                value: 'Chrome',
                              },
                            ],
                          },
                          {
                            nodeType: 'table-data',
                            content: [
                              {
                                nodeType: 'text',
                                value: 'Chrome help – Manage cookies',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );
    const searchForm = screen.getByTestId('section');
    expect(searchForm).toMatchSnapshot();
  });
});
