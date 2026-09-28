import { constructPurchaseDate } from './constructPurchaseDate';

describe('constructPurchaseDate', () => {
  it('should return formatted date when all components provided', () => {
    expect(constructPurchaseDate('6', '4', '2023')).toBe('6-4-2023');
    expect(constructPurchaseDate('15', '12', '2026')).toBe('15-12-2026');
    expect(constructPurchaseDate('1', '1', '2024')).toBe('1-1-2024');
  });

  it('should return partial date when only day provided', () => {
    expect(constructPurchaseDate('15', null, null)).toBe('15--');
  });

  it('should return partial date when only month provided', () => {
    expect(constructPurchaseDate(null, '4', null)).toBe('-4-');
  });

  it('should return partial date when only year provided', () => {
    expect(constructPurchaseDate(null, null, '2023')).toBe('--2023');
  });

  it('should return partial date when day and month provided', () => {
    expect(constructPurchaseDate('15', '4', null)).toBe('15-4-');
  });

  it('should return partial date when day and year provided', () => {
    expect(constructPurchaseDate('15', null, '2023')).toBe('15--2023');
  });

  it('should return partial date when month and year provided', () => {
    expect(constructPurchaseDate(null, '4', '2023')).toBe('-4-2023');
  });

  it('should return empty string when no components provided', () => {
    expect(constructPurchaseDate()).toBe('');
    expect(constructPurchaseDate(null, null, null)).toBe('');
  });

  it('should handle empty strings as falsy values', () => {
    expect(constructPurchaseDate('', '', '')).toBe('');
    expect(constructPurchaseDate('15', '', '')).toBe('15--');
    expect(constructPurchaseDate('', '4', '')).toBe('-4-');
    expect(constructPurchaseDate('', '', '2023')).toBe('--2023');
  });
});
