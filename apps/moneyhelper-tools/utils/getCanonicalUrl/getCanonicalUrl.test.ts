import { getCanonicalUrl } from 'utils/getCanonicalUrl/getCanonicalUrl';
import { setCanonicalUrl } from 'utils/setCanonicalUrl';

jest.mock('utils/setCanonicalUrl', () => ({
  setCanonicalUrl: jest.fn(),
}));

describe('getCanonicalUrl', () => {
  it('should generate the correct canonical URL', () => {
    (setCanonicalUrl as jest.Mock).mockReturnValue(
      'https://example.com/en/test-path',
    );

    const result = getCanonicalUrl('/en/test-path/extra-segment', 'en');

    expect(setCanonicalUrl).toHaveBeenCalledWith('/en/test-path');
    expect(result).toBe('https://example.com/en/test-path');
  });
});
