import { render, screen } from '@testing-library/react';

import { DocumentSections } from './DocumentSections';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('DocumentSections component', () => {
  it('renders correctly', () => {
    render(
      <DocumentSections
        sections={[
          {
            header: {
              id: 'test',
              text: 'testid',
            },
            json: [
              {
                nodeType: 'header',
                style: 'h2',
                content: [
                  {
                    nodeType: 'text',
                    value: 'testingheader',
                  },
                ],
              },
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'test',
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
