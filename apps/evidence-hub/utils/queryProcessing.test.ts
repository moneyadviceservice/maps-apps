import {
  convertGroupedParamsToQuery,
  extractPaginationParams,
  getCleanKey,
  processFilterQuery,
  QueryParams,
} from './queryProcessing';

describe('queryProcessing', () => {
  describe('getCleanKey', () => {
    it('should remove [] suffix from key', () => {
      expect(getCleanKey('countryOfDelivery[]', 'countryOfDelivery[]')).toBe(
        'countryOfDelivery',
      );
    });

    it('should remove %5B%5D from key', () => {
      expect(getCleanKey('pageType%5B%5D', 'pageType%5B%5D')).toBe('pageType');
    });

    it('should return original key if no array notation', () => {
      expect(getCleanKey('keyword', 'keyword')).toBe('keyword');
    });
  });

  describe('convertGroupedParamsToQuery', () => {
    it('should convert grouped parameters to query object', () => {
      const groupedParams = {
        topic: ['savings', 'debt'],
        keyword: ['test'],
      };

      const result = convertGroupedParamsToQuery(groupedParams);

      expect(result).toEqual({
        topic: 'savings,debt',
        keyword: 'test',
      });
    });

    it('should remove duplicates and empty values', () => {
      const groupedParams = {
        topic: ['savings', 'debt', 'savings', '', 'investment'],
        keyword: ['', 'test', ''],
      };

      const result = convertGroupedParamsToQuery(groupedParams);

      expect(result).toEqual({
        topic: 'savings,debt,investment',
        keyword: 'test',
      });
    });

    it('should handle empty grouped params', () => {
      const result = convertGroupedParamsToQuery({});
      expect(result).toEqual({});
    });
  });

  describe('processFilterQuery', () => {
    it('should process simple query parameters', () => {
      const rawQuery: QueryParams = {
        keyword: 'test',
        year: '2023',
      };

      const result = processFilterQuery(rawQuery);

      expect(result).toEqual({
        keyword: 'test',
        year: '2023',
      });
    });

    it('should handle array parameters', () => {
      const rawQuery: QueryParams = {
        'topic[]': ['savings', 'debt'],
        'countryOfDelivery%5B%5D': ['UK', 'US'],
        keyword: 'test',
      };

      const result = processFilterQuery(rawQuery);

      expect(result).toEqual({
        topic: 'savings,debt',
        countryOfDelivery: 'UK,US',
        keyword: 'test',
      });
    });

    it('should handle duplicate keys with different array notations', () => {
      const rawQuery: QueryParams = {
        'topic[]': ['savings'],
        'topic%5B%5D': ['debt'],
        topic: 'investment',
      };

      const result = processFilterQuery(rawQuery);

      expect(result).toEqual({
        topic: 'savings,debt,investment',
      });
    });

    it('should handle mixed array and string values', () => {
      const rawQuery: QueryParams = {
        topic: ['savings', 'debt'],
        keyword: 'test',
        year: '2023',
      };

      const result = processFilterQuery(rawQuery);

      expect(result).toEqual({
        topic: 'savings,debt',
        keyword: 'test',
        year: '2023',
      });
    });

    it('should handle empty and undefined values', () => {
      const rawQuery: QueryParams = {
        topic: ['savings', '', 'debt'],
        keyword: undefined,
        year: '',
        empty: [],
      };

      const result = processFilterQuery(rawQuery);

      expect(result).toEqual({
        topic: 'savings,debt',
      });
    });
  });

  describe('extractPaginationParams', () => {
    it('should extract valid pagination parameters', () => {
      const query: QueryParams = {
        p: '2',
        limit: '20',
      };

      const result = extractPaginationParams(query);

      expect(result).toEqual({
        page: 2,
        limit: 20,
      });
    });

    it('should use default values for missing parameters', () => {
      const query: QueryParams = {};

      const result = extractPaginationParams(query);

      expect(result).toEqual({
        page: 1,
        limit: 10,
      });
    });

    it('should enforce maximum limit', () => {
      const query: QueryParams = {
        page: '1',
        limit: '200',
      };

      const result = extractPaginationParams(query);

      expect(result).toEqual({
        page: 1,
        limit: 100,
      });
    });
  });
});
