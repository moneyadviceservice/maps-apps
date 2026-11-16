import { DefaultValues, FormData, FormField } from '../../../../types/forms';
import { calculateCurrencyPerMonth } from '../calculateCurrencyPerMonth';
import { getSummaryValue, processFieldValue } from './getSummaryValue';

jest.mock('../calculateCurrencyPerMonth', () => ({
  calculateCurrencyPerMonth: jest.fn(),
}));

describe('processFieldValue', () => {
  const mockCalculateCurrencyPerMonth = calculateCurrencyPerMonth as jest.Mock;

  const defaultValues: DefaultValues = {
    months: '12',
  };

  it('should process input-currency-with-select field type correctly when form data contains key', () => {
    const field: FormField = {
      key: 'price',
      type: 'input-currency-with-select',
      defaultSelectValue: '30',
      connectField: 'months',
      label: '',
    };

    const formData: FormData = {
      'price-i': '1200',
      months: '6',
    };

    mockCalculateCurrencyPerMonth.mockReturnValue('6000');

    const result = processFieldValue(field, formData, defaultValues);

    expect(mockCalculateCurrencyPerMonth).toHaveBeenCalledWith(
      'price-i',
      formData,
      '1200',
      6,
      '30',
    );
    expect(result).toBe(6000);
  });

  it('should process input-currency-with-select field type correctly when connectField is missing', () => {
    const field: FormField = {
      key: 'price',
      type: 'input-currency-with-select',
      defaultSelectValue: '30',
      label: '',
    };

    const formData: FormData = {
      'price-i': '1200',
    };

    mockCalculateCurrencyPerMonth.mockReturnValue('1200');

    const result = processFieldValue(field, formData, defaultValues);

    expect(mockCalculateCurrencyPerMonth).toHaveBeenCalledWith(
      'price-i',
      formData,
      '1200',
      1,
      '30',
    );
    expect(result).toBe(1200);
  });

  it('should return defaultSelectValue for select field type', () => {
    const field: FormField = {
      key: 'currency',
      type: 'select',
      defaultSelectValue: '50',
      label: '',
    };

    const formData: FormData = {};

    const result = processFieldValue(field, formData, defaultValues);

    expect(result).toBe(50);
  });
});

describe('getSummaryValue', () => {
  const defaultValues: DefaultValues = {
    months: '12',
  };

  it('should correctly sum up values from fields', () => {
    const fields: FormField[] = [
      {
        key: 'price1',
        type: 'input-currency-with-select',
        defaultSelectValue: '30',
        connectField: 'months',
        label: '',
      },
      {
        key: 'price2',
        type: 'input-currency-with-select',
        defaultSelectValue: '15',
        label: '',
      },
    ];

    const formData: FormData = {
      'price1-i': '1200',
      'price2-i': '800',
      months: '6',
    };

    (calculateCurrencyPerMonth as jest.Mock).mockImplementation(
      (key, formData, amount, months, defaultSelectValue) =>
        Number(amount) * (Number(months) || 1),
    );

    const result = getSummaryValue(fields, formData, defaultValues);

    expect(result).toBe(1200 * 6 + 800); // 7200 + 800 = 8000
  });

  it('should handle empty fields array', () => {
    const fields: FormField[] = [];
    const formData: FormData = {};

    const result = getSummaryValue(fields, formData, defaultValues);

    expect(result).toBe(0);
  });
});
