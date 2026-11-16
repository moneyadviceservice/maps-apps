import { CHECK_ANSWERS_PAGE } from './constants';
import {
  getSingleQueryParam,
  getNextPagePath,
  buildRedirectUrl,
  transformData,
  buildQueryString,
  cleanData,
  parseOldData,
  buildData,
  checkAnswersNavRules,
} from './util';

describe('getSingleQueryParam', () => {
  it('should return the string value when input is a string', () => {
    const result = getSingleQueryParam('test-value');
    expect(result).toBe('test-value');
  });

  it('should return undefined when input is an array', () => {
    const result = getSingleQueryParam(['value1', 'value2']);
    expect(result).toBeUndefined();
  });

  it('should return undefined when input is undefined', () => {
    const result = getSingleQueryParam(undefined);
    expect(result).toBeUndefined();
  });

  it('should return empty string when input is an empty string', () => {
    const result = getSingleQueryParam('');
    expect(result).toBe('');
  });

  it('should handle numeric strings correctly', () => {
    const result = getSingleQueryParam('123');
    expect(result).toBe('123');
  });

  it('should handle question step values', () => {
    expect(getSingleQueryParam('q1')).toBe('q1');
    expect(getSingleQueryParam('q-1')).toBe('q-1');
  });
});

describe('getNextPagePath', () => {
  it('should return current page path when there is an error', () => {
    const data = { 'q-5': '0' };
    const result = getNextPagePath(true, 5, data, false);
    expect(result).toBe('/question-5');
  });

  it('should return next page when no error and not question 10 or 11', () => {
    const data = { 'q-9': '1' };
    const result = getNextPagePath(false, 9, data, false);
    expect(result).toBe('/question-10');
  });

  it('should return next page when question 10 answer is 0', () => {
    const data = { 'q-10': '0' };
    const result = getNextPagePath(false, 10, data, false);
    expect(result).toBe('/question-11');
  });

  it('should return check answers page when question 10 answer is 1', () => {
    const data = { 'q-10': '1' };
    const result = getNextPagePath(false, 10, data, false);
    expect(result).toBe(CHECK_ANSWERS_PAGE);
  });

  it('should return check answers page when question is 11', () => {
    const data = { 'q-11': '1' };
    const result = getNextPagePath(false, 11, data, false);
    expect(result).toBe(CHECK_ANSWERS_PAGE);
  });

  it('should return check answers page when answer is changed', () => {
    const data = { 'q-5': '1' };
    const result = getNextPagePath(false, 5, data, true);
    expect(result).toBe(CHECK_ANSWERS_PAGE);
  });
});

describe('buildRedirectUrl', () => {
  it('should build redirect URL with language, page, and query string', () => {
    const result = buildRedirectUrl('en', '/question-1', 'q-1=0', false);
    expect(result).toBe('/en/question-1?q-1=0');
  });

  it('should build redirect URL with embed query parameter', () => {
    const result = buildRedirectUrl('en', '/question-1', 'q-1=0', true);
    expect(result).toBe('/en/question-1?q-1=0&isEmbedded=true');
  });

  it('should build redirect URL for Welsh language', () => {
    const result = buildRedirectUrl('cy', '/question-5', 'q-5=1', false);
    expect(result).toBe('/cy/question-5?q-5=1');
  });

  it('should handle check answers page', () => {
    const result = buildRedirectUrl('en', CHECK_ANSWERS_PAGE, 'q-10=1', false);
    expect(result).toBe('/en/change-options?q-10=1');
  });
});

describe('transformData', () => {
  it('should return data as-is when no error and question 10 answer is not 1', () => {
    const data = { 'q-9': '1', 'q-10': '0' };
    const result = transformData(data, false, 'q-10');
    expect(result).toEqual({ 'q-9': '1', 'q-10': '0' });
  });

  it('should remove q-11 when question 10 answer is 1', () => {
    const data = { 'q-10': '1', 'q-11': '2' };
    const result = transformData(data, false, 'q-10');
    expect(result).toEqual({ 'q-10': '1' });
  });

  it('should add error property when error is true', () => {
    const data = { 'q-5': '1' };
    const result = transformData(data, true, 'q-5');
    expect(result).toEqual({ 'q-5': '1', error: 'q-5' });
  });

  it('should handle empty data object', () => {
    const data = {};
    const result = transformData(data, false, 'q-1');
    expect(result).toEqual({});
  });

  it('should preserve other questions when removing q-11', () => {
    const data = { 'q-9': '0', 'q-10': '1', 'q-11': '1' };
    const result = transformData(data, false, 'q-10');
    expect(result).toEqual({ 'q-9': '0', 'q-10': '1' });
  });
});

