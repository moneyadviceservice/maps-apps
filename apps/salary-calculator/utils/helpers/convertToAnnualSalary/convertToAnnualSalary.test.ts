import { convertToAnnualSalary } from './convertToAnnualSalary';

describe('convertToAnnualSalary', () => {
  it('returns the same amount for yearly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 50000, frequency: 'annual' }),
    ).toBe(50000);
  });

  it('multiplies by 12 for monthly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 2000, frequency: 'monthly' }),
    ).toBe(24000);
  });

  it('multiplies by 52 for weekly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 500, frequency: 'weekly' }),
    ).toBe(26000);
  });

  it('calculates annual salary for daily frequency with daysPerWeek', () => {
    expect(
      convertToAnnualSalary({
        grossIncome: 100,
        frequency: 'daily',
        daysPerWeek: 5,
      }),
    ).toBe(26000);
  });

  it('throws error for daily frequency without daysPerWeek', () => {
    expect(() =>
      convertToAnnualSalary({ grossIncome: 100, frequency: 'daily' }),
    ).toThrow('daysPerWeek is required for daily pay calculation');
  });

  it('calculates annual salary for hourly frequency with hoursPerWeek', () => {
    expect(
      convertToAnnualSalary({
        grossIncome: 20,
        frequency: 'hourly',
        hoursPerWeek: 40,
      }),
    ).toBe(41600);
  });

  it('throws error for hourly frequency without hoursPerWeek', () => {
    expect(() =>
      convertToAnnualSalary({ grossIncome: 20, frequency: 'hourly' }),
    ).toThrow('hoursPerWeek is required for hourly pay calculation');
  });

  it('throws error for unsupported frequency', () => {
    expect(() =>
      // @ts-expect-error testing unsupported frequency
      convertToAnnualSalary({ grossIncome: 100, frequency: 'fortnightly' }),
    ).toThrow('Unsupported frequency: fortnightly');
  });
});
