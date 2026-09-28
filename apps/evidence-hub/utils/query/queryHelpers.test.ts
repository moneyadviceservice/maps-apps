import {
  buildQueryWithDefaults,
  determineDefaultOrder,
  extractKeyword,
  getQueryValue,
  hasKeyword,
  normalizeToString,
  parseQueryParam,
  QueryParams,
} from './queryHelpers';

import '@testing-library/jest-dom';

describe('queryHelpers', () => {
  describe('parseQueryParam', () => {
    it.each([
      { input: undefined, description: 'undefined' },
      { input: '', description: 'empty string' },
      { input: '   ,  ,  ', description: 'whitespace-only string' },
    ])('should return empty array for $description', ({ input }) => {
      const result = parseQueryParam(input);

      expect(result).toEqual([]);
    });

    it('should parse string value into array', () => {
      const result = parseQueryParam('pensions,savings,debt');

      expect(result).toEqual(['pensions', 'savings', 'debt']);
    });

    it('should trim whitespace from values', () => {
      const result = parseQueryParam('pensions , savings , debt');

      expect(result).toEqual(['pensions', 'savings', 'debt']);
    });

    it('should filter out empty values', () => {
      const result = parseQueryParam('pensions,,savings,  ,debt');

      expect(result).toEqual(['pensions', 'savings', 'debt']);
    });

    it('should handle array value', () => {
      const result = parseQueryParam(['pensions', 'savings', 'debt']);

      expect(result).toEqual(['pensions', 'savings', 'debt']);
    });

    it('should trim and filter array values', () => {
      const result = parseQueryParam([' pensions ', ' savings ', '', 'debt']);

      expect(result).toEqual(['pensions', 'savings', 'debt']);
    });

    it('should convert non-string array values to strings', () => {
      const result = parseQueryParam([123, 456, 'test'] as unknown as string[]);

      expect(result).toEqual(['123', '456', 'test']);
    });
  });

  describe('normalizeToString', () => {
    it('should return trimmed string for string input', () => {
      const result = normalizeToString('  test value  ');

      expect(result).toBe('test value');
    });

    it('should return first value from array', () => {
      const result = normalizeToString(['first', 'second', 'third']);

      expect(result).toBe('first');
    });

    it('should trim first array value', () => {
      const result = normalizeToString(['  first  ', 'second']);

      expect(result).toBe('first');
    });

    it.each([
      { input: undefined, description: 'undefined' },
      { input: [], description: 'empty array' },
      { input: [''], description: 'array with empty string' },
    ])('should return empty string for $description', ({ input }) => {
      const result = normalizeToString(input);

      expect(result).toBe('');
    });

    it('should handle array with non-string first value', () => {
      const result = normalizeToString([123, 'test'] as unknown as string[]);

      expect(result).toBe('123');
    });
  });

  describe('getQueryValue', () => {
    it('should return value for direct key', () => {
      const query: QueryParams = { topic: 'pensions' };

      const result = getQueryValue(query, 'topic');

      expect(result).toBe('pensions');
    });

    it('should return value for encoded key', () => {
      const query: QueryParams = { 'topic%5B%5D': 'pensions' };

      const result = getQueryValue(query, 'topic');

      expect(result).toBe('pensions');
    });

    it('should return value for bracket notation key', () => {
      const query: QueryParams = { 'topic[]': 'pensions' };

      const result = getQueryValue(query, 'topic');

      expect(result).toBe('pensions');
    });

    it('should return value for decoded encoded key', () => {
      const query: QueryParams = { 'topic[]': 'pensions' };

      const result = getQueryValue(query, 'topic');

      expect(result).toBe('pensions');
    });

    it('should return undefined if key not found', () => {
      const query: QueryParams = { other: 'value' };

      const result = getQueryValue(query, 'topic');

      expect(result).toBeUndefined();
    });

    it('should prioritize direct key over encoded keys', () => {
      const query: QueryParams = {
        topic: 'direct',
        'topic%5B%5D': 'encoded',
        'topic[]': 'brackets',
      };

      const result = getQueryValue(query, 'topic');

      expect(result).toBe('direct');
    });
  });

  describe('determineDefaultOrder', () => {
    it('should return undefined when no keyword and no order', () => {
      const result = determineDefaultOrder(undefined, undefined);

      expect(result).toBeUndefined();
    });

    it('should return order when valid order provided', () => {
      const result = determineDefaultOrder(undefined, 'published');

      expect(result).toBe('published');
    });

    it('should return relevance when keyword exists but no order', () => {
      const result = determineDefaultOrder('test keyword', undefined);

      expect(result).toBe('relevance');
    });

    it('should return order when both keyword and order provided', () => {
      const result = determineDefaultOrder('test keyword', 'updated');

      expect(result).toBe('updated');
    });

    it('should trim keyword whitespace', () => {
      const result = determineDefaultOrder('  test keyword  ', undefined);

      expect(result).toBe('relevance');
    });

    it('should trim order whitespace', () => {
      const result = determineDefaultOrder(undefined, '  published  ');

      expect(result).toBe('published');
    });

    it.each([
      { order: '', description: 'empty string order' },
      { order: '   ', description: 'whitespace-only order' },
      { order: 'invalid-order', description: 'invalid order value' },
    ])('should return undefined for $description', ({ order }) => {
      const result = determineDefaultOrder(undefined, order);

      expect(result).toBeUndefined();
    });

    it.each([
      { keyword: '', description: 'empty keyword string' },
      { keyword: '   ', description: 'whitespace-only keyword' },
    ])('should not return relevance for $description', ({ keyword }) => {
      const result = determineDefaultOrder(keyword, undefined);

      expect(result).toBeUndefined();
    });

    it('should handle all valid order values', () => {
      expect(determineDefaultOrder(undefined, 'relevance')).toBe('relevance');
      expect(determineDefaultOrder(undefined, 'published')).toBe('published');
      expect(determineDefaultOrder(undefined, 'updated')).toBe('updated');
    });
  });

  describe('buildQueryWithDefaults', () => {
    it('should return query unchanged when no keyword', () => {
      const query: QueryParams = { topic: 'pensions' };

      const result = buildQueryWithDefaults(query);

      expect(result).toEqual(query);
    });

    it('should add default order when keyword exists but no order', () => {
      const query: QueryParams = { keyword: 'test' };

      const result = buildQueryWithDefaults(query);

      expect(result.order).toBe('relevance');
    });

    it('should not override existing order', () => {
      const query: QueryParams = { keyword: 'test', order: 'published' };

      const result = buildQueryWithDefaults(query);

      expect(result.order).toBe('published');
    });

    it('should trim keyword whitespace', () => {
      const query: QueryParams = { keyword: '  test  ' };

      const result = buildQueryWithDefaults(query);

      expect(result.order).toBe('relevance');
    });

    it.each([
      { keyword: '', description: 'empty keyword' },
      { keyword: '   ', description: 'whitespace-only keyword' },
    ])('should not add order for $description', ({ keyword }) => {
      const query: QueryParams = { keyword };
      const result = buildQueryWithDefaults(query);

      expect(result.order).toBeUndefined();
    });

    it('should preserve all query parameters', () => {
      const query: QueryParams = {
        keyword: 'test',
        topic: 'pensions',
        clientGroup: ['adult'],
      };

      const result = buildQueryWithDefaults(query);

      expect(result.topic).toBe('pensions');
      expect(result.clientGroup).toEqual(['adult']);
    });

    it('should handle empty query', () => {
      const query: QueryParams = {};

      const result = buildQueryWithDefaults(query);

      expect(result).toEqual({});
    });
  });

  describe('extractKeyword', () => {
    it('should return trimmed keyword for string value', () => {
      const query: QueryParams = { keyword: '  test search  ' };

      const result = extractKeyword(query);

      expect(result).toBe('test search');
    });

    it.each([
      { keyword: '', description: 'empty string' },
      { keyword: '   ', description: 'whitespace-only string' },
    ])('should return undefined for $description', ({ keyword }) => {
      const query: QueryParams = { keyword };
      const result = extractKeyword(query);

      expect(result).toBeUndefined();
    });

    it('should return undefined when keyword not present', () => {
      const query: QueryParams = { topic: 'pensions' };

      const result = extractKeyword(query);

      expect(result).toBeUndefined();
    });

    it('should return undefined for array keyword', () => {
      const query: QueryParams = { keyword: ['test'] };

      const result = extractKeyword(query);

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty query', () => {
      const query: QueryParams = {};

      const result = extractKeyword(query);

      expect(result).toBeUndefined();
    });
  });

  describe('hasKeyword', () => {
    it('should return true when keyword exists', () => {
      const query: QueryParams = { keyword: 'test' };

      const result = hasKeyword(query);

      expect(result).toBe(true);
    });

    it.each([
      { keyword: '', description: 'empty string' },
      { keyword: '   ', description: 'whitespace-only string' },
    ])('should return false when keyword is $description', ({ keyword }) => {
      const query: QueryParams = { keyword };
      const result = hasKeyword(query);

      expect(result).toBe(false);
    });

    it('should return false when keyword not present', () => {
      const query: QueryParams = { topic: 'pensions' };

      const result = hasKeyword(query);

      expect(result).toBe(false);
    });

    it('should return false for empty query', () => {
      const query: QueryParams = {};

      const result = hasKeyword(query);

      expect(result).toBe(false);
    });
  });
});
