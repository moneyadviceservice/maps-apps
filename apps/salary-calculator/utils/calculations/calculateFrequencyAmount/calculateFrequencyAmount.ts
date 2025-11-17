interface FrequencyAmountOptions {
  yearlyAmount: number;
  daysPerWeek?: number;
  processor?: (amount: number) => number;
}

export interface FrequencyAmount {
  yearly: number;
  monthly: number;
  weekly: number;
  daily: number;
}

function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/** Calculates the frequency (yearly/monthly/weekly/daily) amounts for given yearly amount */
export function calculateFrequencyAmount({
  yearlyAmount,
  daysPerWeek = 5,
  processor = (amount) => amount,
}: FrequencyAmountOptions): FrequencyAmount {
  const yearly = processor(yearlyAmount);
  const monthly = round2(processor(yearlyAmount / 12));
  const weekly = round2(processor(yearlyAmount / 52));
  const daily = round2(processor(yearlyAmount / (52 * daysPerWeek)));

  return {
    yearly,
    monthly,
    weekly,
    daily,
  };
}
