import {
  validateSharedPurchaseDate,
  validateStampDutyFormWithFieldErrors,
} from './sharedValidation';

// Mock translation function
const mockZ = (options: { en: string; cy: string }) => options.en;

describe('validateSharedPurchaseDate', () => {
  it('should return undefined for valid dates', () => {
    expect(validateSharedPurchaseDate('6-4-2023', mockZ)).toBeUndefined();
    expect(validateSharedPurchaseDate('15-2-2026', mockZ)).toBeUndefined();
  });

  it('should return translated error messages', () => {
    expect(validateSharedPurchaseDate('', mockZ)).toBe('Enter a purchase date');
    expect(validateSharedPurchaseDate('32-4-2023', mockZ)).toBe(
      'Enter a valid purchase date',
    );
    expect(validateSharedPurchaseDate('5-4-2023', mockZ)).toBe(
      'The purchase date cannot be before 06/04/2023',
    );
  });
});

describe('validateStampDutyFormWithFieldErrors', () => {
  it('should return no errors for valid input', () => {
    const validInput = {
      buyerType: 'nextHome',
      price: '250000',
      purchaseDate: '6-4-2023',
    };

    const result = validateStampDutyFormWithFieldErrors(validInput, mockZ);

    expect(result.errors).toEqual({});
    expect(result.fieldErrors).toEqual({});
  });

  it('should return error for missing buyer type', () => {
    const input = {
      buyerType: '',
      price: '250000',
      purchaseDate: '6-4-2023',
    };

    const result = validateStampDutyFormWithFieldErrors(input, mockZ);

    expect(result.errors.buyerType).toEqual([
      'Select the type of property you are buying',
    ]);
    expect(result.errors.price).toBeUndefined();
    expect(result.errors.purchaseDate).toBeUndefined();
  });

  it('should return error for missing price', () => {
    const input = {
      buyerType: 'nextHome',
      price: '',
      purchaseDate: '6-4-2023',
    };

    const result = validateStampDutyFormWithFieldErrors(input, mockZ);

    expect(result.errors.price).toEqual([
      'Enter a property price, for example £200,000',
    ]);
    expect(result.errors.buyerType).toBeUndefined();
    expect(result.errors.purchaseDate).toBeUndefined();
  });

  it('should return error for invalid price (zero)', () => {
    const input = {
      buyerType: 'nextHome',
      price: '0',
      purchaseDate: '6-4-2023',
    };

    const result = validateStampDutyFormWithFieldErrors(input, mockZ);

    expect(result.errors.price).toEqual([
      'Enter a property price, for example £200,000',
    ]);
  });

  it('should return error for missing purchase date', () => {
    const input = {
      buyerType: 'nextHome',
      price: '250000',
      purchaseDate: '',
    };

    const result = validateStampDutyFormWithFieldErrors(input, mockZ);

    expect(result.errors.purchaseDate).toEqual(['Enter a purchase date']);
    expect(result.fieldErrors?.purchaseDate).toEqual({
      day: true,
      month: true,
      year: true,
    });
  });

  const purchaseDateErrorCases = [
    {
      description: 'invalid purchase date',
      purchaseDate: '32-4-2023',
      expectedError: ['Enter a valid purchase date'],
      expectedFieldErrors: { day: true },
    },
    {
      description: 'purchase date before minimum',
      purchaseDate: '5-4-2023',
      expectedError: ['The purchase date cannot be before 06/04/2023'],
      expectedFieldErrors: undefined,
    },
    {
      description: 'missing day in purchase date',
      purchaseDate: '-4-2023',
      expectedError: ['Enter a valid day'],
      expectedFieldErrors: { day: true },
    },
    {
      description: 'missing month in purchase date',
      purchaseDate: '6--2023',
      expectedError: ['Enter a valid month'],
      expectedFieldErrors: { month: true },
    },
    {
      description: 'missing year in purchase date',
      purchaseDate: '6-4-',
      expectedError: ['Enter a valid year'],
      expectedFieldErrors: { year: true },
    },
  ];

  for (const testCase of purchaseDateErrorCases) {
    it(`should return error for ${testCase.description}`, () => {
      const input = {
        buyerType: 'nextHome',
        price: '250000',
        purchaseDate: testCase.purchaseDate,
      };

      const result = validateStampDutyFormWithFieldErrors(input, mockZ);

      expect(result.errors.purchaseDate).toEqual(testCase.expectedError);
      if (testCase.expectedFieldErrors) {
        expect(result.fieldErrors?.purchaseDate).toEqual(
          testCase.expectedFieldErrors,
        );
      }
    });
  }

  it('should return multiple errors for all missing fields', () => {
    const input = {
      buyerType: '',
      price: '',
      purchaseDate: '',
    };

    const result = validateStampDutyFormWithFieldErrors(input, mockZ);

    expect(result.errors.buyerType).toEqual([
      'Select the type of property you are buying',
    ]);
    expect(result.errors.price).toEqual([
      'Enter a property price, for example £200,000',
    ]);
    expect(result.errors.purchaseDate).toEqual(['Enter a purchase date']);
    expect(result.fieldErrors?.purchaseDate).toEqual({
      day: true,
      month: true,
      year: true,
    });
  });
});
