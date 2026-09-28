import { calculateEmployeeNationalInsurance } from './nationalInsurance';

const cases = [
  {
    taxableAnnualIncome: 12_570,
    expected: 0,
  },
  {
    taxableAnnualIncome: 20_000,
    expected: 594.4,
  },
  {
    taxableAnnualIncome: 50_270,
    expected: 3016,
  },
  {
    taxableAnnualIncome: 79_000,
    expected: 3590.6,
  },
  {
    taxableAnnualIncome: 100_000,
    expected: 4010.6,
  },
  {
    taxableAnnualIncome: 134_000,
    expected: 4690.6,
  },
];

describe('calculateEmployeeNationalInsurance (2025/26)', () => {
  test.each(cases)(
    'taxableAnnualIncome £$taxableAnnualIncome',
    ({ taxableAnnualIncome, expected }) => {
      const result = calculateEmployeeNationalInsurance({
        taxYear: '2025/26',
        country: 'England/NI/Wales',
        taxableAnnualIncome,
      });
      expect(result).toBeCloseTo(expected, 2);
    },
  );
  it('returns 0 NI if isOverStatePensionAge is true', () => {
    const result = calculateEmployeeNationalInsurance({
      taxYear: '2025/26',
      country: 'England/NI/Wales',
      taxableAnnualIncome: 100_000,
      isOverStatePensionAge: true,
    });
    expect(result).toBe(0);
  });
});
