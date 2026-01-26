import { getSalaryBreakdown, SalaryBreakdownInput } from './getSalaryBreakdown';
import { convertToAnnualSalary } from 'utils/helpers/convertToAnnualSalary';
import { Country } from 'utils/rates';
import { TaxYear } from 'utils/rates/types';

describe('getSalaryBreakdown', () => {
  const baseInput: SalaryBreakdownInput = {
    grossIncome: 50000,
    frequency: 'annual',
    pensionType: 'percentage',
    pensionValue: 5,
    country: 'England/NI/Wales' as Country,
    taxYear: '2025/26' as TaxYear,
    daysPerWeek: 5, // Default to 5 days per week
  };

  it('calculates annual salary correctly', () => {
    const result = getSalaryBreakdown(baseInput);

    const expectedAnnual = convertToAnnualSalary({
      grossIncome: baseInput.grossIncome,
      frequency: baseInput.frequency,
      daysPerWeek: baseInput.daysPerWeek,
      hoursPerWeek: baseInput.hoursPerWeek,
    });

    expect(result.grossSalary.yearly).toBeCloseTo(expectedAnnual, 2);
  });

  it('calculates employee pension contributions (percentage)', () => {
    const result = getSalaryBreakdown(baseInput);
    expect(result.employeePensionContributions.yearly).toBeCloseTo(2500, 2);
  });

  it('calculates net salary including tax and NI', () => {
    const result = getSalaryBreakdown(baseInput);
    expect(result.incomeTax.yearly).toBeGreaterThanOrEqual(0);
    expect(result.nationalInsurance.yearly).toBeGreaterThanOrEqual(0);
    expect(result.netSalary.yearly).toBeCloseTo(
      baseInput.grossIncome -
        result.employeePensionContributions.yearly -
        result.incomeTax.yearly -
        result.nationalInsurance.yearly,
      2,
    );
  });

  it('handles fixed pension type as monthly amount', () => {
    const fixedPensionInput: SalaryBreakdownInput = {
      ...baseInput,
      pensionType: 'fixed',
      pensionValue: 200, // monthly
    };
    const result = getSalaryBreakdown(fixedPensionInput);
    expect(result.employeePensionContributions.yearly).toBeCloseTo(2400, 2); // 200 * 12
  });

  it('calculates correctly for monthly salary input', () => {
    const monthlyInput: SalaryBreakdownInput = {
      grossIncome: 4000,
      frequency: 'monthly',
      pensionType: 'percentage',
      pensionValue: 5,
      country: 'England/NI/Wales' as Country,
      taxYear: '2025/26' as TaxYear,
      daysPerWeek: 0,
    };

    const result = getSalaryBreakdown(monthlyInput);

    const expectedAnnual = 48000;

    expect(result.grossSalary.yearly).toBeCloseTo(expectedAnnual, 2);

    expect(result.employeePensionContributions.yearly).toBeCloseTo(
      expectedAnnual * 0.05,
      2,
    );

    expect(result.netSalary.yearly).toBeCloseTo(
      result.grossSalary.yearly -
        result.employeePensionContributions.yearly -
        result.incomeTax.yearly -
        result.nationalInsurance.yearly,
      2,
    );
  });

  it('handles high precision pension percentages', () => {
    const highPrecisionInput = { ...baseInput, pensionValue: 2.3456 };
    const result = getSalaryBreakdown(highPrecisionInput);
    expect(result.employeePensionContributions.yearly).toBeCloseTo(1172.8, 2); // 50000 * 2.3456 / 100
  });
});
