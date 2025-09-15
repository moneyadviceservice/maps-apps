import { formatDate } from './formatDate';

describe('formatDate', () => {
  test('should format date correctly for a valid date string', () => {
    expect(formatDate('2023-10-05')).toBe('5 October 2023');
  });

  test('should format date correctly for a different valid date string', () => {
    expect(formatDate('2000-01-01')).toBe('1 January 2000');
  });

  test('should handle invalid date string gracefully', () => {
    expect(formatDate('invalid-date')).toBe('--');
  });

  test('should handle empty date string gracefully', () => {
    expect(formatDate('')).toBe('--');
  });

  test('should handle date string with time component', () => {
    expect(formatDate('2023-10-05T14:48:00.000Z')).toBe('5 October 2023');
  });
});
