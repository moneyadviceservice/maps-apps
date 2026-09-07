import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import NoResultsMessage from './NoResultsMessage';

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;

describe('NoResultsMessage', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReset();
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders the location-based message when no active filters', () => {
    const { container, getByText } = render(<NoResultsMessage />);
    expect(getByText(/no results that match your location/i)).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the shorter location-based message on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { getByText, queryByText } = render(<NoResultsMessage />);

    expect(
      getByText(/use the filters below to adjust your search\.$/i),
    ).toBeTruthy();
    expect(
      queryByText(/changing the distance to 10 miles/i),
    ).not.toBeInTheDocument();
  });

  it('renders the longer location-based message on desktop', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { getByText } = render(<NoResultsMessage />);

    expect(getByText(/changing the distance to 10 miles\./i)).toBeTruthy();
  });

  it('renders the filter-based message with reset link when hasActiveFilters is true', () => {
    const { container, getByRole } = render(
      <NoResultsMessage hasActiveFilters clearFiltersHref="/search" />,
    );
    expect(getByRole('link', { name: /reset all/i })).toHaveAttribute(
      'href',
      '/search',
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('defaults clearFiltersHref to /', () => {
    const { getByRole } = render(<NoResultsMessage hasActiveFilters />);
    expect(getByRole('link', { name: /reset all/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
