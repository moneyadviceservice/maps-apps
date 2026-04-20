import { INCOME_FIELDS, prefix } from 'data/retirementIncomeData';
import {
  calculateIncomeTax,
  getAvailableAmountAfterIncomeTax,
} from './income-tax';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';

describe('getAvailableAmountAfterIncomeTax', () => {
  it('should return 0 for zero income', () => {
    expect(getAvailableAmountAfterIncomeTax(0)).toBe(0);
  });

  it('should calculate tax for positive income', () => {
    expect(getAvailableAmountAfterIncomeTax(50000)).toBeGreaterThan(0);
  });

  it('should calculate tax correctly for income within basic rate', () => {
    expect(getAvailableAmountAfterIncomeTax(20_000)).toBeCloseTo(
      20_000 - (20_000 - 12_570) * 0.2,
    );
  });

  it('should calculate tax correctly for income within higher rate', () => {
    expect(getAvailableAmountAfterIncomeTax(60_000)).toBeCloseTo(
      60_000 - (37_700 * 0.2 + (60_000 - 50_270) * 0.4),
    );
  });

  it('should calculate tax correctly for income within additional rate', () => {
    expect(getAvailableAmountAfterIncomeTax(130_000)).toBeCloseTo(
      130_000 - (37_700 * 0.2 + 74_870 * 0.4 + (130_000 - 125_140) * 0.45),
    );
  });
});

describe('calculateIncomeTax', () => {
  it('should return the same amount for zero income', () => {
    expect(calculateIncomeTax({})).toBe(0);
  });
  it('should calculate tax correctly for positive income', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '500',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.MONTH,
      [`${prefix}${INCOME_FIELDS.PERSONAL}`]: '1000',
      [`${prefix}${INCOME_FIELDS.PERSONAL}Frequency`]: FREQUNCY_KEYS.MONTH,
    };
    expect(calculateIncomeTax(income)).toBeGreaterThan(0);
  });
  it('should handle high income correctly', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '100000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(
      100000 - (37_700 * 0.2 + (100000 - 50_270) * 0.4),
    );
  });
  it('should handle basic rate income correctly', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '15000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(
      15000 - (15000 - 12_570) * 0.2,
    );
  });
  it('should handle additional rate income correctly', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '130000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUNCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(
      130_000 - (37_700 * 0.2 + 74_870 * 0.4 + (130_000 - 125_140) * 0.45),
    );
  });
});
