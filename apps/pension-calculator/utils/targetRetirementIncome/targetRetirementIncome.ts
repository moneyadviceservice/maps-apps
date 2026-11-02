import {
  FREQUENCY_MONTH,
  FREQUENCY_WEEK,
  type FrequencyValue,
} from 'data/frequency';

/** A week is 1/52 of the annual target. A month is 1/12. */
const WEEKS_IN_YEAR = 52;

/**
 * A salary on a shared boundary uses the lower percentage: £15,900 is 70%
 * and £67,000 is 50%. The acceptance criteria also list those pounds in the
 * band above.
 */
const THRESHOLD_70_PERCENT = 15_900;
const THRESHOLD_67_PERCENT = 29_001;
const THRESHOLD_60_PERCENT = 42_001;
const THRESHOLD_50_PERCENT = 67_000;

export const SALARY_BANDS = [
  { min: 0, max: THRESHOLD_70_PERCENT - 1, rate: 80 },
  { min: THRESHOLD_70_PERCENT, max: THRESHOLD_67_PERCENT - 1, rate: 70 },
  { min: THRESHOLD_67_PERCENT, max: THRESHOLD_60_PERCENT - 1, rate: 67 },
  { min: THRESHOLD_60_PERCENT, max: THRESHOLD_50_PERCENT - 1, rate: 60 },
  { min: THRESHOLD_50_PERCENT, max: null, rate: 50 },
] as const;

export type TargetRetirementIncome = {
  annualSalary: number;
  replacementRate: number;
  annualTarget: number;
};

const parseAmount = (value: string): number => {
  const normalised = value.replaceAll(',', '').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) {
    return 0;
  }

  return Number(normalised);
};

/** Convert a gross-pay amount into a yearly figure before the replacement rate. */
export const annualAmount = (
  amount: number,
  frequency: FrequencyValue,
): number => {
  if (frequency === FREQUENCY_MONTH) {
    return amount * 12;
  }

  if (frequency === FREQUENCY_WEEK) {
    return amount * WEEKS_IN_YEAR;
  }

  return amount;
};

/** Convert a yearly amount into the duration shown on the page. */
export const amountForFrequency = (
  yearlyAmount: number,
  frequency: FrequencyValue,
): number => {
  if (frequency === FREQUENCY_MONTH) {
    return yearlyAmount / 12;
  }

  if (frequency === FREQUENCY_WEEK) {
    return yearlyAmount / WEEKS_IN_YEAR;
  }

  return yearlyAmount;
};

export const replacementRate = (annualSalary: number): number => {
  if (annualSalary >= THRESHOLD_50_PERCENT) {
    return 50;
  }

  if (annualSalary >= THRESHOLD_60_PERCENT) {
    return 60;
  }

  if (annualSalary >= THRESHOLD_67_PERCENT) {
    return 67;
  }

  if (annualSalary >= THRESHOLD_70_PERCENT) {
    return 70;
  }

  return 80;
};

export const targetRetirementIncome = (
  grossPay: string,
  payFrequency: FrequencyValue,
): TargetRetirementIncome => {
  const annualSalary = annualAmount(parseAmount(grossPay), payFrequency);
  const rate = replacementRate(annualSalary);

  return {
    annualSalary,
    replacementRate: rate,
    annualTarget: (annualSalary * rate) / 100,
  };
};

/** Round to the nearest pound after the duration conversion. */
export const displayedTarget = (
  annualTarget: number,
  frequency: FrequencyValue,
): number => Math.round(amountForFrequency(annualTarget, frequency));

export const formatPounds = (amount: number): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

export const salaryBandLabel = (
  band: (typeof SALARY_BANDS)[number],
  labels: { upTo: string; to: string; andAbove: string },
): string => {
  if (band.min === 0 && band.max !== null) {
    return `${labels.upTo} ${formatPounds(band.max)}`;
  }

  if (band.max === null) {
    return `${formatPounds(band.min)} ${labels.andAbove}`;
  }

  return `${formatPounds(band.min)} ${labels.to} ${formatPounds(band.max)}`;
};
