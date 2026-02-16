import { cleanup, render, screen } from '@testing-library/react';

import { SearchForm } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SearchForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders with correct test ID and action URL', () => {
    render(<SearchForm language="en" />);
    const searchForm = screen.getByTestId('form-search');
    expect(searchForm).toBeInTheDocument();
    expect(searchForm).toHaveAttribute(
      'action',
      'https://maps.org.uk/en/search-results.html',
    );
  });

  it('renders with Welsh language action URL', () => {
    render(<SearchForm language="cy" />);
    const searchForm = screen.getByTestId('form-search');
    expect(searchForm).toHaveAttribute(
      'action',
      'https://maps.org.uk/cy/search-results.html',
    );
  });

  it('renders search input with correct attributes', () => {
    render(<SearchForm language="en" />);
    const searchInput = screen.getByRole('textbox', { name: /search/i });
    expect(searchInput).toHaveAttribute('id', 'q');
    expect(searchInput).toHaveAttribute('name', 'q');
    expect(searchInput).toBeRequired();
  });

  it('renders submit button with correct styling', () => {
    render(<SearchForm language="en" />);
    const submitButton = screen.getByRole('button', { name: /search/i });
    expect(submitButton).toHaveClass('bg-magenta-500', 'text-white');
  });
});
