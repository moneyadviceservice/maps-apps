import { buildPageHref } from './buildPageHref';

describe('buildPageHref', () => {
  it('should cleanly inject the "p" parameter when query object is completely empty', () => {
    const query = {};
    const href = buildPageHref(query, '3');
    expect(href).toBe('?p=3');
  });

  it('should preserve existing query parameters while updating or adding the "p" parameter', () => {
    const query = { filter: 'active', sortBy: 'date' };
    const href = buildPageHref(query, '2');
    expect(href).toBe('?filter=active&sortBy=date&p=2');
  });

  it('should overwrite the existing "p" parameter if it already exists in the query object', () => {
    const query = { p: '1', search: 'test' };
    const href = buildPageHref(query, '5');
    expect(href).toBe('?p=5&search=test');
  });

  it('should properly stringify array values inside the query parameters', () => {
    const query = { categories: ['books', 'movies'], p: '2' };
    const href = buildPageHref(query, '3');
    // Array converts to "books,movies" through template string evaluation behavior
    expect(href).toBe('?categories=books,movies&p=3');
  });
});
