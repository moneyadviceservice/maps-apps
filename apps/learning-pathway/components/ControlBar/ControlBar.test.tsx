import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailsPagesListModel } from 'lib/types/site.type';
import ControlBar from './ControlBar';

// Mock dependencies
jest.mock('components/SortBar', () => {
  return function MockSortBar() {
    return <div data-testid="sort-bar">Sort Bar</div>;
  };
});

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'learning-pathway-list.documentsNumberText': 'documents',
        'learning-pathway-list.cardsPerPageDropdown': 'Cards per page:',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ControlBar', () => {
  const mockOnCardsPerPageChange = jest.fn();

  const defaultProps = {
    total: 3,
    order: 'titleAZ' as const,
    orderList: ['titleAZ', 'relevance', 'titleZA'] as const,
    limit: '10',
    onCardsPerPageChange: mockOnCardsPerPageChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    const { container } = render(<ControlBar {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('should display the correct number of cards', () => {
    render(<ControlBar {...defaultProps} />);
    expect(screen.getByText(/^3/)).toBeInTheDocument();
  });

  it('should render the cards per page dropdown', () => {
    render(<ControlBar {...defaultProps} />);
    const select = screen.getByTestId('cards-per-page-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('name', 'limit');
  });

  it('should set the correct default value for cards per page', () => {
    render(<ControlBar {...defaultProps} limit="20" />);
    const select = screen.getByTestId(
      'cards-per-page-select',
    ) as HTMLSelectElement;
    expect(select.value).toBe('20');
  });

  it('should render the sort bar component', () => {
    render(<ControlBar {...defaultProps} />);
    expect(screen.getByTestId('sort-bar')).toBeInTheDocument();
  });

  it('should call onCardsPerPageChange when select value changes', async () => {
    const user = userEvent.setup();
    render(<ControlBar {...defaultProps} />);

    const select = screen.getByTestId('cards-per-page-select');
    await user.selectOptions(select, '20');

    expect(mockOnCardsPerPageChange).toHaveBeenCalled();
  });

  it('should display "Cards per page:" label', () => {
    render(<ControlBar {...defaultProps} />);
    expect(screen.getByText('Cards per page:')).toBeInTheDocument();
  });

  it('should handle different limit values', () => {
    const { rerender } = render(<ControlBar {...defaultProps} limit="10" />);
    const select = screen.getByTestId(
      'cards-per-page-select',
    ) as HTMLSelectElement;
    expect(select.value).toBe('10');

    rerender(<ControlBar {...defaultProps} limit="50" />);
    expect(select.value).toBe('50');
  });
});
