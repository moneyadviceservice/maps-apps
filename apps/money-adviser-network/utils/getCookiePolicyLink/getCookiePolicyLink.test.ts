import { getCookiePolicyLink } from './getCookiePolicyLink';

describe('getCookiePolicyLink', () => {
  it('returns the English link when z returns the English value', () => {
    const mockZ = jest.fn((translations) => translations.en);
    const result = getCookiePolicyLink(mockZ);

    expect(result).toBe('/en/cookie-policy');
    expect(mockZ).toHaveBeenCalledWith({
      en: '/en/cookie-policy',
      cy: '/cy/cookie-policy',
    });
  });

  it('returns the Welsh link when z returns the Welsh value', () => {
    const mockZ = jest.fn((translations) => translations.cy);
    const result = getCookiePolicyLink(mockZ);

    expect(result).toBe('/cy/cookie-policy');
    expect(mockZ).toHaveBeenCalledWith({
      en: '/en/cookie-policy',
      cy: '/cy/cookie-policy',
    });
  });
});
