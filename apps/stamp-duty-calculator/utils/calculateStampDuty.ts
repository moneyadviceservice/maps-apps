import { roundToNearestHundred, sum } from 'utils/mathUtils';

type BuyerType = 'firstTimeBuyer' | 'nextHome' | 'additionalHome';

// price: the price in *pence* of the house
// buyerType: the type of buyer: ["firstTimeBuyer", "nextHome", "additionalHome"]
export const calculateStampDuty = (price: number, buyerType: BuyerType) => {
  const FIRST_TIME_BUYER_THRESHOLD = 50000000;
  const SECOND_HOME_THRESHOLD = 4000000;
  const SECOND_HOME_ADDITIONAL_TAX = 5;

  const firstTimeBuyerBands = [
    { start: 0, end: 30000000, rate: 0 },
    { start: 30000100, end: 92500000, rate: 5 },
    { start: 92500100, end: 150000000, rate: 10 },
    { start: 150000100, end: null, rate: 12 },
  ];

  const standardBands = [
    { start: 0, end: 12500000, rate: 0 },
    { start: 12500100, end: 25000000, rate: 2 },
    { start: 25000100, end: 92500000, rate: 5 },
    { start: 92500100, end: 150000000, rate: 10 },
    { start: 150000100, end: null, rate: 12 },
  ];

  const isFirstTimeBuyer = buyerType === 'firstTimeBuyer';
  const isUsingFirstTimeBuyerBands =
    isFirstTimeBuyer && price <= FIRST_TIME_BUYER_THRESHOLD;
  const isAdditionalHomeBuyer = buyerType === 'additionalHome';
  const isAdditionalHomeTaxable =
    isAdditionalHomeBuyer && price >= SECOND_HOME_THRESHOLD;
  const bands = isUsingFirstTimeBuyerBands
    ? firstTimeBuyerBands
    : standardBands;

  interface Band {
    start: number;
    end: number;
    rate: number;
  }

  const calculateTaxForBand = (band: Band) => {
    let rate: number = band.rate;

    if (isAdditionalHomeTaxable) {
      rate += SECOND_HOME_ADDITIONAL_TAX;
    }

    const isPriceInBand = band.end == null || price <= band.end;
    const upperLimit = isPriceInBand ? price : band.end;
    const taxAmount = upperLimit - band.start + 100;

    return (taxAmount * rate) / 100;
  };

  let taxDue = sum(
    bands
      .filter((b) => price > b.start)
      // @ts-expect-error - band is a Band type
      .map((band) => calculateTaxForBand(band)),
  );
  taxDue = roundToNearestHundred(taxDue);

  const taxPercentage =
    taxDue === 0 || price === 0 ? 0 : (taxDue / price) * 100;

  return {
    tax: taxDue,
    percentage: taxPercentage,
  };
};
