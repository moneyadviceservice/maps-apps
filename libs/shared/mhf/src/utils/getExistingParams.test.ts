import { getExistingParams } from './getExistingParams';

describe('getExistingParams', () => {
  it('returns the remaining query parameters after excluded params are removed', () => {
    const result = getExistingParams(
      '/en/about-mhpd?aa=mhpd&sessionID=123&foo=bar',
      ['sessionID'],
    );

    expect(result).toBe('aa=mhpd&foo=bar');
  });

  it('returns all query params when no excluded params are provided', () => {
    const result = getExistingParams('/en/about-mhpd?aa=mhpd&foo=bar');

    expect(result).toBe('aa=mhpd&foo=bar');
  });
});
