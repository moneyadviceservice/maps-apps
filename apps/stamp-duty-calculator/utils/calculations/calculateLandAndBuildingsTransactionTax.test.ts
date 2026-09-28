import { calculateLandAndBuildingsTransactionTax } from './calculateLandAndBuildingsTransactionTax';
import type { BuyerType } from '../../data/rates/LBTTRates';

const currentPeriodTestDate = '7-4-2023';

const generalTestCases = [
  { price: 3900000, buyerType: 'firstTimeBuyer', tax: 0, percent: 0 },
  { price: 3900000, buyerType: 'additionalHome', tax: 0, percent: 0 },
  { price: 4000000, buyerType: 'firstTimeBuyer', tax: 0, percent: 0 },
  { price: 12000000, buyerType: 'firstTimeBuyer', tax: 0, percent: 0 },
  { price: 17500000, buyerType: 'firstTimeBuyer', tax: 0, percent: 0 },
  { price: 20100000, buyerType: 'firstTimeBuyer', tax: 52000, percent: 0.26 },
  { price: 25000000, buyerType: 'firstTimeBuyer', tax: 150000, percent: 0.6 },
  { price: 30000000, buyerType: 'firstTimeBuyer', tax: 400000, percent: 1.33 },
  { price: 32500000, buyerType: 'firstTimeBuyer', tax: 525000, percent: 1.62 },
  { price: 40000000, buyerType: 'firstTimeBuyer', tax: 1275000, percent: 3.19 },
  { price: 74300000, buyerType: 'firstTimeBuyer', tax: 4705000, percent: 6.33 },
  { price: 75000000, buyerType: 'firstTimeBuyer', tax: 4775000, percent: 6.37 },
  {
    price: 120000000,
    buyerType: 'firstTimeBuyer',
    tax: 10175000,
    percent: 8.48,
  },
  { price: 3900000, buyerType: 'nextHome', tax: 0, percent: 0 },
  { price: 4000000, buyerType: 'nextHome', tax: 0, percent: 0 },
  { price: 12000000, buyerType: 'nextHome', tax: 0, percent: 0 },
  { price: 26000000, buyerType: 'nextHome', tax: 260000, percent: 1 },
  { price: 30001900, buyerType: 'nextHome', tax: 460100, percent: 1.53 },
  { price: 35000000, buyerType: 'nextHome', tax: 835000, percent: 2.39 },
  { price: 45000000, buyerType: 'nextHome', tax: 1835000, percent: 4.08 },
  { price: 55000000, buyerType: 'nextHome', tax: 2835000, percent: 5.15 },
  { price: 90100000, buyerType: 'nextHome', tax: 6647000, percent: 7.38 },
  { price: 8000000, buyerType: 'additionalHome', tax: 640000, percent: 8 },
  { price: 15000000, buyerType: 'additionalHome', tax: 1210000, percent: 8.07 },
  { price: 30052100, buyerType: 'additionalHome', tax: 2866800, percent: 9.54 },
  {
    price: 35000000,
    buyerType: 'additionalHome',
    tax: 3635000,
    percent: 10.39,
  },
  {
    price: 61000000,
    buyerType: 'additionalHome',
    tax: 8315000,
    percent: 13.64,
  },
  {
    price: 80050500,
    buyerType: 'additionalHome',
    tax: 11845100,
    percent: 14.8,
  },
  {
    price: 153000000,
    buyerType: 'additionalHome',
    tax: 26435000,
    percent: 17.28,
  },
  {
    price: 500000000,
    buyerType: 'additionalHome',
    tax: 95835000,
    percent: 19.17,
  },
  {
    price: 1000000000,
    buyerType: 'additionalHome',
    tax: 195835000,
    percent: 19.58,
  },
];

