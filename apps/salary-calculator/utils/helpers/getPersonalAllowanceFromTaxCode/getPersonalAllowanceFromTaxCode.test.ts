import { calculatePersonalAllowance } from '../personalAllowance';
import { TaxYear } from 'utils/rates/types';

describe('calculatePersonalAllowance', () => {
  const defaultAllowance = 12570;
  const taxYear = '2025/26' as TaxYear;

  const cases: Array<{
    taxableAnnualIncome: number;
    taxCode?: string;
    isBlindPerson?: boolean;
    allowance: number;
  }> = [
    // No Tax Code (tapering)
    { taxableAnnualIncome: 30_000, allowance: defaultAllowance },
    { taxableAnnualIncome: 110_000, allowance: 7570 },
    { taxableAnnualIncome: 120_000, allowance: 2570 },
    { taxableAnnualIncome: 175_000, allowance: 0 },
    { taxableAnnualIncome: 200_000, allowance: 0 },

    // Numeric Tax Code
    { taxableAnnualIncome: 50_000, taxCode: '1257L', allowance: 12570 },
    { taxableAnnualIncome: 120_000, taxCode: '1373M', allowance: 13730 },
    { taxableAnnualIncome: 110_000, taxCode: '1100T', allowance: 11000 },
    { taxableAnnualIncome: 175_000, taxCode: 'K475', allowance: -4750 },

    // Non-Numeric / Special Tax Codes
    { taxableAnnualIncome: 50_000, taxCode: 'BR', allowance: 0 },
    { taxableAnnualIncome: 100_000, taxCode: 'NT', allowance: 0 },

    // Blind Person - No Tax Code
    { taxableAnnualIncome: 60_000, isBlindPerson: true, allowance: 15700 },
    { taxableAnnualIncome: 120_000, isBlindPerson: true, allowance: 5700 },

    // Blind Person - Numeric Tax Code
    {
      taxableAnnualIncome: 50_000,
      taxCode: '1257L',
      isBlindPerson: true,
      allowance: 12570,
    },
    {
      taxableAnnualIncome: 120_000,
      taxCode: '1373M',
      isBlindPerson: true,
      allowance: 13730,
    },

    // Edge Cases
    { taxableAnnualIncome: 0, allowance: defaultAllowance },
    { taxableAnnualIncome: -5000, allowance: defaultAllowance },

    // Zero Allowance 0X Codes
    ...['0T', '0M', '0N', '0L', 'C0T', 'C0M', 'S0N', 'S0L', 'XYZ'].map(
      (code) => ({
        taxableAnnualIncome: 50_000,
        taxCode: code,
        allowance: 0,
      }),
    ),
  ];

  it.each(cases)(
    'Income: £$taxableAnnualIncome, Tax Code: $taxCode, Blind: $isBlindPerson',
    ({ taxableAnnualIncome, taxCode, isBlindPerson, allowance }) => {
      expect(
        calculatePersonalAllowance({
          taxYear,
          taxableAnnualIncome,
          taxCode,
          isBlindPerson,
        }),
      ).toEqual(allowance);
    },
  );

  it('handles negative taxableAnnualIncome and covers negative deduction branch', () => {
    const result = calculatePersonalAllowance({
      taxableAnnualIncome: -5000,
      taxYear,
    });
    expect(result).toBe(defaultAllowance);
  });
});
