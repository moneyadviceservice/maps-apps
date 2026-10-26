import { generateFilterQueryParams } from './generateFilterQueryParams';

describe('getConditionalQueryParams', () => {
  it('returns empty string if no params are provided', () => {
    const result = generateFilterQueryParams({});
    expect(result).toBe('');
  });

  it('returns only name search param if orgName is provided and no type', () => {
    const result = generateFilterQueryParams({ orgName: 'test-org' });
    expect(result).toBe('&searchQuery=test-org');
  });

  it('returns only type search param if orgType is provided and no name', () => {
    const result = generateFilterQueryParams({ orgType: 'charity' });
    expect(result).toBe('&type=charity');
  });

  it('returns name and type params when both are provided', () => {
    const result = generateFilterQueryParams({
      orgName: 'abc',
      orgType: 'debt',
    });
    expect(result).toBe('&searchQuery=abc&type=debt');
  });
});
