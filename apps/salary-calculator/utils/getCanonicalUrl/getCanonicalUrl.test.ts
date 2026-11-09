import { getCanonicalUrl } from 'utils/getCanonicalUrl/getCanonicalUrl';

describe('getCanonicalUrl', () => {
  it('should generate the correct canonical URL for English', () => {
    const result = getCanonicalUrl('en');
    expect(result).toBe(
      'https://www.moneyhelper.org.uk/en/work/employment/salary-calculator',
    );
  });

  it('should generate the correct canonical URL for Welsh', () => {
    const result = getCanonicalUrl('cy');
    expect(result).toBe(
      'https://www.moneyhelper.org.uk/cy/work/employment/salary-calculator',
    );
  });
});
