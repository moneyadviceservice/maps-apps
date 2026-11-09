import { getDefaultValues } from './getDefaultValues';

describe('getDefaultValues', () => {
  it('parses a full date string (DD-MM-YYYY)', () => {
    expect(getDefaultValues('12-05-2026')).toEqual({
      day: '12',
      month: '05',
      year: '2026',
    });
  });

  it('parses a month-year string (MM-YYYY)', () => {
    expect(getDefaultValues('03-2026')).toEqual({
      day: '',
      month: '03',
      year: '2026',
    });
  });

  it('returns empty strings for invalid input', () => {
    expect(getDefaultValues('')).toEqual({
      day: '',
      month: '',
      year: '',
    });
    expect(getDefaultValues('invalid')).toEqual({
      day: '',
      month: '',
      year: '',
    });
  });
});
