import { createFormData } from 'utils/fetch/__mocks__/testUtils';

import { buildFormDataFromQuery, convertFormDataToObject } from './formHelpers';

import '@testing-library/jest-dom';

describe('formHelpers', () => {
  describe('convertFormDataToObject', () => {
    // Helper to reduce duplication
    const testFormDataConversion = (
      entries: Array<[string, string]>,
      expected: Record<string, string | string[]>,
    ) => {
      const formData = createFormData(entries);
      const result = convertFormDataToObject(formData);
      expect(result).toEqual(expected);
    };

    it('should convert FormData with single values', () => {
      testFormDataConversion(
        [
          ['keyword', 'test search'],
          ['topic', 'pensions'],
        ],
        {
          keyword: 'test search',
          topic: 'pensions',
        },
      );
    });

    it('should convert FormData with duplicate keys to array', () => {
      testFormDataConversion(
        [
          ['topic', 'pensions'],
          ['topic', 'savings'],
        ],
        {
          topic: ['pensions', 'savings'],
        },
      );
    });

    it('should convert existing single value to array when duplicate key added', () => {
      const formData = createFormData([['topic', 'pensions']]);
      // Simulate the conversion happening incrementally
      const intermediate = convertFormDataToObject(formData);
      expect(intermediate.topic).toBe('pensions');

      // Add another value with same key
      formData.append('topic', 'savings');
      const result = convertFormDataToObject(formData);

      expect(result).toEqual({
        topic: ['pensions', 'savings'],
      });
    });

    it('should handle empty FormData', () => {
      const formData = new FormData();

      const result = convertFormDataToObject(formData);

      expect(result).toEqual({});
    });

    it('should handle FormData with empty string values', () => {
      testFormDataConversion(
        [
          ['keyword', ''],
          ['topic', 'pensions'],
        ],
        {
          keyword: '',
          topic: 'pensions',
        },
      );
    });

    it('should handle multiple duplicate keys', () => {
      testFormDataConversion(
        [
          ['topic', 'pensions'],
          ['topic', 'savings'],
          ['topic', 'debt'],
          ['clientGroup', 'adult'],
          ['clientGroup', 'children'],
        ],
        {
          topic: ['pensions', 'savings', 'debt'],
          clientGroup: ['adult', 'children'],
        },
      );
    });

    it('should only process string values', () => {
      const formData = createFormData([['keyword', 'test']]);
      // FormData only accepts strings, but test the logic
      const result = convertFormDataToObject(formData);

      expect(result.keyword).toBe('test');
    });
  });

  describe('buildFormDataFromQuery', () => {
    it('should convert query with string values', () => {
      const query = {
        keyword: 'test search',
        topic: 'pensions',
        order: 'published',
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test search',
        topic: 'pensions',
        order: 'published',
      });
    });

    it('should convert query with array values using first value', () => {
      const query = {
        keyword: 'test',
        topic: ['pensions', 'savings'],
        clientGroup: ['adult', 'children'],
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test',
        topic: 'pensions',
        clientGroup: 'adult',
      });
    });

    it('should handle empty array values', () => {
      const query = {
        keyword: 'test',
        topic: [],
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test',
        topic: '',
      });
    });

    it('should handle empty query', () => {
      const query = {};

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({});
    });

    it('should handle query with undefined values', () => {
      const query = {
        keyword: 'test',
        topic: undefined,
        order: 'published',
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test',
        order: 'published',
      });
    });

    it('should handle query with mixed string and array values', () => {
      const query = {
        keyword: 'test',
        topic: 'pensions',
        clientGroup: ['adult', 'children'],
        order: 'published',
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test',
        topic: 'pensions',
        clientGroup: 'adult',
        order: 'published',
      });
    });

    it('should skip non-string and non-array values', () => {
      const query = {
        keyword: 'test',
        number: 123,
        boolean: true,
        nullValue: null,
      } as unknown as Record<string, string | string[]>;

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        keyword: 'test',
      });
    });

    it('should handle array with empty string as first value', () => {
      const query = {
        topic: ['', 'pensions'],
      };

      const result = buildFormDataFromQuery(query);

      expect(result).toEqual({
        topic: '',
      });
    });
  });
});
