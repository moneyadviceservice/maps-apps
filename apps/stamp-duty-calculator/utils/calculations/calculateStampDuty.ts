import { parse } from 'date-fns';

import {
  BUYER_RATE_CONFIGURATIONS,
  type BuyerType,
} from '../../data/rates/SDLTRates';
import { roundToNearestHundred, sum } from '../mathUtils';
import {
  type BuyerTypeRateConfiguration,
  getBuyerConfiguration as getGenericBuyerConfiguration,
  getRatePeriod,
} from '../rates/rateUtils';

/**
 * Gets the rate configuration for a specific SDLT buyer type
 */
export const getBuyerConfiguration = (
  buyerType: BuyerType,
): BuyerTypeRateConfiguration<BuyerType> => {
  return getGenericBuyerConfiguration(
    buyerType,
    BUYER_RATE_CONFIGURATIONS,
    'nextHome',
  );
};

/**
 * Calculate Stamp Duty Land Tax for England and Northern Ireland
 * @param price - The property price in pence
 * @param buyerType - The type of buyer: "firstTimeBuyer", "nextHome", or "additionalHome"
 * @param effectiveDate - The purchase date in "d-M-yyyy" format (optional, defaults to current date)
 * @returns Object containing tax amount in pence and effective tax percentage
 */
export const calculateStampDuty = (
  price: number,
  buyerType: BuyerType,
  effectiveDate?: string,
) => {
  // Parse the effective date or use current date as fallback
  const parsedDate = effectiveDate
    ? parse(effectiveDate, 'd-M-yyyy', new Date())
    : new Date();

  const buyerConfig = getBuyerConfiguration(buyerType);

  const period = getRatePeriod(buyerConfig.periods, parsedDate);

  let bands = period.bands;

  // For first-time buyers, check if they're above the threshold
  if (buyerType === 'firstTimeBuyer' && period.threshold) {
    if (price > period.threshold) {
      // Above threshold, need to use standard (nextHome) bands
      const nextHomeConfig = getBuyerConfiguration('nextHome');
      const nextHomePeriod = getRatePeriod(nextHomeConfig.periods, parsedDate);
      bands = nextHomePeriod.bands;
    }
  }

  interface Band {
    start: number;
    end: number | null;
    rate: number;
  }

  const calculateTaxForBand = (band: Band) => {
    let rate: number = band.rate;

    // Apply additional tax for additional properties if applicable
    if (
      buyerType === 'additionalHome' &&
      period.additionalTax &&
      period.minThreshold &&
      price >= period.minThreshold
    ) {
      rate += period.additionalTax;
    }

    const isPriceInBand = band.end == null || price <= band.end;
    const upperLimit = isPriceInBand ? price : band.end ?? price;
    const taxAmount = upperLimit - band.start + 100;

    return (taxAmount * rate) / 100;
  };

  let taxDue = sum(
    bands
      .filter((b) => price > b.start)
      .map((band) => calculateTaxForBand(band)),
  );
  taxDue = roundToNearestHundred(taxDue);

  const taxPercentage =
    taxDue === 0 || price === 0 ? 0 : (taxDue / price) * 100;

  return {
    tax: taxDue,
    percentage: taxPercentage,
    purchaseDate: effectiveDate || '',
  };
};
