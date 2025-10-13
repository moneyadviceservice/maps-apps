import { sum } from './mathUtils';

export type BuyerType = 'firstOrNextHome' | 'additionalHome';

interface TaxBand {
  start: number;
  end: number | null;
  rate: number;
}

// Calculate Land Transaction Tax for Wales
// price: the price in *pence* of the house
// buyerType: the type of buyer: ["firstOrNextHome", "additionalHome"]
export const calculateLandTransactionTax = (
  price: number,
  buyerType: BuyerType,
) => {
  const SECOND_HOME_THRESHOLD = 4000000;

  const standardBands: TaxBand[] = [
    { start: 0, end: 22500000, rate: 0 },
    { start: 22500001, end: 40000000, rate: 6 },
    { start: 40000001, end: 75000000, rate: 7.5 },
    { start: 75000001, end: 150000000, rate: 10 },
    { start: 150000001, end: null, rate: 12 },
  ];

  const higherBands: TaxBand[] = [
    { start: 0, end: 18000000, rate: 5 },
    { start: 18000001, end: 25000000, rate: 8.5 },
    { start: 25000001, end: 40000000, rate: 10 },
    { start: 40000001, end: 75000000, rate: 12.5 },
    { start: 75000001, end: 150000000, rate: 15 },
    { start: 150000001, end: null, rate: 17 },
  ];

  const isSecondHome = () => buyerType === 'additionalHome';
  const bands = isSecondHome() ? higherBands : standardBands;

  const calculateTaxForBand = (band: TaxBand) => {
    if (price < band.start) {
      return 0;
    }

    let rate = band.rate;

    if (price < SECOND_HOME_THRESHOLD) {
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
  };
};
