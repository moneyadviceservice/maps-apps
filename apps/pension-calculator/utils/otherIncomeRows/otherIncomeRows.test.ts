import {
  defaultYourIncomeData,
  emptyOtherIncomeRow,
  MAX_OTHER_INCOME_ROWS,
} from 'types/income';

import {
  addOtherIncomeRow,
  canAddOtherIncome,
  canRemoveOtherIncome,
  errorsAfterRemovingRow,
  removeOtherIncomeRow,
} from './otherIncomeRows';

describe('otherIncomeRows', () => {
  it('adds rows in the order they were created and caps at 5', () => {
    let data = defaultYourIncomeData();
    data = {
      ...data,
      otherIncome: [{ name: 'Savings', amount: '10', frequency: 'year' }],
    };

    data = addOtherIncomeRow(data);
    expect(data.otherIncome).toHaveLength(2);
    expect(data.otherIncome[0].name).toBe('Savings');
    expect(data.otherIncome[1]).toEqual(emptyOtherIncomeRow());

    for (let i = 0; i < 10; i += 1) {
      data = addOtherIncomeRow(data);
    }

    expect(data.otherIncome).toHaveLength(MAX_OTHER_INCOME_ROWS);
    expect(canAddOtherIncome(data.otherIncome.length)).toBe(false);
  });

  it('does not remove the last remaining row', () => {
    const data = defaultYourIncomeData();
    expect(removeOtherIncomeRow(data, 0)).toEqual(data);
    expect(canRemoveOtherIncome(1)).toBe(false);
  });

  it('removes a row and keeps remaining values in order', () => {
    const data = {
      ...defaultYourIncomeData(),
      otherIncome: [
        { name: 'Savings', amount: '10', frequency: 'year' as const },
        { name: 'Investments', amount: '20', frequency: 'month' as const },
        { name: 'Rent', amount: '30', frequency: 'week' as const },
      ],
    };

    const next = removeOtherIncomeRow(data, 1);
    expect(next.otherIncome.map((row) => row.name)).toEqual([
      'Savings',
      'Rent',
    ]);
  });

  it('clears and reindexes errors for a removed row', () => {
    const errors = {
      grossPay: ['Enter details of your income to continue'],
      'other-income-0-name': ['Enter a name for this income'],
      'other-income-1-amount': ['Enter an amount for this income'],
    };

    expect(errorsAfterRemovingRow(errors, 0)).toEqual({
      grossPay: ['Enter details of your income to continue'],
      'other-income-0-amount': ['Enter an amount for this income'],
    });
  });

  it('keeps errors for rows before the removed index', () => {
    const errors = {
      'other-income-0-name': ['Enter a name for this income'],
      'other-income-2-amount': ['Enter an amount for this income'],
    };

    expect(errorsAfterRemovingRow(errors, 1)).toEqual({
      'other-income-0-name': ['Enter a name for this income'],
      'other-income-1-amount': ['Enter an amount for this income'],
    });
  });
});
