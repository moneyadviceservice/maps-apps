import { getCanonicalUrl } from './getCanonicalUrl';
import { setCanonicalUrl } from 'utils/setCanonicalUrl';

jest.mock('utils/setCanonicalUrl', () => ({
  setCanonicalUrl: jest.fn(),
}));

describe('getCanonicalUrl', () => {
  it('should generate the correct canonical URL based on lang only', () => {
    (setCanonicalUrl as jest.Mock).mockReturnValue(
      'https://example.com/en/budget-planner',
    );

    const result = getCanonicalUrl('en');

    expect(setCanonicalUrl).toHaveBeenCalledWith('/en');
    expect(result).toBe('https://example.com/en/budget-planner');
  });
});
