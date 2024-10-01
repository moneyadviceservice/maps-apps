import { checkFieldCondition } from './checkFieldCondition';
import { FieldCondition, FormData } from 'data/types';

describe('checkFieldCondition', () => {
  it('should return true for "=" when saved value matches the condition value (number case)', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '=',
      value: '30',
    };
    const savedData: FormData = {
      age: '30',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(true);
  });

  it('should return false for "=" when saved value does not match the condition value (number case)', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '=',
      value: 30,
    };
    const savedData: FormData = {
      age: '25',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(false);
  });

  it('should return true for "<" when saved value is less than the condition value', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '<',
      value: 30,
    };
    const savedData: FormData = {
      age: '25',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(true);
  });

  it('should return false for "<" when saved value is not less than the condition value', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '<',
      value: 20,
    };
    const savedData: FormData = {
      age: '25',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(false);
  });

  it('should return true for ">" when saved value is greater than the condition value', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '>',
      value: 20,
    };
    const savedData: FormData = {
      age: '25',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(true);
  });

  it('should return false for ">" when saved value is not greater than the condition value', () => {
    const fieldCondition: FieldCondition = {
      field: 'age',
      rule: '>',
      value: 30,
    };
    const savedData: FormData = {
      age: '25',
    };

    expect(checkFieldCondition(fieldCondition, savedData)).toBe(false);
  });
});
