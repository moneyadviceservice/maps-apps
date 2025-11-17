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

    case 'daily': {
      if (!daysPerWeek || daysPerWeek <= 0) {
        throw new Error('daysPerWeek is required for daily pay calculation');
      }
      return grossIncome * daysPerWeek * 52;
    }

    case 'hourly': {
      if (!hoursPerWeek || hoursPerWeek <= 0) {
        throw new Error('hoursPerWeek is required for hourly pay calculation');
      }
      return grossIncome * hoursPerWeek * 52;
    }

    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}
