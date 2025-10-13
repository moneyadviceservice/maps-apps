import { roundToNearestHundred, sum } from 'utils/mathUtils';

// price: the price in *pence* of the house
// buyerType: the type of buyer: ["firstTimeBuyer", "nextHome", "additionalHome"]

export type BuyerType = 'firstTimeBuyer' | 'nextHome' | 'additionalHome';

interface TaxBand {
  start: number;
  end: number | null;
  rate: number;
}

export const calculateLandAndBuildingsTransactionTax = (
  price: number,
  buyerType: BuyerType,
) => {
  const SECOND_HOME_ADDITIONAL_TAX = 8;
  const ADDITIONAL_HOME_THRESHOLD = 4000000;

  const firstTimeBuyerBands: TaxBand[] = [
    { start: 0, end: 17500000, rate: 0 },
    { start: 17500100, end: 25000000, rate: 2 },
    { start: 25000100, end: 32500000, rate: 5 },
    { start: 32500100, end: 75000000, rate: 10 },
    { start: 75000100, end: null, rate: 12 },
  ];

  const standardBands: TaxBand[] = [
    { start: 0, end: 14500000, rate: 0 },
    { start: 14500100, end: 25000000, rate: 2 },
    { start: 25000100, end: 32500000, rate: 5 },
    { start: 32500100, end: 75000000, rate: 10 },
    { start: 75000100, end: null, rate: 12 },
  ];

  const isFirstTimeBuyer = buyerType === 'firstTimeBuyer';
  const isAdditionalHome = buyerType === 'additionalHome';
  const bands = !isFirstTimeBuyer ? standardBands : firstTimeBuyerBands;

  const calculateTaxForBand = (band: TaxBand) => {
    if (price < band.start) {
      return 0;
    }

    let rate = band.rate;

    if (isAdditionalHome) {
      // Apply ADS rate
      // https://www.revenue.scot/taxes/land-buildings-transaction-tax/residential-property/additional-dwelling-supplement-ads
      if (price < ADDITIONAL_HOME_THRESHOLD) {
        rate = 0;
      } else {
        rate += SECOND_HOME_ADDITIONAL_TAX;
      }
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
  };
};