for (const testCase of generalTestCases) {
  expect.extend({
    toBeWithinRange(received, floor, ceiling) {
      const pass = received >= floor && received <= ceiling;
      if (pass) {
        return {
          message: () =>
            `expected ${received} not to be within range ${floor} - ${ceiling}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${received} to be within range ${floor} - ${ceiling}`,
          pass: false,
        };
      }
    },
  });

  let title = '[' + testCase.buyerType + ']';

  it(
    'calculates for a ' +
      title +
      ' with a price of ' +
      testCase.price +
      ' at ' +
      testCase.tax +
      ' (' +
      testCase.percent +
      '%)',
    () => {
      let result = calculateLandAndBuildingsTransactionTax(
        testCase.price,
        testCase.buyerType as BuyerType,
      );
      expect(result.tax).toEqual(testCase.tax);
      expect(result.percentage).toBeWithinRange(
        testCase.percent - 0.01,
        testCase.percent + 0.01,
      );
    },
  );
}

// Test cases for current period next home buyers (from 06/04/2023 onwards)
describe('LBTT Current Period Next Home Tests', () => {
  const currentPeriodNextHomeTests = [
    { price: 0, tax: 0, percent: 0 },
    { price: 3900000, tax: 0, percent: 0 },
    { price: 4000000, tax: 0, percent: 0 },
    { price: 12000000, tax: 0, percent: 0 },
    { price: 12500000, tax: 0, percent: 0 },
    { price: 18500000, tax: 80000, percent: 0.43 },
    { price: 27500000, tax: 335000, percent: 1.22 },
    { price: 30001900, tax: 460100, percent: 1.53 },
    { price: 31000000, tax: 510000, percent: 1.65 },
    { price: 40001200, tax: 1335100, percent: 3.34 },
    { price: 49000000, tax: 2235000, percent: 4.56 },
    { price: 51000000, tax: 2435000, percent: 4.77 },
    { price: 93700000, tax: 7079000, percent: 7.55 },
    { price: 98888200, tax: 7701600, percent: 7.79 },
    { price: 210000000, tax: 21035000, percent: 10.02 },
  ];

  for (const testCase of currentPeriodNextHomeTests) {
    const priceInPounds = testCase.price / 100;
    const taxInPounds = testCase.tax / 100;

    it(`calculates LBTT for next home with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
      2,
    )} tax (${testCase.percent}%)`, () => {
      const result = calculateLandAndBuildingsTransactionTax(
        testCase.price,
        'nextHome',
        currentPeriodTestDate,
      );

      expect(result.tax).toEqual(testCase.tax);
      expect(result.percentage).toBeCloseTo(testCase.percent, 2);
    });
  }
});

// Test cases for past period additional home buyers (from 06/04/2023 to 04/12/2024)
describe('LBTT Past Period Additional Home Tests', () => {
  const pastPeriodTestDate = '7-4-2023'; // During the past period with 6% ADS
  const pastPeriodAdditionalHomeTests = [
    { price: 0, tax: 0, percent: 0 },
    { price: 3900000, tax: 0, percent: 0 },
    { price: 4000000, tax: 240000, percent: 6 },
    { price: 12000000, tax: 720000, percent: 6 },
    { price: 12500000, tax: 750000, percent: 6 },
    { price: 18500000, tax: 1190000, percent: 6.43 },
    { price: 27500000, tax: 1985000, percent: 7.22 },
    { price: 30001900, tax: 2260200, percent: 7.53 },
    { price: 31000000, tax: 2370000, percent: 7.65 },
    { price: 40001200, tax: 3735200, percent: 9.34 },
    { price: 49000000, tax: 5175000, percent: 10.56 },
    { price: 51000000, tax: 5495000, percent: 10.77 },
    { price: 93700000, tax: 12701000, percent: 13.55 },
    { price: 98888200, tax: 13634900, percent: 13.79 },
    { price: 210000000, tax: 33635000, percent: 16.02 },
  ];

  for (const testCase of pastPeriodAdditionalHomeTests) {
    const priceInPounds = testCase.price / 100;
    const taxInPounds = testCase.tax / 100;

    it(`calculates LBTT for additional home with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
      2,
    )} tax (${testCase.percent}%)`, () => {
      const result = calculateLandAndBuildingsTransactionTax(
        testCase.price,
        'additionalHome',
        pastPeriodTestDate,
      );

      expect(result.tax).toEqual(testCase.tax);
      expect(result.percentage).toBeCloseTo(testCase.percent, 2);
    });
  }
});

