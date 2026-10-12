import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import DocumentCard from './DocumentCard';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

describe('DocumentCard', () => {
  const details = {
    pageTitle: 'Test document title',
    slug: 'test-slug',
    dateLaunched: '2025-03-04T17:29:00.000Z',
    owner: 'Test owner',
    overview: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'Mock overview content',
            },
          ],
        },
      ],
    },
    pageTags: [
      {
        tagCategory: {
          categoryKey: 'type-of-learning',
          categoryTitleCy: 'Welsh Category One',
          categoryTitleEn: 'Category One',
          slug: 'type-of-learning',
          order: 1,
        },
        titleEn: 'Tag item one',
        titleCy: 'Tag item one cy',
        value: 'tag-item-one',
      },
      {
        tagCategory: {
          categoryKey: 'type-of-learning',
          categoryTitleCy: 'Welsh Category One',
          categoryTitleEn: 'Category One',
          slug: 'type-of-learning',
          order: 1,
        },
        titleEn: 'Tag item two',
        titleCy: 'Tag item two cy',
        value: 'tag-item-two',
      },
      {
        tagCategory: {
          categoryKey: 'country',
          categoryTitleCy: 'Welsh Category Two',
          categoryTitleEn: 'Category Two',
          slug: 'country',
          order: 2,
        },
        titleEn: 'Tag item one',
        titleCy: 'Tag item one cy',
        value: 'country-tag-item-one',
      },
    ],
  };

  it('renders the document card contents correctly', () => {
    const { container } = render(<DocumentCard details={details} />);

    expect(screen.getByText('04/3/2025')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
