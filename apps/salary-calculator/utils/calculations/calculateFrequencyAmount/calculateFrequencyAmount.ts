interface FrequencyAmountOptions {
  yearlyAmount: number;
  daysPerWeek?: number;
}

export interface FrequencyAmount {
  yearly: number;
  monthly: number;
  weekly: number;
  daily: number;
}

/** Calculates the frequency (yearly/monthly/weekly/daily) amounts for given yearly amount */
export function calculateFrequencyAmount({
  yearlyAmount,
  daysPerWeek = 5,
}: FrequencyAmountOptions): FrequencyAmount {
  const yearly = yearlyAmount;
  const monthly = Number((yearlyAmount / 12).toFixed(2));
  const weekly = Number((yearlyAmount / 52).toFixed(2));
  const daily = Number((yearlyAmount / (52 * daysPerWeek)).toFixed(2));

  return {
    yearly,
    monthly,
    weekly,
    daily,
  };
}
