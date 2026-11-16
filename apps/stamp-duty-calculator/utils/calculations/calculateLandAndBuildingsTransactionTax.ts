import { parse } from 'date-fns';

import {
  BUYER_RATE_CONFIGURATIONS,
  type BuyerType,
} from '../../data/rates/LBTTRates';
import { roundToNearestHundred, sum } from '../mathUtils';
import {
  type BuyerTypeRateConfiguration,
  getBuyerConfiguration as getGenericBuyerConfiguration,
  getRatePeriod,
  type TaxBand,
} from '../rates/rateUtils';

/**
 * Gets the rate configuration for a specific LBTT buyer type
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
 * Calculate Land and Buildings Transaction Tax for Scotland
 * @param price - The property price in pence
 * @param buyerType - The type of buyer: "firstTimeBuyer", "nextHome", or "additionalHome"
 * @param effectiveDate - The purchase date in "d-M-yyyy" format (optional, defaults to current date)
 * @returns Object containing tax amount in pence and effective tax percentage
 */
export const calculateLandAndBuildingsTransactionTax = (
  price: number,
  buyerType: BuyerType,
  effectiveDate?: string,
) => {
  // Parse the effective date or use current date as fallback
  const parsedDate = effectiveDate
    ? parse(effectiveDate, 'd-M-yyyy', new Date())
    : new Date();

  // Get the configuration for this buyer type
  const buyerConfig = getBuyerConfiguration(buyerType);

  // Get the appropriate rate period based on the date
  const period = getRatePeriod(buyerConfig.periods, parsedDate);

  const isAdditionalHome = buyerType === 'additionalHome';
  const bands = period.bands;

  const calculateTaxForBand = (band: TaxBand) => {
    if (price < band.start) {
      return 0;
    }

    let rate = band.rate;

    if (isAdditionalHome) {
      // Apply ADS rate (Additional Dwelling Supplement)
      // https://www.revenue.scot/taxes/land-buildings-transaction-tax/residential-property/additional-dwelling-supplement-ads
      if (period.minThreshold && price < period.minThreshold) {
        rate = 0;
      } else if (period.additionalTax) {
        rate += period.additionalTax;
      }
      // For additional homes in the past period without additionalTax,
      // the rates already include the ADS
    }
    const isPriceInBand = band.end == null || price < band.end;
    const upperLimit = isPriceInBand ? price : band.end ?? price;
    const taxAmount = upperLimit - band.start + 100;
    return Math.ceil((taxAmount * rate) / 100);
  };

  let taxDue = sum(bands.map((band) => calculateTaxForBand(band)));

  taxDue = roundToNearestHundred(taxDue);

  const taxPercentage =
    taxDue === 0 || price === 0 ? 0 : (taxDue / price) * 100;

  return {
    tax: taxDue,
    percentage: taxPercentage,
    purchaseDate: effectiveDate || '',
  };
};
