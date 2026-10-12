import { costDefaultFrequencies } from 'data/essentialOutgoingsData';
import {
  DEFAULT_FACTOR,
  FREQUENCY_FACTOR_MAPPING,
  FREQUENCY_KEYS,
} from 'lib/constants/pageConstants';
import { CostsFieldTypes, FrequencyType } from 'lib/types/page.type';
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
  defaultFreqMap: {
    moneyInputName: string;
    defaultFrequency: FREQUENCY_KEYS;
  }[],
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
        property,
        defaultFreqMap,
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
export const getFactorValue = (
  mapping: FrequencyType[],
  cachedFactor: string,
  property: string,
  defaultFacrtorMap: {
    moneyInputName: string;
    defaultFrequency: FREQUENCY_KEYS;
  }[],
) => {
  const factorByCachedVal = mapping.find((f) => f.key === cachedFactor)?.value;

  if (!factorByCachedVal) {
    const defaultFreq = defaultFacrtorMap.find(
      (dFactor) => dFactor.moneyInputName === property,
    )?.defaultFrequency;
    const defaultFactor = mapping.find((f) => f.key === defaultFreq)?.value;

    return defaultFactor ?? DEFAULT_FACTOR;
  }

  return factorByCachedVal;
};

/**
 * @param num
 * @return number without any format like comma or point
 */
export const deformatNumber = (num: string) =>
  Number.parseInt(num) ? num?.replaceAll(',', '') : num;

/**
 *
 * @param summary
 * @returns the summary total number
 */
export const calculateSummary = (summary: SummaryType) => {
  if (!summary || Object.keys(summary).length === 0) return 0;
  const { income, spending } = summary;
  // Guard against -0 from floating-point subtraction (e.g. 100 - 100 = -0)
  return income - spending || 0;
};

/**
 *
 * @param summary
 * @returns
 * "negative" if retirement costs exceed retirement income (spending > income)
 * "positive" if retirement income matches or exceeds retirement costs (income >= spending)
 *
 */
export const calculateOutcomeRange = (summary: SummaryType) => {
  const total = calculateSummary(summary);
  return total < 0
    ? SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE
    : SUMMARY_TOTAL_STATUS_TYPES.POSITIVE;
};

/**
 * Breakdown and summarize costs per section
 * @param costs
 * @param costsModel
 * @param divider
 * @returns object {name: <name of section>, value: <the sum of costs of the section>}
 */
export const costBreakdown = (
  costs: Record<string, string>,
  costsModel: CostsFieldTypes[],
  divider = 1,
) => {
  return costsModel.map(({ sectionName, items }) => {
    const itemsPerSection: Record<string, string> = items.reduce(
      (acc, { moneyInputName, frequencyName, defaultFrequency }) => {
        const value = costs[moneyInputName];
        const frequency = costs[frequencyName] ?? defaultFrequency;
        return {
          ...acc,
          [moneyInputName]: value,
          [frequencyName]: frequency,
        };
      },
      {},
    );

    return {
      name: sectionName,
      value:
        sumFields(itemsPerSection, costDefaultFrequencies(), 'Frequency') /
        divider,
    };
  });
};
