import { it, describe, beforeAll } from '@jest/globals';
import { calculateLandTransactionTax } from './calculateLandTransactionTax';
import {
  setupToBeWithinRange,
  createTaxCalculationTestCase,
} from './testHelpers';

describe('calculateLandTransactionTax', () => {
  beforeAll(() => {
    setupToBeWithinRange();
  });

  const testCases = [
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
      tax: 4369999.6899999995,
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
      tax: 28819999.369999997,
      percent: 13.723809523809524,
    },
    { price: 3900000, buyerType: 'nextHome', tax: 0, percent: 0 },
    { price: 4000000, buyerType: 'nextHome', tax: 0, percent: 0 },
    { price: 17900000, buyerType: 'nextHome', tax: 0, percent: 0 },
    { price: 19000000, buyerType: 'nextHome', tax: 0, percent: 0 },
    { price: 26000000, buyerType: 'nextHome', tax: 209999.94, percent: 0.81 },
    { price: 33333300, buyerType: 'nextHome', tax: 649997.94, percent: 1.95 },
    { price: 46789500, buyerType: 'nextHome', tax: 1559212.365, percent: 3.33 },
    {
      price: 80000000,
      buyerType: 'nextHome',
      tax: 4174999.7649999997,
      percent: 5.22,
    },
    {
      price: 200000000,
      buyerType: 'nextHome',
      tax: 17174999.645,
      percent: 8.59,
    },
  ];

  testCases.forEach((testCase) => {
    const { name, fn } = createTaxCalculationTestCase(
      testCase,
      'Land Transaction Tax',
      calculateLandTransactionTax as any,
    );
    it(name, fn);
  });
});
