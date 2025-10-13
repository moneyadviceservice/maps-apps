import {
  calculateAgeAtEmploymentStart,
  isEmploymentAfterRedundancy,
  isEmploymentStartInFuture,
  isValidDate,
  calculateAgeToday,
} from './dateValidation';

describe('Redundancy pay calculator helper functions', () => {
  describe('calculateAgeAtEmploymentStart', () => {
    it('should return 0 if no dates are provided', () => {
      const actual = calculateAgeAtEmploymentStart('', '');
      expect(actual).toBe(0);
    });

    it('should return the age at the start of employment', () => {
      const actual = calculateAgeAtEmploymentStart('4-5-1980', '3-2020');
      expect(actual).toBe(39);
    });

    it('should return the age at the start of employment if the start date is before the birthday that year', () => {
      const actual = calculateAgeAtEmploymentStart('4-5-1980', '5-2020');
      expect(actual).toBe(39);
    });

    it('should return the age at the start of employment if the start date is after the birthday that year', () => {
      const actual = calculateAgeAtEmploymentStart('4-5-1980', '3-2020');
      expect(actual).toBe(39);
    });
  });

  describe('calculateAgeToday', () => {
    it('should return 0 if no date is provided', () => {
      expect(calculateAgeToday('')).toBe(0);
    });

    it('should return correct age if birthday has passed this year', () => {
      expect(calculateAgeToday('01-01-2000')).toBe(
        new Date().getFullYear() - 2000,
      );
    });

    it('should return correct age if birthday is today', () => {
      const today = new Date();
      const dob = `${today.getDate()}-${today.getMonth() + 1}-${
        today.getFullYear() - 15
      }`;
      expect(calculateAgeToday(dob)).toBe(15);
    });

    it('should return 14 if birthday is 1 month from now (i.e. 14 years and 11 months)', () => {
      const today = new Date();
      const dob = new Date(
        today.getFullYear() - 15,
        today.getMonth() + 1,
        today.getDate(),
      );
      const dobStr = `${dob.getDate()}-${
        dob.getMonth() + 1
      }-${dob.getFullYear()}`;
      expect(calculateAgeToday(dobStr)).toBe(14);
    });

    it('should return 15 if birthday was 1 month ago (i.e. already 15)', () => {
      const today = new Date();
      const dob = new Date(
        today.getFullYear() - 15,
        today.getMonth() - 1,
        today.getDate(),
      );
      const dobStr = `${dob.getDate()}-${
        dob.getMonth() + 1
      }-${dob.getFullYear()}`;
      expect(calculateAgeToday(dobStr)).toBe(15);
    });
  });
  describe('isEmploymentAfterRedundancy', () => {
    it('should return false if no dates are provided', () => {
      const actual = isEmploymentAfterRedundancy('', '');
      expect(actual).toBe(false);
    });

    it('should return true if the employment start date is after the redundancy date', () => {
      const actual = isEmploymentAfterRedundancy('3-2020', '4-2020');
      expect(actual).toBe(true);
    });

    it('should return false if the employment start date is before the redundancy date', () => {
      const actual = isEmploymentAfterRedundancy('3-2020', '2-2020');
      expect(actual).toBe(false);
    });
  });

  describe('isEmploymentStartInFuture', () => {
    it('should return false if no dates are provided', () => {
      const actual = isEmploymentStartInFuture('');
      expect(actual).toBe(false);
    });

    it('should return true if the employment start date is in the future', () => {
      const actual = isEmploymentStartInFuture('3-2026');
      expect(actual).toBe(true);
    });

    it('should return false if the employment start date is not in the future', () => {
      const actual = isEmploymentStartInFuture('3-2020');
      expect(actual).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      // Valid dates
      expect(isValidDate('01-01-2020')).toBe(true);
      expect(isValidDate('29-02-2020')).toBe(true);
      expect(isValidDate('31-12-2020')).toBe(true);
      expect(isValidDate('15-08-2021')).toBe(true);
    });

    it('should return false for invalid dates', () => {
      // Invalid dates
      expect(isValidDate('32-01-2020')).toBe(false);
      expect(isValidDate('31-02-2020')).toBe(false);
      expect(isValidDate('29-02-2019')).toBe(false);
      expect(isValidDate('13-13-2020')).toBe(false);
      expect(isValidDate('00-12-2020')).toBe(false);
      expect(isValidDate('01-01-202a')).toBe(false);
      expect(isValidDate('01-01-2')).toBe(false);
      expect(isValidDate('01-01-123')).toBe(false);
      expect(isValidDate('01-01-12345')).toBe(false);
    });
  });
});
