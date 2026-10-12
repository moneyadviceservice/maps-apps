import { INCOME_FIELDS, prefix } from 'data/retirementIncomeData';
import {
  calculateIncomeTax,
  getAvailableAmountAfterIncomeTax,
} from './income-tax';
import { FREQUENCY_KEYS } from 'lib/constants/pageConstants';

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

  it('should calculate tax correctly for income within additional rate with tapered allowance', () => {
    expect(getAvailableAmountAfterIncomeTax(130_000)).toBeCloseTo(85_297, 1);
  });

  // Personal allowance taper tests
  it('should calculate tax correctly for income at taper threshold (£100,001) with tapered allowance', () => {
    expect(getAvailableAmountAfterIncomeTax(100_001)).toBeCloseTo(72_568.4, 1);
  });

  it('should calculate tax correctly for income at £107,000 with tapered allowance', () => {
    expect(getAvailableAmountAfterIncomeTax(107_000)).toBeCloseTo(75_368, 1);
  });

  it('should calculate tax correctly for income at £110,000 with tapered allowance', () => {
    expect(getAvailableAmountAfterIncomeTax(110_000)).toBeCloseTo(76_568, 1);
  });

  it('should calculate tax correctly for income at £125,139 with tapered allowance approaching zero', () => {
    expect(getAvailableAmountAfterIncomeTax(125_139)).toBeCloseTo(82_623.6, 1);
  });

  it('should calculate tax correctly for income at £140,000 with no personal allowance', () => {
    expect(getAvailableAmountAfterIncomeTax(140_000)).toBeCloseTo(90_797, 1);
  });
});

describe('calculateIncomeTax', () => {
  it('should return the same amount for zero income', () => {
    expect(calculateIncomeTax({})).toBe(0);
  });
  it('should calculate tax correctly for positive income', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '500',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.MONTH,
      [`${prefix}${INCOME_FIELDS.PERSONAL}`]: '1000',
      [`${prefix}${INCOME_FIELDS.PERSONAL}Frequency`]: FREQUENCY_KEYS.MONTH,
    };
    expect(calculateIncomeTax(income)).toBeGreaterThan(0);
  });
  it('should handle high income correctly without taper', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '100000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(
      100000 - (37_700 * 0.2 + (100000 - 50_270) * 0.4),
    );
  });

  it('should handle income over £100,000 with personal allowance taper', () => {
    // Test case from AC: Income £110,000 should result in £76,568 after tax
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '110000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(76_568, 1);
  });

  it('should handle income at taper threshold (£100,001) with tapered personal allowance', () => {
    // Test case from AC: Income £100,001 should result in £72,568.40 after tax
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '100001',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(72_568.4, 1);
  });

  it('should handle income at £107,000 with tapered personal allowance', () => {
    // Test case from AC: Income £107,000 should result in £75,368 after tax
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '107000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(75_368, 1);
  });

  it('should handle income at zero allowance threshold (£125,139) with minimal personal allowance', () => {
    // Test case from AC: Income £125,139 should result in £82,623.60 after tax
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '125139',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(82_623.6, 1);
  });

  it('should handle income above zero allowance threshold (£140,000) with no personal allowance', () => {
    // Test case from AC: Income £140,000 should result in £90,797 after tax
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '140000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(90_797, 1);
  });
  it('should handle basic rate income correctly', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '15000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(
      15000 - (15000 - 12_570) * 0.2,
    );
  });
  it('should handle additional rate income correctly', () => {
    const income = {
      [`${prefix}${INCOME_FIELDS.STATE}`]: '130000',
      [`${prefix}${INCOME_FIELDS.STATE}Frequency`]: FREQUENCY_KEYS.YEAR,
    };
    expect(calculateIncomeTax(income)).toBeCloseTo(85_297, 1);
  });
});
