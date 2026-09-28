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

  it('renders correctly', () => {
    render(<SearchForm language="en" />);
    const searchForm = screen.getByTestId('search-form');
    expect(searchForm).toMatchSnapshot();
  });
});
