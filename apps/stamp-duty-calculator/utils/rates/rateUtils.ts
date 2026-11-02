import { isAfter, isBefore, isEqual } from 'date-fns';

// Generic interfaces for rate structures
export interface TaxBand {
  start: number;
  end: number | null;
  rate: number;
}

export interface RatePeriod {
  startDate: Date;
  endDate: Date | null;
  bands: TaxBand[];
  threshold?: number; // For first-time buyer price threshold
  additionalTax?: number; // For additional property surcharge
  minThreshold?: number; // Minimum price for additional tax to apply
}

export interface BuyerTypeRateConfiguration<T = string> {
  buyerType: T;
  periods: RatePeriod[];
}

/**
 * Gets the rate configuration for a specific buyer type
 * @param buyerType - The type of buyer
 * @param configurations - Array of buyer type configurations to search
 * @param fallbackBuyerType - Fallback buyer type if the requested one is not found
 * @returns The configuration for that buyer type
 */
export const getBuyerConfiguration = <T extends string>(
  buyerType: T,
  configurations: BuyerTypeRateConfiguration<T>[],
  fallbackBuyerType: T,
): BuyerTypeRateConfiguration<T> => {
  const config = configurations.find((c) => c.buyerType === buyerType);
  if (!config) {
    // Fallback to specified buyer type
    const fallback = configurations.find(
      (c) => c.buyerType === fallbackBuyerType,
    );
    if (!fallback) {
      throw new Error(
        `No configuration found for buyer type: ${buyerType} or fallback: ${fallbackBuyerType}`,
      );
    }
    return fallback;
  }
  return config;
};

// Base interface that both RatePeriod and ContentPeriod must satisfy
export interface PeriodBase {
  startDate: Date;
  endDate: Date | null;
}

/**
 * Selects the appropriate rate period based on the effective date
 * @param periods - Array of periods to search (must have startDate and endDate)
 * @param effectiveDate - The date to check against periods
 * @returns The matching period
 */
export const getRatePeriod = <Period extends PeriodBase>(
  periods: Period[],
  effectiveDate: Date,
): Period => {
  for (const period of periods) {
    const isAfterOrOnStart =
      isAfter(effectiveDate, period.startDate) ||
      isEqual(effectiveDate, period.startDate);
    const isBeforeOrOnEnd =
      !period.endDate ||
      isBefore(effectiveDate, period.endDate) ||
      isEqual(effectiveDate, period.endDate);

    if (isAfterOrOnStart && isBeforeOrOnEnd) {
      return period;
    }
  }

  // Fallback to the latest period if no match found
  // This should not happen with valid dates, but provides safety
  return periods[0];
};
