import { it, describe, beforeAll } from '@jest/globals';
import { calculateLandTransactionTax } from './calculateLandTransactionTax';
import type { BuyerType } from '../../data/rates/LTTRates';
import {
  setupToBeWithinRange,
  createTaxCalculationTestCase,
} from '../testHelpers';

describe('calculateLandTransactionTax', () => {
  beforeAll(() => {
    setupToBeWithinRange();
  });

  const testCases: Array<{
    price: number;
    buyerType: BuyerType;
    tax: number;
    percent: number;
  }> = [
    { price: 0, buyerType: 'additionalHome', tax: 0, percent: 0 },
    { price: 3900000, buyerType: 'additionalHome', tax: 0, percent: 0 },
    { price: 4000000, buyerType: 'additionalHome', tax: 200000, percent: 5 },
    { price: 14500000, buyerType: 'additionalHome', tax: 725000, percent: 5 },
    {
      price: 18500000,
      buyerType: 'additionalHome',
      tax: 942499.915,
      percent: 5.094594594594595,
    },
    {
      price: 27500000,
      buyerType: 'additionalHome',
      tax: 1744999.815,
      percent: 6.345454545454545,
    },
    {
      price: 30000000,
      buyerType: 'additionalHome',
      tax: 1994999.815,
      percent: 6.65,
    },
    {
      price: 49000000,
      buyerType: 'additionalHome',
      tax: 4119999.69,
      percent: 8.408163265306122,
    },
    {
      price: 51000000,
      buyerType: 'additionalHome',
      tax: 4369999.69,
      percent: 8.568627450980392,
    },
    {
      price: 93750000,
      buyerType: 'additionalHome',
      tax: 10182499.54,
      percent: 10.861333333333333,
    },
    {
      price: 210000000,
      buyerType: 'additionalHome',
      tax: 28819999.37,
      percent: 13.72,
    },
    { price: 3900000, buyerType: 'firstOrNextHome', tax: 0, percent: 0 },
    { price: 4000000, buyerType: 'firstOrNextHome', tax: 0, percent: 0 },
    { price: 17900000, buyerType: 'firstOrNextHome', tax: 0, percent: 0 },
    { price: 19000000, buyerType: 'firstOrNextHome', tax: 0, percent: 0 },
    {
      price: 26000000,
      buyerType: 'firstOrNextHome',
      tax: 209999.94,
      percent: 0.81,
    },
    {
      price: 33333300,
      buyerType: 'firstOrNextHome',
      tax: 649997.94,
      percent: 1.95,
    },
    {
      price: 46789500,
      buyerType: 'firstOrNextHome',
      tax: 1559212.365,
      percent: 3.33,
    },
    {
      price: 80000000,
      buyerType: 'firstOrNextHome',
      tax: 4174999.765,
      percent: 5.22,
    },
    {
      price: 200000000,
      buyerType: 'firstOrNextHome',
      tax: 17174999.645,
      percent: 8.59,
    },
  ];

  for (const testCase of testCases) {
    const { name, fn } = createTaxCalculationTestCase(
      testCase,
      'Land Transaction Tax',
      calculateLandTransactionTax as any,
    );
    it(name, fn);
  }

  // Test cases for current period first/next home buyers (from 11/12/2024 onwards)
  describe('LTT Current Period First/Next Home Tests', () => {
    const currentPeriodTestDate = '12-12-2024'; // After the rate period starting 11/12/2024
    const currentPeriodFirstNextHomeTests = [
      { price: 0, tax: 0, percent: 0 },
      { price: 3900000, tax: 0, percent: 0 },
      { price: 4000000, tax: 0, percent: 0 },
      { price: 12000000, tax: 0, percent: 0 },
      { price: 12500000, tax: 0, percent: 0 },
      { price: 18500000, tax: 0, percent: 0 },
      { price: 27500000, tax: 299999.94, percent: 1.09 },
      { price: 30001900, tax: 450113.94, percent: 1.5 },
      { price: 31000000, tax: 509999.94, percent: 1.65 },
      { price: 40001200, tax: 1050089.865, percent: 2.63 },
      { price: 49000000, tax: 1724999.865, percent: 3.52 },
      { price: 51000000, tax: 1874999.865, percent: 3.68 },
      { price: 93700000, tax: 5544999.765, percent: 5.92 },
      { price: 98888200, tax: 6063819.765, percent: 6.13 },
      { price: 210000000, tax: 18374999.645, percent: 8.75 },
    ];

    for (const testCase of currentPeriodFirstNextHomeTests) {
      const priceInPounds = testCase.price / 100;
      const taxInPounds = testCase.tax / 100;

      it(`calculates LTT for first/next home with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
        2,
      )} tax (${testCase.percent}%)`, () => {
        const result = calculateLandTransactionTax(
          testCase.price,
          'firstOrNextHome',
          currentPeriodTestDate,
        );

        expect(result.tax).toBeCloseTo(testCase.tax, 2);
        expect(result.percentage).toBeCloseTo(testCase.percent, 2);
      });
    }
  });

  // Test cases for past period additional home buyers (from 06/04/2023 to 10/12/2024)
  describe('LTT Past Period Additional Home Tests', () => {
    const pastPeriodTestDate = '7-4-2023';
    const pastPeriodAdditionalHomeTests = [
      { price: 0, tax: 0, percent: 0 },
      { price: 3900000, tax: 0, percent: 0 },
      { price: 4000000, tax: 160000, percent: 4 },
      { price: 12000000, tax: 480000, percent: 4 },
      { price: 18000000, tax: 720000, percent: 4 },
      { price: 25000000, tax: 1244999.925, percent: 4.98 },
      { price: 40000000, tax: 2594999.835, percent: 6.49 },
      { price: 50000000, tax: 3744999.7199999997, percent: 7.49 },
      { price: 75000000, tax: 6619999.72, percent: 8.83 },
      { price: 100000000, tax: 10119999.58, percent: 10.12 },
      { price: 150000000, tax: 17119999.58, percent: 11.41 },
      { price: 200000000, tax: 25119999.419999998, percent: 12.56 },
    ];

    for (const testCase of pastPeriodAdditionalHomeTests) {
      const priceInPounds = testCase.price / 100;
      const taxInPounds = testCase.tax / 100;

      it(`calculates LTT for additional home (past period) with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
        2,
      )} tax (${testCase.percent}%)`, () => {
        const result = calculateLandTransactionTax(
          testCase.price,
          'additionalHome',
          pastPeriodTestDate,
        );

        expect(result.tax).toBeCloseTo(testCase.tax, 2);
        expect(result.percentage).toBeCloseTo(testCase.percent, 2);
      });
    }
  });

  // Test cases for current period additional home buyers (from 11/12/2024 onwards)
  describe('LTT Current Period Additional Home Tests', () => {
    const currentPeriodTestDate = '12-12-2024'; // After the rate period starting 11/12/2024
    const currentPeriodAdditionalHomeTests = [
      { price: 0, tax: 0, percent: 0 },
      { price: 3900000, tax: 0, percent: 0 },
      { price: 4000000, tax: 200000, percent: 5 },
      { price: 12000000, tax: 600000, percent: 5 },
      { price: 12500000, tax: 625000, percent: 5 },
      { price: 18500000, tax: 942499.915, percent: 5.09 },
      { price: 27500000, tax: 1744999.815, percent: 6.35 },
      { price: 30001900, tax: 1995189.815, percent: 6.65 },
      { price: 31000000, tax: 2094999.815, percent: 6.76 },
      { price: 40001200, tax: 2995149.69, percent: 7.49 },
      { price: 49000000, tax: 4119999.69, percent: 8.41 },
      { price: 51000000, tax: 4369999.69, percent: 8.57 },
      { price: 93700000, tax: 10174999.54, percent: 10.86 },
      { price: 98888200, tax: 10953229.54, percent: 11.08 },
      { price: 210000000, tax: 28819999.37, percent: 13.72 },
    ];

    for (const testCase of currentPeriodAdditionalHomeTests) {
      const priceInPounds = testCase.price / 100;
      const taxInPounds = testCase.tax / 100;

      it(`calculates LTT for additional home with £${priceInPounds.toLocaleString()} property -> £${taxInPounds.toFixed(
        2,
      )} tax (${testCase.percent}%)`, () => {
        const result = calculateLandTransactionTax(
          testCase.price,
          'additionalHome',
          currentPeriodTestDate,
        );

        expect(result.tax).toBeCloseTo(testCase.tax, 2);
        expect(result.percentage).toBeCloseTo(testCase.percent, 2);
      });
    }
  });
});
