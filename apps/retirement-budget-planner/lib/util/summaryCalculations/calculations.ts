import {
  DEFAULT_FACTOR,
  FREQUENCY_FACTOR_MAPPING,
} from 'lib/constants/pageConstants';
import { FrequencyType } from 'lib/types/page.type';
import { SummaryType } from 'lib/types/summary.type';

import { SUMMARY_TOTAL_STATUS_TYPES } from '@maps-react/pension-tools/components/SummaryTotal/SummaryTotal';

/**
 * Summarize the income or spending input
 * multiplied by selected frequency factor
 * @param data
 * @param factorSuffix
 * @returns the sum as a number
 */
export const sumFields = (
  data: Record<string, string>,
  factorSuffix = 'Frequency',
) => {
  let value = 0;
  let factor = DEFAULT_FACTOR;
  if (!data) return 0;
  return Object.keys(data).reduce((carry, property) => {
    if (!property.includes(factorSuffix)) {
      value = Number.parseFloat(deformatNumber(data[property]));

      factor = getFactorValue(
        FREQUENCY_FACTOR_MAPPING,
        data[`${property}${factorSuffix}`],
      );

      return factor && value ? value * factor + carry : carry;
    }

    return carry;
  }, 0);
};

/**
 * Filter frequency info array by frequency property
 * @param mapping
 * @param property
 * @returns the factor number
 */
export const getFactorValue = (mapping: FrequencyType[], property: string) =>
  mapping.find((f) => f.key === property)?.value ?? DEFAULT_FACTOR;

/**
 * @param num
 * @return number without any format like comma or point
 */
export const deformatNumber = (num: string) => {
  return Number.parseInt(num) ? num?.replaceAll(/[.,]/g, '') : num;
};

/**
 *
 * @param summary
 * @returns the summary total number
 */
export const calculateSummary = (summary: SummaryType) => {
  if (!summary || Object.keys(summary).length === 0) return 0;
  const { income, spending } = summary;
  return income - spending;
};

/**
 *
 * @param summary
 * @returns
 * "negative" if total is a negative number
 * "positive" if income minus 5% of income is not a negative number
 * "balanced" if income is a range between 0 and income minus 5% of income
 *
 */
export const calculateOutcomeRange = (summary: SummaryType) => {
  const { income, spending } = summary;
  const total = calculateSummary(summary);
  const maxtotal = income + (-(income * (5 / 100)) - spending);

  return total < 0
    ? SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE
    : maxtotal > 0
    ? SUMMARY_TOTAL_STATUS_TYPES.POSITIVE
    : SUMMARY_TOTAL_STATUS_TYPES.BALANCED;
};
