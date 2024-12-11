import { isInOfficeHours } from './isInOfficeHours';

const mockDate = (dateString: string) => {
  const RealDate = global.Date;

  global.Date = jest.fn(
    () => new RealDate(dateString),
  ) as unknown as DateConstructor;

  global.Date.now = RealDate.now;
  global.Date.parse = RealDate.parse;
  global.Date.UTC = RealDate.UTC;
};

describe('isInOfficeHours', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true when the time is between 9:00 AM and 3:30 PM', () => {
    mockDate('2024-11-28T10:00:00');

    expect(isInOfficeHours()).toBe(true);
  });

  it('should return true exactly at 9:00 AM', () => {
    mockDate('2024-11-28T09:00:00');

    expect(isInOfficeHours()).toBe(true);
  });

  it('should return true exactly at 3:30 PM', () => {
    mockDate('2024-11-28T15:30:00');

    expect(isInOfficeHours()).toBe(true);
  });
});
