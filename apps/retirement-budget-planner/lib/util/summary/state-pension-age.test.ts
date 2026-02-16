import { getStatePensionAge } from './state-pension-age';

describe('getStatePensionAge', () => {
  test('returns "71 or above" if DOB is before all bands', () => {
    expect(getStatePensionAge('1954-01-06')).toBe('71 or above');
  });

  test('returns 66 for lower bound of the first band', () => {
    expect(getStatePensionAge('1954-10-06')).toBe('66');
  });

  test('returns 66 for upper bound of the first band', () => {
    expect(getStatePensionAge('1960-04-05')).toBe('66');
  });

  const monthBands = [
    ['1960-04-06', '1960-05-05', '66 years and 1 month'],
    ['1960-05-06', '1960-06-05', '66 years and 2 months'],
    ['1960-06-06', '1960-07-05', '66 years and 3 months'],
    ['1960-07-06', '1960-08-05', '66 years and 4 months'],
    ['1960-08-06', '1960-09-05', '66 years and 5 months'],
    ['1960-09-06', '1960-10-05', '66 years and 6 months'],
    ['1960-10-06', '1960-11-05', '66 years and 7 months'],
    ['1960-11-06', '1960-12-05', '66 years and 8 months'],
    ['1960-12-06', '1961-01-05', '66 years and 9 months'],
    ['1961-01-06', '1961-02-05', '66 years and 10 months'],
    ['1961-02-06', '1961-03-05', '66 years and 11 months'],
  ];

  monthBands.forEach(([start, end, expected]) => {
    test(`returns '${expected}' for range ${start} → ${end}`, () => {
      expect(getStatePensionAge(start)).toBe(expected);
      expect(getStatePensionAge(end)).toBe(expected);
    });
  });

  //
  // AGE 67 BAND (1961-03-06 → 1977-04-05)
  //
  test('returns 67 for start of age 67 band', () => {
    expect(getStatePensionAge('1961-03-06')).toBe('67');
  });

  test('returns 67 for end of age 67 band', () => {
    expect(getStatePensionAge('1977-04-05')).toBe('67');
  });

  //
  // AGE 68 MONTH BANDS (1977-04-06 → 1978-04-05)
  //
  const age68Bands = [
    ['1977-04-06', '1977-05-05'],
    ['1977-05-06', '1977-06-05'],
    ['1977-06-06', '1977-07-05'],
    ['1977-07-06', '1977-08-05'],
    ['1977-08-06', '1977-09-05'],
    ['1977-09-06', '1977-10-05'],
    ['1977-10-06', '1977-11-05'],
    ['1977-11-06', '1977-12-05'],
    ['1977-12-06', '1978-01-05'],
    ['1978-01-06', '1978-02-05'],
    ['1978-02-06', '1978-03-05'],
    ['1978-03-06', '1978-04-05'],
  ];

  age68Bands.forEach(([start, end]) => {
    test(`returns '68' for 68 band range ${start} → ${end}`, () => {
      expect(getStatePensionAge(start)).toBe('68');
      expect(getStatePensionAge(end)).toBe('68');
    });
  });

  test('returns 68 for open-ended final band start date', () => {
    expect(getStatePensionAge('1978-04-06')).toBe('68');
  });

  test('returns 68 for any later date', () => {
    expect(getStatePensionAge('2000-01-01')).toBe('68');
  });
});