// Test cases for current period additional home buyers (from 05/12/2024 onwards)
describe('LBTT Current Period Additional Home Tests', () => {
  const currentPeriodTestDateForAdditional = '6-12-2024'; // After the rate change on 05/12/2024
  const currentPeriodAdditionalHomeTests = [
    { price: 0, tax: 0, percent: 0 },
    { price: 3900000, tax: 0, percent: 0 },
    { price: 4000000, tax: 320000, percent: 8 },
    { price: 12000000, tax: 960000, percent: 8 },
    { price: 12500000, tax: 1000000, percent: 8 },
    { price: 18500000, tax: 1560000, percent: 8.43 },
    { price: 27500000, tax: 2535000, percent: 9.22 },
    { price: 30001900, tax: 2860200, percent: 9.53 },
    { price: 31000000, tax: 2990000, percent: 9.65 },
    { price: 40001200, tax: 4535200, percent: 11.34 },
    { price: 49000000, tax: 6155000, percent: 12.56 },
    { price: 51000000, tax: 6515000, percent: 12.77 },
    { price: 93700000, tax: 14575000, percent: 15.55 },
    { price: 98888200, tax: 15612700, percent: 15.79 },
    { price: 210000000, tax: 37835000, percent: 18.02 },
  ];

  for (const testCase of currentPeriodAdditionalHomeTests) {
    const priceInPounds = testCase.price / 100;
    const taxInPounds = testCase.tax / 100;

    it(`calculates LBTT for additional home with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
      2,
    )} tax (${testCase.percent}%)`, () => {
      const result = calculateLandAndBuildingsTransactionTax(
        testCase.price,
        'additionalHome',
        currentPeriodTestDateForAdditional,
      );

      expect(result.tax).toEqual(testCase.tax);
      expect(result.percentage).toBeCloseTo(testCase.percent, 2);
    });
  }
});

// Test cases for current period first-time buyers (from 06/04/2023 onwards)
describe('LBTT Current Period First-Time Buyer Tests', () => {
  const currentPeriodFirstTimeBuyerTests = [
    { price: 0, tax: 0, percent: 0 },
    { price: 3900000, tax: 0, percent: 0 },
    { price: 4000000, tax: 0, percent: 0 },
    { price: 12000000, tax: 0, percent: 0 },
    { price: 12500000, tax: 0, percent: 0 },
    { price: 18500000, tax: 20000, percent: 0.11 },
    { price: 27500000, tax: 275000, percent: 1 },
    { price: 30001900, tax: 400100, percent: 1.33 },
    { price: 31000000, tax: 450000, percent: 1.45 },
    { price: 40001200, tax: 1275100, percent: 3.19 },
    { price: 49000000, tax: 2175000, percent: 4.44 },
    { price: 51000000, tax: 2375000, percent: 4.66 },
    { price: 93700000, tax: 7019000, percent: 7.49 },
    { price: 98888200, tax: 7641600, percent: 7.73 },
    { price: 210000000, tax: 20975000, percent: 9.99 },
  ];

  for (const testCase of currentPeriodFirstTimeBuyerTests) {
    const priceInPounds = testCase.price / 100;
    const taxInPounds = testCase.tax / 100;

    it(`calculates LBTT for first-time buyer with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
      2,
    )} tax (${testCase.percent}%)`, () => {
      const result = calculateLandAndBuildingsTransactionTax(
        testCase.price,
        'firstTimeBuyer',
        currentPeriodTestDate,
      );

      expect(result.tax).toEqual(testCase.tax);
      expect(result.percentage).toBeCloseTo(testCase.percent, 2);
    });
  }
});
