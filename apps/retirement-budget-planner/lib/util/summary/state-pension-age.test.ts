import {
  getCurrentAgeInYearsAndMonths,
  getStatePensionAge,
  parsePensionAge,
} from './state-pension-age';

jest.mock('public/data/state-pension-bands.json', () => [
  {
    start: '1950-01-01',
    end: '1953-12-31',
    pensionAge: '65',
  },
  {
    start: '1954-01-01',
    end: '1956-12-31',
    pensionAge: '66 years 6 months',
  },
  {
    start: '1957-01-01',
    end: null,
    pensionAge: '67',
  },
]);

describe('getStatePensionAge', () => {
  it('returns correct age when DOB falls within first band', () => {
    expect(getStatePensionAge({ day: '10', month: '06', year: '1952' })).toBe(
      '65',
    );
  });

  it('returns correct age when DOB falls within second band', () => {
    expect(getStatePensionAge({ day: '01', month: '03', year: '1955' })).toBe(
      '66 years 6 months',
    );
  });

  it('returns correct age for open-ended band (no end date)', () => {
    expect(getStatePensionAge({ day: '05', month: '09', year: '1958' })).toBe(
      '67',
    );
  });

  it('returns default "71" when DOB does not match any band', () => {
    expect(getStatePensionAge({ day: '01', month: '01', year: '1940' })).toBe(
      '71',
    );
  });

  it('handles invalid date values gracefully and still matches correctly', () => {
    expect(getStatePensionAge({ day: '32', month: '13', year: '1958' })).toBe(
      '67',
    );
  });
});

describe('parsePensionAge', () => {
  it('parses simple numeric years (string)', () => {
    expect(parsePensionAge('67')).toBe(804); // 67 * 12
  });

  it('parses "66 years 6 months"', () => {
    expect(parsePensionAge('66 years 6 months')).toBe(798);
  });

  it('parses with mixed casing and spacing', () => {
    expect(parsePensionAge('  65 Years   2 Months ')).toBe(782);
  });

  it('parses when only years are provided', () => {
    expect(parsePensionAge('68 years')).toBe(816);
  });

  it('parses when only months are provided', () => {
    expect(parsePensionAge('10 months')).toBe(10);
  });

  it('ignores extra words gracefully', () => {
    expect(parsePensionAge('Age is 67 years and 3 months approx')).toBe(807);
  });

  it('returns 0 when no valid numbers found', () => {
    expect(parsePensionAge('not a number')).toBe(0);
  });
});

describe('getCurrentAgeInYearsAndMonths', () => {
  const realDateNow = Date.now;

  beforeAll(() => {
    jest
      .spyOn(globalThis.Date, 'now')
      .mockImplementation(() => new Date('2026-02-20T12:00:00Z').getTime());
  });

  afterAll(() => {
    globalThis.Date.now = realDateNow;
  });

  it('returns null when missing fields', () => {
    expect(
      getCurrentAgeInYearsAndMonths({ day: '10', month: '05' }),
    ).toBeNull();
    expect(getCurrentAgeInYearsAndMonths({ year: '2000' })).toBeNull();
  });

  it('returns correct months difference for a valid DOB', () => {
    // DOB: 2000-02-20 → age = exactly 26 years = 312 months
    expect(
      getCurrentAgeInYearsAndMonths({ day: '20', month: '02', year: '2000' }),
    ).toBe(312);
  });

  it('never returns a negative number even for a future DOB', () => {
    expect(
      getCurrentAgeInYearsAndMonths({ day: '01', month: '01', year: '2030' }),
    ).toBe(0);
  });
});
