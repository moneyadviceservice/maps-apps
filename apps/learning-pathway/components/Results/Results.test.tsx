import { render, screen } from '@testing-library/react';

import Results from './Results';
import { mockPageDetails } from 'lib/mocks/mockPageDetails';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/[language]/learning-pathway',
    query: { language: 'en' },
    asPath: '/en/learning-pathway',
    isReady: true,
  }),
}));

jest.mock('components/EmptyResults/EmptyResults', () => {
  return function MockEmptyResults() {
    return <div data-testid="empty-results">No results found</div>;
  };
});

describe('Results', () => {
  const mockCards = mockPageDetails.items;

  const defaultProps = {
    sortedCards: mockCards,
    page: 1,
    totalPages: 1,
    startIndex: 1,
    endIndex: 3,
    totalItems: 3,
  };

  it('should render component corretly (Snapshot)', () => {
    const { container } = render(<Results {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should render all document cards when results exist', () => {
    render(<Results {...defaultProps} />);

    mockCards.forEach((card) => {
      expect(
        screen.getByTestId(`document-card-${card.slug}`),
      ).toBeInTheDocument();
      expect(screen.getByText(card.pageTitle)).toBeInTheDocument();
    });
  });

  it('should render pagination component with correct props', () => {
    const props = {
      ...defaultProps,
      totalPages: 2,
      startIndex: 1,
      endIndex: 2,
    };
    render(<Results {...props} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should render empty results when no cards provided', () => {
    render(<Results {...defaultProps} sortedCards={[]} totalItems={0} />);

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should not render document cards when sorted cards is empty', () => {
    render(<Results {...defaultProps} sortedCards={[]} totalItems={0} />);

    mockCards.forEach((card) => {
      expect(
        screen.queryByTestId(`document-card-${card.slug}`),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle single card result', () => {
    const singleCard = [mockCards[0]];
    render(
      <Results
        {...defaultProps}
        sortedCards={singleCard}
        totalItems={1}
        endIndex={1}
      />,
    );

    expect(
      screen.getByTestId(`document-card-${singleCard[0].slug}`),
    ).toBeInTheDocument();
    expect(screen.getByText(singleCard[0].pageTitle)).toBeInTheDocument();
  });

  it('should handle empty array gracefully', () => {
    const { container } = render(
      <Results {...defaultProps} sortedCards={[]} totalItems={0} />,
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
  });
});
