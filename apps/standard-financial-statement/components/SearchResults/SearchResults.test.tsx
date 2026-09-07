import { render, screen } from '@testing-library/react';

import { SearchResults } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('SearchResults component', () => {
  it('renders 0 results correctly', () => {
    render(
      <SearchResults
        searchResult={{
          results: [],
          minLength: false,
          excludedWords: false,
        }}
        searchText=""
      />,
    );
    const searchForm = screen.getByTestId('search-results');
    expect(searchForm).toMatchSnapshot();
  });

  it('renders 1 results correctly', () => {
    render(
      <SearchResults
        searchResult={{
          results: [
            {
              title: 'Test Title',
              description: 'Test Description',
              link: '/test-link',
            },
          ],
          minLength: false,
          excludedWords: false,
        }}
        searchText=""
      />,
    );
    const searchForm = screen.getByTestId('search-results');
    expect(searchForm).toMatchSnapshot();
  });

  it('renders 2 results correctly', () => {
    render(
      <SearchResults
        searchResult={{
          results: [
            {
              title: 'Test Title 1',
              description: 'Test Description 1',
              link: '/test-link-1',
            },
            {
              title: 'Test Title 2',
              description: 'Test Description 2',
              link: '/test-link-2',
            },
          ],
          minLength: false,
          excludedWords: false,
        }}
        searchText=""
      />,
    );
    const searchForm = screen.getByTestId('search-results');
    expect(searchForm).toMatchSnapshot();
  });

  it('renders error min length', () => {
    render(
      <SearchResults
        searchResult={{
          results: [],
          minLength: true,
          excludedWords: false,
        }}
        searchText="aa"
      />,
    );
    const searchForm = screen.getByTestId('search-results');
    expect(searchForm).toMatchSnapshot();
  });

  it('renders error excludedWords', () => {
    render(
      <SearchResults
        searchResult={{
          results: [],
          minLength: false,
          excludedWords: true,
        }}
        searchText="and"
      />,
    );
    const searchForm = screen.getByTestId('search-results');
    expect(searchForm).toMatchSnapshot();
  });
});
