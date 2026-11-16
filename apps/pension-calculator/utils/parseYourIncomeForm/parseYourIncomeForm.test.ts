import { emptyOtherIncomeRow } from 'types/income';

import {
  ensureYourIncomeDefaults,
  parseYourIncomeForm,
} from './parseYourIncomeForm';

describe('parseYourIncomeForm', () => {
  it('parses indexed form fields', () => {
    const data = parseYourIncomeForm({
      grossPay: '26,900',
      grossPayFrequency: 'month',
      otherIncomeCount: '2',
      'other-income-0-name': 'Savings',
      'other-income-0-amount': '100',
      'other-income-0-frequency': 'year',
      'other-income-1-name': '',
      'other-income-1-amount': '',
      'other-income-1-frequency': 'week',
    });

    expect(data.grossPay).toBe('26,900');
    expect(data.grossPayFrequency).toBe('month');
    expect(data.otherIncome).toEqual([
      { name: 'Savings', amount: '100', frequency: 'year' },
      { name: '', amount: '', frequency: 'week' },
    ]);
  });

  it('parses structured JSON bodies', () => {
    const data = parseYourIncomeForm({
      grossPay: '1000',
      grossPayFrequency: 'year',
      otherIncome: [{ name: 'Rent', amount: '50', frequency: 'month' }],
    });

    expect(data.otherIncome[0].name).toBe('Rent');
    expect(data.otherIncome[0].frequency).toBe('month');
  });

  it('defaults frequency and always keeps at least one other-income row', () => {
    const data = parseYourIncomeForm({
      grossPay: '1',
      otherIncome: [],
    });

    expect(data.grossPayFrequency).toBe('year');
    expect(data.otherIncome).toHaveLength(1);
  });

  it('caps structured other-income rows at the maximum', () => {
    const data = parseYourIncomeForm({
      otherIncome: Array.from({ length: 7 }, (_, index) => ({
        name: `Row ${index}`,
        amount: '1',
        frequency: 'year',
      })),
    });

    expect(data.otherIncome).toHaveLength(5);
    expect(data.otherIncome[0].name).toBe('Row 0');
  });

  it('treats a missing or invalid other-income count as one row', () => {
    const missing = parseYourIncomeForm({
      grossPay: '10',
      'other-income-0-name': 'Savings',
    });
    const invalid = parseYourIncomeForm({
      grossPay: '10',
      otherIncomeCount: 'nope',
    });

    expect(missing.otherIncome).toHaveLength(1);
    expect(missing.otherIncome[0].name).toBe('Savings');
    expect(invalid.otherIncome).toHaveLength(1);
  });

  it('caps indexed other-income count at the maximum', () => {
    const body: Record<string, unknown> = {
      grossPay: '10',
      otherIncomeCount: '9',
    };
    for (let index = 0; index < 9; index += 1) {
      body[`other-income-${index}-name`] = `Row ${index}`;
      body[`other-income-${index}-amount`] = '1';
      body[`other-income-${index}-frequency`] = 'year';
    }

    expect(parseYourIncomeForm(body).otherIncome).toHaveLength(5);
  });
});

describe('ensureYourIncomeDefaults', () => {
  it('returns the default data when nothing is stored', () => {
    expect(ensureYourIncomeDefaults()).toEqual({
      grossPay: '',
      grossPayFrequency: 'year',
      otherIncome: [emptyOtherIncomeRow()],
    });
    expect(ensureYourIncomeDefaults(null)).toEqual({
      grossPay: '',
      grossPayFrequency: 'year',
      otherIncome: [emptyOtherIncomeRow()],
    });
  });

  it('fills missing fields and keeps at least one other-income row', () => {
    expect(
      ensureYourIncomeDefaults({
        grossPay: undefined as unknown as string,
        grossPayFrequency: 'month',
        otherIncome: [],
      }),
    ).toEqual({
      grossPay: '',
      grossPayFrequency: 'month',
      otherIncome: [emptyOtherIncomeRow()],
    });

    const withRow = ensureYourIncomeDefaults({
      grossPay: '100',
      grossPayFrequency: 'week',
      otherIncome: [
        {
          name: undefined as unknown as string,
          amount: undefined as unknown as string,
          frequency: 'month',
        },
      ],
    });

    expect(withRow.otherIncome).toEqual([
      { name: '', amount: '', frequency: 'month' },
    ]);
  });
});
