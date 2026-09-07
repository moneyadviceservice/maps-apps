import { fieldValidation } from './fieldValidation';

describe('fieldValidation', () => {
  describe('day validation', () => {
    it('should return error for empty day', () => {
      const result = fieldValidation({ day: '', month: '12', year: '2025' });
      expect(result.day).toBe(true);
    });

    it('should return error for day less than 1', () => {
      const result = fieldValidation({ day: '0', month: '12', year: '2025' });
      expect(result.day).toBe(true);
    });

    it('should return error for day greater than 31', () => {
      const result = fieldValidation({ day: '32', month: '12', year: '2025' });
      expect(result.day).toBe(true);
    });

    it('should return error for non-numeric day', () => {
      const result = fieldValidation({ day: 'abc', month: '12', year: '2025' });
      expect(result.day).toBe(true);
    });

    it('should accept valid day', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '2025' });
      expect(result.day).toBe(false);
    });
  });

  describe('month validation', () => {
    it('should return error for empty month', () => {
      const result = fieldValidation({ day: '15', month: '', year: '2025' });
      expect(result.month).toBe(true);
    });

    it('should return error for month less than 1', () => {
      const result = fieldValidation({ day: '15', month: '0', year: '2025' });
      expect(result.month).toBe(true);
    });

    it('should return error for month greater than 12', () => {
      const result = fieldValidation({ day: '15', month: '13', year: '2025' });
      expect(result.month).toBe(true);
    });

    it('should return error for non-numeric month', () => {
      const result = fieldValidation({ day: '15', month: 'abc', year: '2025' });
      expect(result.month).toBe(true);
    });

    it('should accept valid month', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '2025' });
      expect(result.month).toBe(false);
    });
  });

  describe('year validation', () => {
    it('should return error for empty year', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '' });
      expect(result.year).toBe(true);
    });

    it('should return error for year with less than 4 digits', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '202' });
      expect(result.year).toBe(true);
    });

    it('should return error for year with more than 4 digits', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '20255' });
      expect(result.year).toBe(true);
    });

    it('should return error for non-numeric year', () => {
      const result = fieldValidation({ day: '15', month: '12', year: 'abcd' });
      expect(result.year).toBe(true);
    });

    it('should accept valid year', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '2025' });
      expect(result.year).toBe(false);
    });
  });

  describe('multiple field validation', () => {
    it('should validate all fields correctly when all valid', () => {
      const result = fieldValidation({ day: '15', month: '12', year: '2025' });
      expect(result).toEqual({
        day: false,
        month: false,
        year: false,
      });
    });

    it('should validate all fields correctly when all invalid', () => {
      const result = fieldValidation({ day: '32', month: '13', year: '202' });
      expect(result).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });

    it('should handle undefined values', () => {
      const result = fieldValidation({});
      expect(result).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });

    it('should trim whitespace from values', () => {
      const result = fieldValidation({
        day: ' 15 ',
        month: ' 12 ',
        year: ' 2025 ',
      });
      expect(result).toEqual({
        day: false,
        month: false,
        year: false,
      });
    });
  });
});
