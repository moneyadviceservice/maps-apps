import { convertToAnnualSalary, PayFrequency } from './convertToAnnualSalary';

describe('convertToAnnualSalary', () => {
  it('returns the same amount for yearly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 50000, frequency: 'annual' }),
    ).toEqual(50000);
  });

  it('multiplies by 12 for monthly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 2000, frequency: 'monthly' }),
    ).toEqual(24000);
  });

  it('multiplies by 52 for weekly frequency', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 500, frequency: 'weekly' }),
    ).toEqual(26000);
  });

  it('calculates annual salary for daily frequency with daysPerWeek', () => {
    expect(
      convertToAnnualSalary({
        grossIncome: 100,
        frequency: 'daily',
        daysPerWeek: 5,
      }),
    ).toEqual(26000);
  });

  it('throws error for daily frequency without daysPerWeek', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 100, frequency: 'daily' }),
    ).toEqual(-1);
  });

  it('calculates annual salary for hourly frequency with hoursPerWeek', () => {
    expect(
      convertToAnnualSalary({
        grossIncome: 20,
        frequency: 'hourly',
        hoursPerWeek: 40,
      }),
    ).toEqual(41600);
  });

  it('throws error for hourly frequency without hoursPerWeek', () => {
    expect(
      convertToAnnualSalary({ grossIncome: 20, frequency: 'hourly' }),
    ).toEqual(-1);
  });

  it('returns 0 for unsupported frequency', () => {
    expect(
      convertToAnnualSalary({
        grossIncome: 100,
        frequency: 'fortnightly' as PayFrequency,
      }),
    ).toEqual(-1);
  });
});
