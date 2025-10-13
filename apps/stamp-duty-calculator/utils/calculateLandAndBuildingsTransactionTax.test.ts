import {
  BuyerType,
  calculateLandAndBuildingsTransactionTax,
} from './calculateLandAndBuildingsTransactionTax';

[
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
  { price: 30001900, buyerType: 'nextHome', tax: 460000, percent: 1.53 },
  { price: 35000000, buyerType: 'nextHome', tax: 835000, percent: 2.39 },
  { price: 45000000, buyerType: 'nextHome', tax: 1835000, percent: 4.08 },
  { price: 55000000, buyerType: 'nextHome', tax: 2835000, percent: 5.15 },
  { price: 90100000, buyerType: 'nextHome', tax: 6647000, percent: 7.38 },
  { price: 8000000, buyerType: 'additionalHome', tax: 640000, percent: 8.0 },
  { price: 15000000, buyerType: 'additionalHome', tax: 1210000, percent: 8.07 },
  { price: 30052100, buyerType: 'additionalHome', tax: 2866700, percent: 9.54 },
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
].forEach((testCase) => {
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
});
