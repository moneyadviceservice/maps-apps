import Decimal from 'decimal.js';
import { getDaysPerWeek } from 'utils/helpers/getDaysPerWeek';

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

/**
 * Calculates frequency breakdowns (monthly, weekly, daily) from an annual amount.
 *
 * ⚠️ This utility is ONLY for linear, annual-based deductions such as tax, NI, and pension.
 *    Do NOT use for student loan repayments — those must be calculated per-frequency
 *    because their thresholds and rules are not linear.
 *
 * @param options - The configuration object.
 * @param options.yearlyAmount - The base yearly amount before processing.
 * @param options.daysPerWeek - Number of working days per week (defaults to 5).
 * @param options.processor - Optional function to transform each calculated frequency.
 *
 * @returns {FrequencyAmount} An object containing yearly, monthly, weekly, and daily amounts.
 *
 */

export function calculateFrequencyAmount({
  yearlyAmount,
  daysPerWeek = 5,
  processor = (amount) => amount,
}: FrequencyAmountOptions): FrequencyAmount {
  const safeDaysPerWeek = getDaysPerWeek(daysPerWeek);

  const yearly = processor(yearlyAmount);

  const monthly = new Decimal(processor(yearlyAmount / 12))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    .toNumber();

  const weekly = new Decimal(processor(yearlyAmount / 52))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    .toNumber();

  const daily = new Decimal(processor(yearlyAmount / (52 * safeDaysPerWeek)))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    .toNumber();

  return { yearly, monthly, weekly, daily };
}
