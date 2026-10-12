export type Frequency = 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';

export type FrequencySelector = {
  enterDaysPerWeek: (days: number, salaryNumber?: 1 | 2) => Promise<void>;
  enterHoursPerWeek: (hours: number, salaryNumber?: 1 | 2) => Promise<void>;
};

export async function applyFrequencyDetails(
  calculator: FrequencySelector,
  frequency: Frequency,
  daysPerWeek: number | undefined,
  hoursPerWeek: number | undefined,
  salaryNumber: 1 | 2 = 1,
): Promise<void> {
  if (frequency === 'daily' && daysPerWeek) {
    await calculator.enterDaysPerWeek(daysPerWeek, salaryNumber);
    return;
  }

  if (frequency === 'hourly' && hoursPerWeek) {
    await calculator.enterHoursPerWeek(hoursPerWeek, salaryNumber);
  }
}
