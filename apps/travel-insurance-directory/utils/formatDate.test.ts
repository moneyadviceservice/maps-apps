import { formatDate } from './formatDate';

describe('formatDate', () => {
  describe('short format (default)', () => {
    it('formats a valid ISO date string', () => {
      expect(formatDate('2024-10-16T09:21:00Z')).toBe('16 Oct 09:21');
    });

    it('pads hours and minutes with leading zeros', () => {
      expect(formatDate('2024-01-05T03:07:00Z')).toBe('5 Jan 03:07');
    });

    it('returns default fallback for null', () => {
      expect(formatDate(null)).toBe('—');
    });

    it('returns default fallback for undefined', () => {
      expect(formatDate(undefined)).toBe('—');
    });

    it('returns default fallback for empty string', () => {
      expect(formatDate('')).toBe('—');
    });

    it('returns default fallback for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('—');
    });

    it('returns custom fallback when provided', () => {
      expect(formatDate(null, { fallback: 'Hidden' })).toBe('Hidden');
    });
  });

  describe('long format', () => {
    it('formats a valid ISO date string with full month and year', () => {
      expect(formatDate('2024-10-16T09:21:00Z', { format: 'long' })).toBe(
        'October 16, 2024 09:21',
      );
    });

    it('returns default fallback for null', () => {
      expect(formatDate(null, { format: 'long' })).toBe('—');
    });

    it('returns custom fallback for null in long format', () => {
      expect(formatDate(null, { format: 'long', fallback: 'N/A' })).toBe('N/A');
    });

    it('formats January correctly', () => {
      expect(formatDate('2024-01-01T00:00:00Z', { format: 'long' })).toBe(
        'January 1, 2024 00:00',
      );
    });

    it('formats December correctly', () => {
      expect(formatDate('2024-12-25T15:30:00Z', { format: 'long' })).toBe(
        'December 25, 2024 15:30',
      );
    });
  });
});
