import { currencyAmount } from './toCurrency';

describe('currencyAmount', () => {
  it('should format whole numbers correctly', () => {
    expect(currencyAmount(1234)).toBe('£1,234');
    expect(currencyAmount(0)).toBe('£0');
  });

  it('should format numbers with decimals correctly', () => {
    expect(currencyAmount(1234.56)).toBe('£1,234.56');
    expect(currencyAmount(0.99)).toBe('£0.99');
  });

  it('should handle negative numbers correctly', () => {
    expect(currencyAmount(-1234)).toBe('-£1,234');
    expect(currencyAmount(-1234.56)).toBe('-£1,234.56');
  });

  it('should handle large numbers correctly', () => {
    expect(currencyAmount(1234567890)).toBe('£1,234,567,890');
    expect(currencyAmount(1234567890.12)).toBe('£1,234,567,890.12');
  });
});
