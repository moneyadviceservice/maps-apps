import {
  validatePurchaseDateDynamic,
  purchaseDateSchema,
} from './dateValidation';

describe('validatePurchaseDateDynamic', () => {
  const dynamicErrorMessages = {
    required: 'Date is required',
    invalid: 'Invalid date format',
    tooEarly: 'Date too early',
    missingDay: 'Enter the day',
    missingMonth: 'Enter the month',
    missingYear: 'Enter the year',
    missingDayMonth: 'Enter the day and month',
    missingDayYear: 'Enter the day and year',
    missingMonthYear: 'Enter the month and year',
  };

  const errorTestCases = [
    { input: '', expected: 'Date is required', description: 'empty string' },
    { input: '--', expected: 'Date is required', description: '"--"' },
    {
      input: '-4-2023',
      expected: 'Enter the day',
      description: 'missing day only',
    },
    {
      input: '6--2023',
      expected: 'Enter the month',
      description: 'missing month only',
    },
    {
      input: '6-4-',
      expected: 'Enter the year',
      description: 'missing year only',
    },
    {
      input: '--2023',
      expected: 'Enter the day and month',
      description: 'missing day and month',
    },
    {
      input: '-4-',
      expected: 'Enter the day and year',
      description: 'missing day and year',
    },
    {
      input: '6--',
      expected: 'Enter the month and year',
      description: 'missing month and year',
    },
    {
      input: '5-4-2023',
      expected: 'Date too early',
      description: 'dates before minimum',
    },
  ];

  for (const { input, expected, description } of errorTestCases) {
    it(`should return error for ${description}`, () => {
      expect(validatePurchaseDateDynamic(input, dynamicErrorMessages)).toBe(
        expected,
      );
    });
  }

  it('should return invalid error for wrong format with all parts present', () => {
    expect(validatePurchaseDateDynamic('32-4-2023', dynamicErrorMessages)).toBe(
      'Invalid date format',
    );
    expect(validatePurchaseDateDynamic('31-2-2023', dynamicErrorMessages)).toBe(
      'Invalid date format',
    );
  });

  it('should return undefined for valid dates', () => {
    expect(
      validatePurchaseDateDynamic('6-4-2023', dynamicErrorMessages),
    ).toBeUndefined();
    expect(
      validatePurchaseDateDynamic('15-2-2026', dynamicErrorMessages),
    ).toBeUndefined();
  });

  it('should handle partial dates with spaces', () => {
    expect(validatePurchaseDateDynamic(' -4-2023', dynamicErrorMessages)).toBe(
      'Enter the day',
    );
    expect(validatePurchaseDateDynamic('6- -2023', dynamicErrorMessages)).toBe(
      'Enter the month',
    );
    expect(validatePurchaseDateDynamic('6-4- ', dynamicErrorMessages)).toBe(
      'Enter the year',
    );
  });
});

describe('purchaseDateSchema', () => {
  it('should validate correct dates', () => {
    expect(() => purchaseDateSchema.parse('6-4-2023')).not.toThrow();
    expect(() => purchaseDateSchema.parse('15-2-2026')).not.toThrow();
  });

  it('should throw for invalid dates', () => {
    expect(() => purchaseDateSchema.parse('')).toThrow();
    expect(() => purchaseDateSchema.parse('5-4-2023')).toThrow();
    expect(() => purchaseDateSchema.parse('invalid')).toThrow();
  });
});
