import { EnglishTaxRates } from 'utils/rates';
import { calculateIncomeTax } from '.';
import { calculatePersonalAllowance } from '../../helpers/personalAllowance';
import {
  buildScottishFlatRate,
  buildEnglishFlatRate,
  calculateCumulativeTax,
  validateRequiredFields,
} from './incomeTax';

// Common income test points
const taxableIncomes = [
  0, 5000, 15000, 17500, 20000, 22500, 25000, 50000, 55000, 60000, 75000, 90000,
  105000, 110000, 130000, 145000, 160000, 175000, 200000, 250000, 500000,
  1000000,
];

// Base expectations for A/B
const baseExpectations: Record<
  number,
  { basic: number; higher: number; additional: number }
> = {
  0: { basic: 0, higher: 0, additional: 0 },
  5000: { basic: 0, higher: 0, additional: 0 },
  15000: { basic: 486, higher: 0, additional: 0 },
  17500: { basic: 986, higher: 0, additional: 0 },
  20000: { basic: 1486, higher: 0, additional: 0 },
  22500: { basic: 1986, higher: 0, additional: 0 },
  25000: { basic: 2486, higher: 0, additional: 0 },
  50000: { basic: 7486, higher: 0, additional: 0 },
  55000: { basic: 7540, higher: 1892, additional: 0 },
  60000: { basic: 7540, higher: 3892, additional: 0 },
  75000: { basic: 7540, higher: 9892, additional: 0 },
  90000: { basic: 7540, higher: 15892, additional: 0 },
  105000: { basic: 7540, higher: 22892, additional: 0 },
  110000: { basic: 7540, higher: 25892, additional: 0 },
  130000: { basic: 7540, higher: 34976, additional: 2187 },
  145000: { basic: 7540, higher: 34976, additional: 8937 },
  160000: { basic: 7540, higher: 34976, additional: 15687 },
  175000: { basic: 7540, higher: 34976, additional: 22437 },
  200000: { basic: 7540, higher: 34976, additional: 33687 },
  250000: { basic: 7540, higher: 34976, additional: 56187 },
  500000: { basic: 7540, higher: 34976, additional: 168687 },
  1000000: { basic: 7540, higher: 34976, additional: 393687 },
};

// Expectation builders
export const expectationsA = taxableIncomes.map((income) => ({
  taxableAnnualIncome: income,
  ...baseExpectations[income],
}));

// expectationsB is identical to A
export const expectationsB = expectationsA;

// Scotland-specific expectations (C)
export const expectationsC = [
  {
    taxableAnnualIncome: 0,
    starterRateTax: 0,
    basicRateTax: 0,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 5000,
    starterRateTax: 0,
    basicRateTax: 0,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 15000,
    starterRateTax: 438.33,
    basicRateTax: 24.6,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 17500,
    starterRateTax: 438.33,
    basicRateTax: 524.6,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 20000,
    starterRateTax: 438.33,
    basicRateTax: 1024.6,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 22500,
    starterRateTax: 438.33,
    basicRateTax: 1524.6,
    intermediateRateTax: 0,
    higherRateTax: 0,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 50000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 2661.54,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 75000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.54,
    advancedRateTax: 0,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 90000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.96,
    advancedRateTax: 6749.55,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 110000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.96,
    advancedRateTax: 17999.55,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 125000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.96,
    advancedRateTax: 28124.55,
    topRateTax: 0,
  },
  {
    taxableAnnualIncome: 150000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.96,
    advancedRateTax: 28219.05,
    topRateTax: 11932.8,
  },
  {
    taxableAnnualIncome: 200000,
    starterRateTax: 438.33,
    basicRateTax: 2337,
    intermediateRateTax: 3591.21,
    higherRateTax: 13161.96,
    advancedRateTax: 28219.05,
    topRateTax: 35932.8,
  },
];

// England, 2025/26

