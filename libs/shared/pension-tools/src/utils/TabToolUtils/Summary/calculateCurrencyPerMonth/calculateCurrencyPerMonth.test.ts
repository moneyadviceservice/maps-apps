import { FormData } from '../../../../types/forms';
import { calculateCurrencyPerMonth } from './calculateCurrencyPerMonth';

describe('calculateCurrencyPerMonth', () => {
  it('should calculate total amount correctly when both amount and select value are provided', () => {
    const formData: FormData = {
      'amount-i': '1200',
      'amount-s': '15',
    };
    const key = 'amount-i';
    const amount = '1200';
    const months = 6;

    const result = calculateCurrencyPerMonth(key, formData, amount, months);

    // Monthly amount = (1200 / 15) * 30 = 2400
    // Total amount = 2400 * 6 = 14400
    expect(result).toBe('14400');
  });

  it('should use defaultSelectValue when formData does not contain select value', () => {
    const formData: FormData = {
      'amount-i': '1200',
    };
    const key = 'amount-i';
    const amount = '1200';
    const months = 6;
    const defaultSelectValue = '20';

    const result = calculateCurrencyPerMonth(
      key,
      formData,
      amount,
      months,
      defaultSelectValue,
    );

    // Monthly amount = (1200 / 20) * 30 = 1800
    // Total amount = 1800 * 6 = 10800
    expect(result).toBe('10800');
  });

  it('should handle cases where formData and defaultSelectValue are both missing', () => {
    const formData: FormData = {
      'amount-i': '1200',
    };
    const key = 'amount-i';
    const amount = '1200';
    const months = 6;

    const result = calculateCurrencyPerMonth(key, formData, amount, months);

    // No select value provided, default to NaN for selectedDays
    // Monthly amount = (1200 / NaN) * 30 = NaN
    // Total amount = NaN * 6 = NaN
    expect(result).toBe('NaN');
  });

  it('should handle zero months correctly', () => {
    const formData: FormData = {
      'amount-i': '1200',
      'amount-s': '15',
    };
    const key = 'amount-i';
    const amount = '1200';
    const months = 0;

    const result = calculateCurrencyPerMonth(key, formData, amount, months);

    // Monthly amount = (1200 / 15) * 30 = 2400
    // Total amount = 2400 * 0 = 0
    expect(result).toBe('0');
  });

  it('should handle negative months correctly', () => {
    const formData: FormData = {
      'amount-i': '1200',
      'amount-s': '15',
    };
    const key = 'amount-i';
    const amount = '1200';
    const months = -3;

    const result = calculateCurrencyPerMonth(key, formData, amount, months);

    // Monthly amount = (1200 / 15) * 30 = 2400
    // Total amount = 2400 * (-3) = -7200
    expect(result).toBe('-7200');
  });
});
