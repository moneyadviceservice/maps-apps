import { tabQueryTransformer } from './tabQueryTransformer';

describe('tabQueryTransformer', () => {
  const dataPrefix = /^q-/;
  const dataReplace = /^q-/;

  it('should transform query correctly', () => {
    const query = {
      'q-field1': '10,000',
      'q-field2': ['20,000', '30,000'],
      field3: '40,000',
      other: '50,000',
    };
    const expectedResult = {
      field1: '10000',
      field2: ['20000', '30000'],
    };
    const result = tabQueryTransformer(query, dataPrefix, dataReplace);
    expect(result).toEqual(expectedResult);
  });

  it('should handle empty query', () => {
    const query = {};
    const expectedResult = {};
    const result = tabQueryTransformer(query, dataPrefix, dataReplace);
    expect(result).toEqual(expectedResult);
  });

  it('should handle query with no matching keys', () => {
    const query = {
      field1: '10,000',
      field2: '20,000',
    };
    const expectedResult = {};
    const result = tabQueryTransformer(query, dataPrefix, dataReplace);
    expect(result).toEqual(expectedResult);
  });

  it('should handle query with undefined values', () => {
    const query = {
      'q-field1': undefined,
      'q-field2': '20,000',
    };
    const expectedResult = {
      field2: '20000',
    };
    const result = tabQueryTransformer(query, dataPrefix, dataReplace);
    expect(result).toEqual(expectedResult);
  });
});
