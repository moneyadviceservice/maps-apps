export type PayFrequency = 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';

interface ConvertToAnnualSalaryOptions {
  grossIncome: number; // the pay amount the user entered
  frequency: PayFrequency;
  daysPerWeek?: number; // required if frequency === 'daily'
  hoursPerWeek?: number; // required if frequency === 'hourly'
}

/**
 * Converts a pay amount based on frequency into an annual gross salary.
 * Handles daily and hourly cases using user-input working patterns.
 */
export function convertToAnnualSalary({
  grossIncome,
  frequency,
  daysPerWeek,
  hoursPerWeek,
}: ConvertToAnnualSalaryOptions): number {
  switch (frequency) {
    case 'annual':
      return grossIncome;

    case 'monthly':
      return grossIncome * 12;

    case 'weekly':
      return grossIncome * 52;

    case 'daily':
      if (daysPerWeek) {
        return grossIncome * daysPerWeek * 52;
      }

      return -1;

    case 'hourly':
      if (hoursPerWeek) {
        return grossIncome * hoursPerWeek * 52;
      }

      return -1;

    default:
      return -1;
  }
}
