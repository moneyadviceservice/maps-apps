import { defaultYourIncomeData, emptyOtherIncomeRow } from 'types/income';

import { isNumericAmount, validateYourIncome } from './yourIncome';

describe('isNumericAmount', () => {
  it('accepts whole numbers and comma-separated thousands', () => {
    expect(isNumericAmount('26900')).toBe(true);
    expect(isNumericAmount('26,900')).toBe(true);
    expect(isNumericAmount('26.50')).toBe(true);
  });

  it('rejects blank and non-numeric text', () => {
    expect(isNumericAmount('')).toBe(false);
    expect(isNumericAmount('abc')).toBe(false);
    expect(isNumericAmount('12.345')).toBe(false);
  });
});

describe('validateYourIncome', () => {
  it('requires gross pay', () => {
    const errors = validateYourIncome(defaultYourIncomeData());
    expect(errors.grossPay).toEqual([
      'Enter details of your income to continue',
    ]);
    expect(Object.keys(errors)).toEqual(['grossPay']);
  });

  it('treats whitespace-only gross pay as missing', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '   ',
    });
    expect(errors.grossPay).toEqual([
      'Enter details of your income to continue',
    ]);
  });

  it('falls back to English error copy when Welsh is empty', () => {
    const errors = validateYourIncome(defaultYourIncomeData(), 'cy');
    expect(errors.grossPay).toEqual([
      'Enter details of your income to continue',
    ]);
  });

  it('rejects non-numeric gross pay', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: 'abc',
    });
    expect(errors.grossPay).toEqual(['Enter an amount in pounds, like 26900']);
  });

  it('ignores a fully empty other-income row', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '26900',
      otherIncome: [emptyOtherIncomeRow()],
    });
    expect(errors).toEqual({});
  });

  it('requires a name when amount is entered', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '26900',
      otherIncome: [{ name: '', amount: '100', frequency: 'year' }],
    });
    expect(errors['other-income-0-name']).toEqual([
      'Enter a name for this income',
    ]);
    expect(errors['other-income-0-amount']).toBeUndefined();
  });

  it('requires an amount when name is entered', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '26900',
      otherIncome: [{ name: 'Savings', amount: '', frequency: 'year' }],
    });
    expect(errors['other-income-0-amount']).toEqual([
      'Enter an amount for this income',
    ]);
  });

  it('rejects non-numeric other-income amounts', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '26900',
      otherIncome: [{ name: 'Savings', amount: 'abc', frequency: 'year' }],
    });
    expect(errors['other-income-0-amount']).toEqual([
      'Enter an amount in pounds, like 26900',
    ]);
  });

  it('validates multiple other-income rows in on-screen order', () => {
    const errors = validateYourIncome({
      ...defaultYourIncomeData(),
      grossPay: '',
      otherIncome: [
        { name: 'Savings', amount: '', frequency: 'year' },
        { name: '', amount: '50', frequency: 'month' },
      ],
    });
    expect(Object.keys(errors)).toEqual([
      'grossPay',
      'other-income-0-amount',
      'other-income-1-name',
    ]);
  });
});