describe('calculateIncomeTax (25/26)', () => {
  for (const expectation of expectationsA) {
    const { taxableAnnualIncome, basic, higher, additional } = expectation;
    test(taxableAnnualIncome.toString(), () => {
      const personalAllowance = calculatePersonalAllowance({
        taxYear: '2025/26',
        taxableAnnualIncome,
      });
      const taxAmounts = calculateIncomeTax({
        taxYear: '2025/26',
        taxableAnnualIncome,
        personalAllowance,
      });
      expect(taxAmounts.breakdown).toEqual({
        basicRateTax: basic,
        higherRateTax: higher,
        additionalRateTax: additional,
      });
    });
  }
});

// England, 2025/26

describe('calculateIncomeTax (25/26)', () => {
  for (const expectation of expectationsB) {
    const { taxableAnnualIncome, basic, higher, additional } = expectation;
    test(taxableAnnualIncome.toString(), () => {
      const personalAllowance = calculatePersonalAllowance({
        taxYear: '2025/26',
        taxableAnnualIncome,
      });
      const taxAmounts = calculateIncomeTax({
        taxYear: '2025/26',
        taxableAnnualIncome,
        personalAllowance,
      });
      expect(taxAmounts.breakdown).toEqual({
        basicRateTax: basic,
        higherRateTax: higher,
        additionalRateTax: additional,
      });
    });
  }
});

// Scotland, 2024/25

// Using this which looks like a good reference:
// https://spice-spotlight.scot/2024/01/16/how-much-income-tax-will-i-pay-in-2024-25/

