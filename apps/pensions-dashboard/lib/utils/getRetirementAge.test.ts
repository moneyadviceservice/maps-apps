import { getRetirementAge } from './getRetirementAge';

describe('getRetirementAge', () => {
  test('should return "N/A" if retirement date is undefined', () => {
    expect(getRetirementAge(undefined, '1980-01-01')).toBe('N/A');
  });

  test('should return "N/A" if birth date is undefined', () => {
    expect(getRetirementAge('2045-01-01', undefined)).toBe('N/A');
  });

  test('should calculate the correct retirement age', () => {
    expect(getRetirementAge('2045-01-01', '1980-01-01')).toBe(65);
  });

  test('should calculate the correct retirement age if retirement date is before birthday in the same year', () => {
    expect(getRetirementAge('2045-01-01', '1980-06-01')).toBe(64);
  });

  test('should calculate the correct retirement age if retirement date is after birthday in the same year', () => {
    expect(getRetirementAge('2045-06-01', '1980-01-01')).toBe(65);
  });

  test('should handle leap years correctly', () => {
    expect(getRetirementAge('2044-02-29', '1980-02-29')).toBe(64);
  });
});
