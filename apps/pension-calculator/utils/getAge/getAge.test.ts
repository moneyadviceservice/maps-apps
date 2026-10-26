import { getAge, parseCalendarDate, startOfToday } from './getAge';

describe('parseCalendarDate', () => {
  it('returns a date when day, month and year form a real date', () => {
    const date = parseCalendarDate('27', '03', '1960');
    expect(date).toEqual(new Date(1960, 2, 27));
  });

  it('returns null for blank, non-numeric, or impossible dates', () => {
    expect(parseCalendarDate('', '03', '1960')).toBeNull();
    expect(parseCalendarDate('ab', '03', '1960')).toBeNull();
    expect(parseCalendarDate('31', '02', '1960')).toBeNull();
  });
});

describe('getAge', () => {
  const now = new Date(2026, 8, 10);

  it('is birthday-aware', () => {
    expect(getAge(new Date(2008, 8, 10), now)).toBe(18);
    expect(getAge(new Date(2008, 8, 11), now)).toBe(17);
  });
});

describe('startOfToday', () => {
  it('strips the time from the given date', () => {
    expect(startOfToday(new Date(2026, 8, 10, 15, 30))).toEqual(
      new Date(2026, 8, 10),
    );
  });
});
