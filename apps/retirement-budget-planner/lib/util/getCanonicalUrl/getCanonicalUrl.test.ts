import { getCanonicalUrl } from 'lib/util/getCanonicalUrl/getCanonicalUrl';

describe('getCanonicalUrl', () => {
  it('should generate the correct canonical URL for English', () => {
    const result = getCanonicalUrl('en');
    expect(result).toBe(
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/retirement-budget-planner',
    );
  });

  it('should generate the correct canonical URL for Welsh', () => {
    const result = getCanonicalUrl('cy');
    expect(result).toBe(
      'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/retirement-budget-planner',
    );
  });

  it('should generate English URL as fallback for invalid locale param', () => {
    // @ts-expect-error - testing invalid input
    const result = getCanonicalUrl('not-a-valid-locale');
    expect(result).toBe(
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/retirement-budget-planner',
    );
  });
});
