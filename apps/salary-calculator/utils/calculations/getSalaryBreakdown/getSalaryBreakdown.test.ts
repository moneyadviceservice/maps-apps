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

  it('includes capped income tax in total deductions for a K code', () => {
    const result = getSalaryBreakdown({
      ...baseInput,
      grossIncome: 40000,
      pensionValue: 10,
      taxYear: '2026/27',
      taxCode: 'K8000',
      studentLoanPlans: [true, false, false, false, false],
    });

    expect(result.employeePensionContributions.yearly).toBe(4000);
    expect(result.incomeTax.yearly).toBe(20000);
    expect(result.nationalInsurance.yearly).toBe(2194.4);
    expect(result.studentLoan.total.yearly).toBe(1254);
    expect(result.totalDeductions.yearly).toBeCloseTo(27448.4, 2);
    expect(result.netSalary.yearly).toBe(12551.6);
  });

  it.each<{
    grossIncome: number;
    country: Country;
    pensionType: SalaryBreakdownInput['pensionType'];
    pensionValue: number;
    taxCode: string;
    annualTax: number;
    netSalary: {
      yearly: number;
      monthly: number;
      weekly: number;
      daily: number;
    };
  }>([
    {
      grossIncome: 79000,
      country: 'England/NI/Wales',
      pensionType: 'percentage',
      pensionValue: 0,
      taxCode: 'K7000',
      annualTax: 39500,
      netSalary: {
        yearly: 35909.4,
        monthly: 2992.45,
        weekly: 690.57,
        daily: 138.11,
      },
    },
    {
      grossIncome: 64000,
      country: 'England/NI/Wales',
      pensionType: 'percentage',
      pensionValue: 5,
      taxCode: 'K6500',
      annualTax: 32000,
      netSalary: {
        yearly: 25509.4,
        monthly: 2125.78,
        weekly: 490.57,
        daily: 98.11,
      },
    },
    {
      grossIncome: 52500,
      country: 'England/NI/Wales',
      pensionType: 'percentage',
      pensionValue: 3,
      taxCode: 'K5000',
      annualTax: 26250,
      netSalary: {
        yearly: 21614.4,
        monthly: 1801.2,
        weekly: 415.66,
        daily: 83.13,
      },
    },
    {
      grossIncome: 41350,
      country: 'Scotland',
      pensionType: 'fixed',
      pensionValue: 200,
      taxCode: 'K4500',
      annualTax: 20675,
      netSalary: {
        yearly: 15972.6,
        monthly: 1331.05,
        weekly: 307.17,
        daily: 61.43,
      },
    },
    {
      grossIncome: 29091,
      country: 'Scotland',
      pensionType: 'percentage',
      pensionValue: 0,
      taxCode: 'K3000',
      annualTax: 14545.5,
      netSalary: {
        yearly: 13223.82,
        monthly: 1101.99,
        weekly: 254.3,
        daily: 50.86,
      },
    },
  ])(
    'caps annual tax and calculates net pay for £$grossIncome with $taxCode in $country',
    ({ annualTax, netSalary, ...input }) => {
      const result = getSalaryBreakdown({
        ...baseInput,
        ...input,
        frequency: 'annual',
        taxYear: '2026/27',
      });

      expect(result.incomeTax.yearly).toBe(annualTax);
      expect(result.netSalary).toStrictEqual(netSalary);
    },
  );

  it('handles fixed pension type as monthly amount', () => {
    const fixedPensionInput: SalaryBreakdownInput = {
      ...baseInput,
      pensionType: 'fixed',
      pensionValue: 200, // monthly
    };
    const result = getSalaryBreakdown(fixedPensionInput);
    expect(result.employeePensionContributions.yearly).toBeCloseTo(2400, 2); // 200 * 12
  });

  it('calculates employer pension contributions without changing the deductions', () => {
    const withoutEmployer = getSalaryBreakdown(baseInput);
    const withEmployer = getSalaryBreakdown({
      ...baseInput,
      employerPensionType: 'percentage',
      employerPensionValue: 10,
    });

    expect(withEmployer.employerPensionContributions.yearly).toBeCloseTo(
      5000,
      2,
    );
    expect(withEmployer.employerPensionContributions.monthly).toBeCloseTo(
      416.67,
      2,
    );
    expect(withEmployer.employerPensionContributions.weekly).toBeCloseTo(
      96.15,
      2,
    );
    expect(withEmployer.employerPensionContributions.daily).toBeCloseTo(
      19.23,
      2,
    );

    expect(withEmployer.incomeTax).toEqual(withoutEmployer.incomeTax);
    expect(withEmployer.nationalInsurance).toEqual(
      withoutEmployer.nationalInsurance,
    );
    expect(withEmployer.netSalary).toEqual(withoutEmployer.netSalary);
    expect(withEmployer.totalDeductions).toEqual(
      withoutEmployer.totalDeductions,
    );
  });

  it('handles fixed employer pension type as monthly amount', () => {
    const result = getSalaryBreakdown({
      ...baseInput,
      employerPensionType: 'fixed',
      employerPensionValue: 200, // monthly
    });
    expect(result.employerPensionContributions.yearly).toBeCloseTo(2400, 2);
  });

  it('defaults employer pension contributions to 0', () => {
    const result = getSalaryBreakdown(baseInput);
    expect(result.employerPensionContributions).toEqual({
      yearly: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
    });
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

  it('includes student loan correctly in total deductions', () => {
    const studentLoanInput: SalaryBreakdownInput = {
      ...baseInput,
      studentLoanPlans: [true, false, false, false, false], // e.g., Plan 1 active
    };

    const result = getSalaryBreakdown(studentLoanInput);

    const expectedYearly =
      result.employeePensionContributions.yearly +
      result.incomeTax.yearly +
      result.nationalInsurance.yearly +
      result.studentLoan.total.yearly;

    expect(result.totalDeductions.yearly).toBeCloseTo(expectedYearly, 2);

    expect(result.totalDeductions.monthly).toBeCloseTo(
      result.employeePensionContributions.monthly +
        result.incomeTax.monthly +
        result.nationalInsurance.monthly +
        result.studentLoan.total.monthly,
      2,
    );

    expect(result.totalDeductions.weekly).toBeCloseTo(
      result.employeePensionContributions.weekly +
        result.incomeTax.weekly +
        result.nationalInsurance.weekly +
        result.studentLoan.total.weekly,
      2,
    );
  });
});
