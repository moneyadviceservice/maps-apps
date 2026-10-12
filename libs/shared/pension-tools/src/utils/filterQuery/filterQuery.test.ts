import { ParsedUrlQuery } from 'querystring';

import { filterQuery } from './filterQuery';

describe('filterQuery', () => {
  it('should remove specified parameters from the query object', () => {
    const query: ParsedUrlQuery = { a: '1', b: '2', c: '3' };
    const filter = ['b', 'c'];

    const result = filterQuery(query, filter);

    expect(result).toEqual({ a: '1' });
  });

  it('should return the same query object if no parameters are filtered', () => {
    const query: ParsedUrlQuery = { a: '1', b: '2' };
    const filter: string[] = [];

    const result = filterQuery(query, filter);

    expect(result).toEqual({ a: '1', b: '2' });
  });

  it('should return an empty object if all parameters are filtered', () => {
    const query: ParsedUrlQuery = { a: '1', b: '2' };
    const filter = ['a', 'b'];

    const result = filterQuery(query, filter);

    expect(result).toEqual({});
  });

  it('should handle empty query object', () => {
    const query: ParsedUrlQuery = {};
    const filter = ['a'];

    const result = filterQuery(query, filter);

    expect(result).toEqual({});
  });

  it('should handle filtering a non-existing parameter', () => {
    const query: ParsedUrlQuery = { a: '1', b: '2' };
    const filter = ['c'];

    const result = filterQuery(query, filter);

    expect(result).toEqual({ a: '1', b: '2' });
  });
});
