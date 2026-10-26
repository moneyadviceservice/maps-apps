import { generateSearchQuery } from './generateSearchQuery';

describe('generateSearchQuery', () => {
  it('prefixes form data with q- and result data with r-', () => {
    expect(
      generateSearchQuery(
        { 'annual-income': '50000', 'second-applicant': 'no' },
        false,
        { 'borrow-amount': '200000', term: '25' },
      ),
    ).toBe(
      'q-annual-income=50000&q-second-applicant=no&r-borrow-amount=200000&r-term=25',
    );
  });

  it('omits result data when none is given', () => {
    expect(generateSearchQuery({ 'annual-income': '50000' }, false)).toBe(
      'q-annual-income=50000',
    );
  });

  it('appends the embed flag when the tool is embedded', () => {
    expect(generateSearchQuery({ 'annual-income': '50000' }, true)).toBe(
      'q-annual-income=50000&isEmbedded=true',
    );
  });

  it('repeats the key for multi-value fields and skips undefined values', () => {
    expect(
      generateSearchQuery({ costs: ['1', '2'], missing: undefined }, false),
    ).toBe('q-costs=1&q-costs=2');
  });

  it('returns an empty string when there is no data', () => {
    expect(generateSearchQuery({}, false)).toBe('');
  });
});
