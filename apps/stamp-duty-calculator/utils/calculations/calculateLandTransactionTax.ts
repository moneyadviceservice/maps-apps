import { parse } from 'date-fns';

import {
  BUYER_RATE_CONFIGURATIONS,
  type BuyerType,
} from '../../data/rates/LTTRates';
import { sum } from '../mathUtils';
import {
  type BuyerTypeRateConfiguration,
  getBuyerConfiguration as getGenericBuyerConfiguration,
  getRatePeriod,
  type TaxBand,
} from '../rates/rateUtils';

/**
 * Gets the rate configuration for a specific LTT buyer type
 */
export const getBuyerConfiguration = (
  buyerType: BuyerType,
): BuyerTypeRateConfiguration<BuyerType> => {
  return getGenericBuyerConfiguration(
    buyerType,
    BUYER_RATE_CONFIGURATIONS,
    'firstOrNextHome',
  );
};

/**
 * Calculate Land Transaction Tax for Wales
 * @param price - The property price in pence
 * @param buyerType - The type of buyer: "firstOrNextHome" or "additionalHome"
 * @param effectiveDate - The purchase date in "d-M-yyyy" format (optional, defaults to current date)
 * @returns Object containing tax amount in pence and effective tax percentage
 */
export const calculateLandTransactionTax = (
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

  const bands = period.bands;

  const calculateTaxForBand = (band: TaxBand) => {
    if (price < band.start) {
      return 0;
    }

    let rate = band.rate;

    if (period.threshold && price < period.threshold) {
      rate = 0;
    }

    const isPriceInBand = band.end == null || price <= band.end;
    const upperLimit = isPriceInBand ? price : band.end ?? price;
    const taxAmount = upperLimit - band.start;

    return (taxAmount * rate) / 100;
  };

  const taxDue = sum(bands.map((band) => calculateTaxForBand(band)));
  const taxPercentage =
    taxDue === 0 || price === 0 ? 0 : (taxDue / price) * 100;

  return {
    tax: taxDue,
    percentage: taxPercentage,
    purchaseDate: effectiveDate || '',
  };
};