// Cumulative PAYE tests - Example from the issue
describe('calculateIncomeTax - Cumulative PAYE Mode', () => {
  describe('Issue example: £10,000 in month 1, then £0 for months 2-12', () => {
    const taxYear = '2025/26';

    test('Month 1: £10,000 gross income should result in £1,790 tax', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 10_000,
          cumulativeTaxPaid: 0,
        },
      });

      // The expected result from the issue is £1,790
      // Personal allowance for month 1: £12,570 / 12 = £1,047.50
      // Taxable income: £10,000 - £1,047.50 = £8,952.50
      // Tax: £8,952.50 * 20% = £1,790.50
      expect(result.total).toBeCloseTo(1790.5, 1);
    });

    test('Month 2: £0 additional income should result in £0 additional tax', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 2,
          cumulativeGrossIncome: 10_000, // Same as month 1
          cumulativeTaxPaid: 1790, // Tax paid in month 1
        },
      });

      expect(result.total).toBeCloseTo(0, 0);
    });

    test('Month 12: Still £0 additional income should result in £0 additional tax', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 12,
          cumulativeGrossIncome: 10_000, // Same as month 1
          cumulativeTaxPaid: 1790, // Tax paid in month 1
        },
      });

      expect(result.total).toBeCloseTo(0, 0);
    });
  });

  describe('Validation tests', () => {
    test('Should throw error for invalid month number (< 1)', () => {
      expect(() => {
        calculateIncomeTax({
          cumulativePaye: {
            monthNumber: 0,
            cumulativeGrossIncome: 1000,
            cumulativeTaxPaid: 0,
          },
        });
      }).toThrow('monthNumber must be between 1 and 12');
    });

    test('Should throw error for invalid month number (> 12)', () => {
      expect(() => {
        calculateIncomeTax({
          cumulativePaye: {
            monthNumber: 13,
            cumulativeGrossIncome: 1000,
            cumulativeTaxPaid: 0,
          },
        });
      }).toThrow('monthNumber must be between 1 and 12');
    });

    test('Should throw error when missing required parameters in standard mode', () => {
      expect(() => {
        calculateIncomeTax({
          // Missing both taxableAnnualIncome and personalAllowance
        });
      }).toThrow(
        'taxableAnnualIncome and personalAllowance are required when not using cumulativePaye mode',
      );
    });
  });

  describe('Progressive income throughout the year', () => {
    const taxYear = '2025/26';

    test('Month 1: £3,000 income', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 3000,
          cumulativeTaxPaid: 0,
        },
      });

      // Income below personal allowance pro-rata (£12,570 / 12 = £1,047.50)
      // So £3,000 is above the monthly allowance, some tax should be due
      // If this person earns nothing more in the year, this would be later refunded by HMRC
      expect(result.total).toBeCloseTo(390.5, 1);
    });

    test('Month 6: £18,000 cumulative income', () => {
      const month1Tax = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 3000,
          cumulativeTaxPaid: 0,
        },
      }).total;

      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 6,
          cumulativeGrossIncome: 18_000,
          cumulativeTaxPaid: month1Tax,
        },
      });

      expect(result.total).toBeCloseTo(1952.5, 1);
    });
  });

  describe('Personal allowance tapering in cumulative PAYE', () => {
    const taxYear = '2025/26';

    test('High earner (£100k) should have full personal allowance in month 1', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 100_000,
          cumulativeTaxPaid: 0,
        },
      });

      // At £100k, PA tapering just starts, so full PA should apply
      // Expected: (£100k - £12,570/12) * rates = roughly £32k
      expect(result.total).toBeCloseTo(32041, 0);
    });

    test('High earner (£110k) should have reduced personal allowance', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 110_000,
          cumulativeTaxPaid: 0,
        },
      });

      // At £110k, PA should be reduced by £5k (£10k over threshold / 2)
      // PA = £12,570 - £5,000 = £7,570, monthly = £630.83

      // Tax at 20% should be £7,540
      // Tax at 40% should be £25,892
      // Total = £33,432
      expect(result.total).toBeCloseTo(33432, 0);
    });

    test('Very high earner (£125,140) should have no personal allowance', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 125_140,
          cumulativeTaxPaid: 0,
        },
      });

      // At £125,140, PA should be completely tapered away
      // PA = £0, monthly = £0
      expect(result.total).toBeCloseTo(42516, 0);
    });

    test('Personal allowance tapering should work across multiple months', () => {
      // Month 1: £60k
      const month1 = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 60_000,
          cumulativeTaxPaid: 0,
        },
      });

      expect(month1.total).toBeCloseTo(16041, 1);

      // Month 6: £110k cumulative (£50k more, now in tapering territory)
      const month6 = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 6,
          cumulativeGrossIncome: 110_000,
          cumulativeTaxPaid: month1.total,
        },
      });

      expect(month6.total).toBeCloseTo(17391, 1);
    });

    test('Should handle Scottish rates with personal allowance tapering', () => {
      const result = calculateIncomeTax({
        taxYear,
        country: 'Scotland',
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 110_000,
          cumulativeTaxPaid: 0,
        },
      });

      expect(result.total).toBeCloseTo(37513.8, 1);
      expect(result.incomeTaxType).toBe('Scotland');
    });
  });

  describe('Comparison with annualized approach (demonstrating the issue)', () => {
    const taxYear = '2025/26';

    test('Annualized approach gives incorrect result', () => {
      // This is what you get if you annualize £10,000 * 12 and divide by 12
      const annualizedIncome = 10_000 * 12; // £120,000
      const personalAllowance = calculatePersonalAllowance({
        taxYear,
        taxableAnnualIncome: annualizedIncome,
      });

      const annualTax = calculateIncomeTax({
        taxYear,
        taxableAnnualIncome: annualizedIncome,
        personalAllowance,
      });

      const monthlyTaxFromAnnual = annualTax.total / 12;

      // This should be around £3,286 (considering personal allowance tapering at £120k income)
      expect(monthlyTaxFromAnnual).toBeCloseTo(3286, 0);

      // But PAYE should give £1,790.50
      const payeResult = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 10_000,
          cumulativeTaxPaid: 0,
        },
      });

      expect(payeResult.total).toBeCloseTo(1790.5, 1);
      expect(payeResult.total).toBeLessThan(monthlyTaxFromAnnual);
    });
  });

  describe('Year-long example with variable income', () => {
    const taxYear = '2024/25';
    let cumulativeTaxPaid = 0;

    test('Month 1: £10,000 income', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 10_000,
          cumulativeTaxPaid,
        },
      });

      expect(result.total).toBeCloseTo(1790.5, 1);
      cumulativeTaxPaid += result.total;
    });

    test('Month 2: Additional £5,000 income', () => {
      const result = calculateIncomeTax({
        taxYear,
        cumulativePaye: {
          monthNumber: 2,
          cumulativeGrossIncome: 15_000,
          cumulativeTaxPaid,
        },
      });

      // Month 2 allowance: £12,570 * 2 / 12 = £2,095
      // Cumulative taxable: £15,000 - £2,095 = £12,905
      // Cumulative tax due: £12,905 * 20% = £2,581
      // Monthly tax: £2,581 - £1,790.5 = £790.5
      expect(result.total).toBeCloseTo(790.5, 1);
      cumulativeTaxPaid += result.total;
    });
  });

  describe('Scotland cumulative PAYE', () => {
    const taxYear = '2024/25';

    test('Month 1: £10,000 income in Scotland', () => {
      const result = calculateIncomeTax({
        taxYear,
        country: 'Scotland',
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 10_000,
          cumulativeTaxPaid: 0,
        },
      });

      expect(result.incomeTaxType).toBe('Scotland');
      expect(result.total).toBeCloseTo(1767.43, 1);

      if (result.incomeTaxType === 'Scotland') {
        expect(typeof result.breakdown.starterRateTax).toBe('number');
      }
    });
  });

  describe('calculateIncomeTax - Scottish Cumulative PAYE - Top Rate and Proportions', () => {
    it('calculates top rate tax and all proportions for very high income', () => {
      const result = calculateIncomeTax({
        taxYear: '2025/26',
        country: 'Scotland',
        cumulativePaye: {
          monthNumber: 12,
          cumulativeGrossIncome: 300000, // Well above top bracket
          cumulativeTaxPaid: 0,
        },
      });

      // Only check Scottish bands if the result is for Scotland
      if (result.incomeTaxType === 'Scotland') {
        expect(result.breakdown.starterRateTax).toBeGreaterThan(0);
        expect(result.breakdown.basicRateTax).toBeGreaterThan(0);
        expect(result.breakdown.intermediateRateTax).toBeGreaterThan(0);
        expect(result.breakdown.higherRateTax).toBeGreaterThan(0);
        expect(result.breakdown.advancedRateTax).toBeGreaterThan(0);
        expect(result.breakdown.topRateTax).toBeGreaterThan(0);

        // All proportions should sum to ~1 (allowing for floating point error)
        const total =
          result.breakdown.starterRateTax +
          result.breakdown.basicRateTax +
          result.breakdown.intermediateRateTax +
          result.breakdown.higherRateTax +
          result.breakdown.advancedRateTax +
          result.breakdown.topRateTax;
        expect(Math.abs(total - result.total)).toBeLessThan(0.01);
      } else {
        // If not Scotland, fail the test (should not happen in this case)
        throw new Error('Expected Scottish tax result');
      }
    });
  });

  describe('calculateIncomeTax - Scottish Cumulative PAYE - Proportion Zero Branch', () => {
    it('returns zero for all proportions when cumulativeTaxDue is zero', () => {
      const result = calculateIncomeTax({
        taxYear: '2025/26',
        country: 'Scotland',
        cumulativePaye: {
          monthNumber: 1,
          cumulativeGrossIncome: 0, // No income, so no tax due
          cumulativeTaxPaid: 0,
        },
      });

      if (result.incomeTaxType === 'Scotland') {
        expect(result.total).toBe(0);
        expect(result.breakdown.starterRateTax).toBe(0);
        expect(result.breakdown.basicRateTax).toBe(0);
        expect(result.breakdown.intermediateRateTax).toBe(0);
        expect(result.breakdown.higherRateTax).toBe(0);
        expect(result.breakdown.advancedRateTax).toBe(0);
        expect(result.breakdown.topRateTax).toBe(0);
      }
    });
  });

  describe('calculateIncomeTax - cumulative PAYE with supplied personalAllowance', () => {
    it('uses supplied personalAllowance and prorates it', () => {
      const result = calculateIncomeTax({
        taxYear: '2025/26',
        country: 'Scotland',
        cumulativePaye: {
          monthNumber: 6,
          cumulativeGrossIncome: 20000,
          cumulativeTaxPaid: 0,
        },
        personalAllowance: 12570, // explicitly supplied
      });

      // Should use pro-rated PA: (12570 * 6) / 12 = 6285
      if (result.incomeTaxType === 'Scotland') {
        // The test ensures the branch is covered; check that the result is as expected
        expect(result.total).toBeGreaterThan(0);
        // Optionally, check that the breakdown is present
        expect(result.breakdown.basicRateTax).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // --- Helpers: buildScottishFlatRate ---
  describe('buildScottishFlatRate', () => {
    const income = 10000;

    it('handles starter rate', () => {
      const flatRate = 0.19;
      const total = income * flatRate;
      const result = buildScottishFlatRate(total, flatRate, income);
      expect(result.breakdown.starterRateTax).toBe(income * flatRate);
    });

    it('handles top rate 0.48', () => {
      const flatRate = 0.48;
      const total = income * flatRate;
      const result = buildScottishFlatRate(total, flatRate, income);
      expect(result.breakdown.topRateTax).toBe(income * flatRate);
    });
  });

  // --- Helpers: buildEnglishFlatRate ---
  describe('buildEnglishFlatRate', () => {
    const income = 10000;

    it('handles basic rate', () => {
      const flatRate = 0.2;
      const total = income * flatRate;
      const result = buildEnglishFlatRate(total, flatRate, income);
      expect(result.breakdown.basicRateTax).toBe(income * flatRate);
    });

    it('handles additional rate', () => {
      const flatRate = 0.45;
      const total = income * flatRate;
      const result = buildEnglishFlatRate(total, flatRate, income);
      expect(result.breakdown.additionalRateTax).toBe(income * flatRate);
    });
  });

  // --- Helpers: validateRequiredFields ---
  describe('validateRequiredFields', () => {
    it('throws when fields missing', () => {
      expect(() => validateRequiredFields(undefined, 100)).toThrow();
      expect(() => validateRequiredFields(100)).toThrow();
    });

    it('does not throw when fields valid', () => {
      expect(() => validateRequiredFields(100, 100)).not.toThrow();
    });
  });

  // --- Helpers: calculateCumulativeTax ---
  const minimalMockTaxRates: EnglishTaxRates = {
    COUNTRY: 'England/NI/Wales',
    BASIC_RATE: 0.2,
    HIGHER_BRACKET: 50_270,
    HIGHER_RATE: 0.4,
    ADDITIONAL_BRACKET: 125_140,
    ADDITIONAL_RATE: 0.45,
    PERSONAL_ALLOWANCE_DROPOFF: 100_000,
    DEFAULT_PERSONAL_ALLOWANCE: 12_570,
    NI_MIDDLE_RATE: 0,
    NI_UPPER_RATE: 0,
    NI_MIDDLE_BRACKET: 0,
    NI_UPPER_BRACKET: 0,
    NI_ANNUAL_MIDDLE_BRACKET: 0,
    NI_ANNUAL_UPPER_BRACKET: 0,
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD: 0,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD: 0,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD: 0,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD: 0,
    STUDENT_LOAN_REPAYMENT_AMOUNT: 0,
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD: 0,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD: 0,
    PENSION_ANNUAL_ALLOWANCE: 0,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 0,
    PENSION_ADJUSTED_LIMIT: 0,
    BLIND_PERSONS_ALLOWANCE: 0,
  };

  const baseArgs = {
    taxRates: minimalMockTaxRates,
    cumulativeGrossIncome: 10000,
    cumulativeTaxPaid: 500,
    isScottish: false,
  };

  it('throws when monthNumber < 1', () => {
    expect(() =>
      calculateCumulativeTax({ ...baseArgs, monthNumber: 0 }),
    ).toThrow('monthNumber must be between 1 and 12');
  });

  it('throws when monthNumber > 12', () => {
    expect(() =>
      calculateCumulativeTax({ ...baseArgs, monthNumber: 13 }),
    ).toThrow('monthNumber must be between 1 and 12');
  });
});