describe('buildQueryString', () => {
  it('should build query string from single key-value pair', () => {
    const data = { 'q-1': '0' };
    const result = buildQueryString(data);
    expect(result).toBe('q-1=0');
  });

  it('should build query string from multiple key-value pairs', () => {
    const data = { 'q-1': '0', 'q-2': '1' };
    const result = buildQueryString(data);
    expect(result).toBe('q-1=0&q-2=1');
  });
});

describe('cleanData', () => {
  it('should remove error property from data', () => {
    const data = { 'q-1': '0', error: 'q-1' };
    const result = cleanData(data);
    expect(result).toEqual({ 'q-1': '0' });
  });

  it('should remove changeAnswer property from data', () => {
    const data = { 'q-1': '0', changeAnswer: 'q-1' };
    const result = cleanData(data);
    expect(result).toEqual({ 'q-1': '0' });
  });

  it('should remove both error and changeAnswer properties', () => {
    const data = { 'q-1': '0', error: 'q-1', changeAnswer: 'q-2' };
    const result = cleanData(data);
    expect(result).toEqual({ 'q-1': '0' });
  });

  it('should return data as-is when no error or changeAnswer', () => {
    const data = { 'q-1': '0', 'q-2': '1' };
    const result = cleanData(data);
    expect(result).toEqual({ 'q-1': '0', 'q-2': '1' });
  });

  it('should handle empty object', () => {
    const data = {};
    const result = cleanData(data);
    expect(result).toEqual({});
  });
});

describe('parseOldData', () => {
  it('should parse valid JSON string', () => {
    const savedData = '{"q-1":"0","q-2":"1"}';
    const result = parseOldData(savedData);
    expect(result).toEqual({ 'q-1': '0', 'q-2': '1' });
  });

  it('should return empty object when savedData is undefined', () => {
    const result = parseOldData(undefined);
    expect(result).toEqual({});
  });

  it('should return empty object when JSON parsing fails', () => {
    const savedData = 'invalid json';
    const result = parseOldData(savedData);
    expect(result).toEqual({});
  });

  it('should handle complex nested JSON', () => {
    const savedData = '{"q-1":"0","q-2":"1","q-3":"test value"}';
    const result = parseOldData(savedData);
    expect(result).toEqual({ 'q-1': '0', 'q-2': '1', 'q-3': 'test value' });
  });

  it('should handle empty JSON object', () => {
    const savedData = '{}';
    const result = parseOldData(savedData);
    expect(result).toEqual({});
  });
});

describe('buildData', () => {
  it('should add changeAnswer when navRules is false', () => {
    const oldData = { 'q-1': '0' };
    const result = buildData(false, oldData, '5');
    expect(result).toEqual({ 'q-1': '0', changeAnswer: 'q-5' });
  });

  it('should not add changeAnswer when navRules is true', () => {
    const oldData = { 'q-1': '0' };
    const result = buildData(true, oldData, '5');
    expect(result).toEqual({ 'q-1': '0' });
  });

  it('should handle empty oldData with false navRules', () => {
    const oldData = {};
    const result = buildData(false, oldData, '10');
    expect(result).toEqual({ changeAnswer: 'q-10' });
  });

  it('should handle empty oldData with true navRules', () => {
    const oldData = {};
    const result = buildData(true, oldData, '10');
    expect(result).toEqual({});
  });

  it('should preserve existing data when adding changeAnswer', () => {
    const oldData = { 'q-1': '0', 'q-2': '1', 'q-3': '2' };
    const result = buildData(false, oldData, '5');
    expect(result).toEqual({
      'q-1': '0',
      'q-2': '1',
      'q-3': '2',
      changeAnswer: 'q-5',
    });
  });
});

describe('checkAnswersNavRules', () => {
  it('should return true when question is 10 and answer is 0', () => {
    const data = { 'q-10': '0' };
    const result = checkAnswersNavRules(10, data);
    expect(result).toBe(true);
  });

  it('should return false when question is 10 and answer is 1', () => {
    const data = { 'q-10': '1' };
    const result = checkAnswersNavRules(10, data);
    expect(result).toBe(false);
  });

  it('should return false when question is not 10', () => {
    const data = { 'q-9': '0' };
    const result = checkAnswersNavRules(9, data);
    expect(result).toBe(false);
  });

  it('should return false when question is 11', () => {
    const data = { 'q-10': '0', 'q-11': '1' };
    const result = checkAnswersNavRules(11, data);
    expect(result).toBe(false);
  });
});
