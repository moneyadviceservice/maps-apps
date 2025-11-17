import currency from 'currency.js';
import formatMoney from './formatMoney';

describe('formatMoney', () => {
  it('should handle null values', () => {
    expect(formatMoney(null)).toBe('');
  });

  it('should handle undefined values', () => {
    expect(formatMoney(undefined)).toBe('');
  });

  it('should format number values correctly', () => {
    expect(formatMoney(10)).toBe('£10.00');
    expect(formatMoney(10.5)).toBe('£10.50');
    expect(formatMoney(10.99)).toBe('£10.99');
    expect(formatMoney(1000)).toBe('£1,000.00');
    expect(formatMoney(1000000)).toBe('£1,000,000.00');
  });

  it('should format string values correctly', () => {
    expect(formatMoney('10')).toBe('£10.00');
    expect(formatMoney('10.5')).toBe('£10.50');
    expect(formatMoney('10.99')).toBe('£10.99');
    expect(formatMoney('1000')).toBe('£1,000.00');
  });

  it('should handle negative values', () => {
    expect(formatMoney(-10)).toBe('-£10.00');
    expect(formatMoney('-10.50')).toBe('-£10.50');
    expect(formatMoney(-1000)).toBe('-£1,000.00');
  });

  it('should handle zero values', () => {
    expect(formatMoney(0)).toBe('£0.00');
    expect(formatMoney('0')).toBe('£0.00');
    expect(formatMoney(-0)).toBe('£0.00');
  });

  it('should handle decimal precision', () => {
    expect(formatMoney(10.1)).toBe('£10.10');
    expect(formatMoney(10.999)).toBe('£11.00'); // currency.js rounds
    expect(formatMoney(10.994)).toBe('£10.99');
    expect(formatMoney(10.995)).toBe('£11.00');
  });

  it('should handle currency.js instances', () => {
    const currencyValue = currency(25.5, { symbol: '£', precision: 2 });
    expect(formatMoney(currencyValue)).toBe('£25.50');

    const largeCurrencyValue = currency(1234.56, { symbol: '£', precision: 2 });
    expect(formatMoney(largeCurrencyValue)).toBe('£1,234.56');
  });

  it('should handle Dinero-like objects with GBP currency', () => {
    const dineroObj = {
      amount: 1050,
      scale: 2,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('£10.50');
  });

  it('should handle Dinero-like objects with different scales', () => {
    const dineroObj1 = {
      amount: 10500,
      scale: 3,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj1 as any)).toBe('£10.50');

    const dineroObj2 = {
      amount: 105,
      scale: 1,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj2 as any)).toBe('£10.50');
  });

  it('should handle Dinero-like objects with non-GBP currency', () => {
    const dineroObj = {
      amount: 1050,
      scale: 2,
      currency: {
        code: 'USD',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('USD10.50');
  });

  it('should handle large amounts in Dinero format', () => {
    const dineroObj = {
      amount: 123456789,
      scale: 2,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('£1,234,567.89');
  });

  it('should handle zero amounts in Dinero format', () => {
    const dineroObj = {
      amount: 0,
      scale: 2,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('£0.00');
  });

  it('should handle negative amounts in Dinero format', () => {
    const dineroObj = {
      amount: -1050,
      scale: 2,
      currency: {
        code: 'GBP',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('-£10.50');
  });

  it('should handle objects without proper currency structure', () => {
    const invalidObj1 = {
      amount: 1050,
      scale: 2,
      // Missing currency property
    };
    expect(formatMoney(invalidObj1 as any)).toBe('£0.00');

    const invalidObj2 = {
      amount: 1050,
      scale: 2,
      currency: 'GBP', // Valid string currency format
    };
    expect(formatMoney(invalidObj2 as any)).toBe('£10.50');
  });

  it('should handle objects with missing currency properties', () => {
    const invalidCurrencyObj = {
      amount: 1050,
      scale: 2,
      currency: {
        // Missing required properties
        code: 'GBP',
        // Missing base and exponent
      },
    };
    expect(formatMoney(invalidCurrencyObj as any)).toBe('£0.00');
  });

  it('should handle edge cases', () => {
    // Empty string
    expect(formatMoney('')).toBe('£0.00');

    // Non-numeric string
    expect(formatMoney('abc')).toBe('£0.00');

    // Objects without amount or scale
    expect(formatMoney({} as any)).toBe('£0.00');

    // Arrays
    expect(formatMoney([] as any)).toBe('£0.00');

    // Boolean values
    expect(formatMoney(true as any)).toBe('£0.00');
    expect(formatMoney(false as any)).toBe('£0.00');
  });

  it('should handle very small decimal values', () => {
    expect(formatMoney(0.001)).toBe('£0.00');
    expect(formatMoney(0.004)).toBe('£0.00');
    expect(formatMoney(0.005)).toBe('£0.01'); // Rounds up
    expect(formatMoney(0.009)).toBe('£0.01');
  });

  it('should handle Infinity and NaN', () => {
    expect(formatMoney(Infinity)).toBe('£Infinity');
    expect(formatMoney(-Infinity)).toBe('-£Infinity');
    expect(formatMoney(NaN)).toBe('-£NaN');
  });

  it('should handle currency objects with empty code property', () => {
    const dineroObj = {
      amount: 1050,
      scale: 2,
      currency: {
        code: '',
        base: 10,
        exponent: 2,
      },
    };
    expect(formatMoney(dineroObj as any)).toBe('£10.50');
  });
});
