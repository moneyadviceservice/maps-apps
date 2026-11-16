import { formatQuery, queryStringFormat } from './formatQuery';

describe('formatQuery', () => {
  it('should return the number when the value is a string', () => {
    const value = '1,000';
    const result = formatQuery(value);
    expect(result).toEqual(1000);
  });

  it('should return the number when the value is a string', () => {
    const value = '1,000.00';
    const result = formatQuery(value);
    expect(result).toEqual(1000);
  });

  it('should format object to query string', () => {
    const values = { type: 'pot', value: '1000' };
    const result = queryStringFormat(values);
    expect(result).toEqual('type=pot&value=1000');
  });

  it('should fail to format query into string when data is empty', () => {
    const values = {};
    const result = queryStringFormat(values);
    expect(result).toEqual('');
  });
});
