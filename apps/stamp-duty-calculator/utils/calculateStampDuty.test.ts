import { it, describe, beforeAll } from '@jest/globals';
import { calculateStampDuty } from './calculateStampDuty';
import {
  setupToBeWithinRange,
  createTaxCalculationTestCase,
} from './testHelpers';

describe('calculateStampDuty', () => {
  beforeAll(() => {
    setupToBeWithinRange();
  });

  const testCases = [
    {
      price: 0,
      buyerType: 'additionalHome',
      tax: 0,
      percent: 0,
    },
    {
      price: 3900000,
      buyerType: 'additionalHome',
      tax: 0,
      percent: 0,
    },
    {
      price: 4000000,
      buyerType: 'additionalHome',
      tax: 200000,
      percent: 5.0,
    },
    {
      price: 12500000,
      buyerType: 'additionalHome',
      tax: 625000,
      percent: 5,
    },
    {
      price: 18500000,
      buyerType: 'additionalHome',
      tax: 1045000,
      percent: 5.65,
    },
    {
      price: 27500000,
      buyerType: 'additionalHome',
      tax: 1750000,
      percent: 6.36,
    },
    {
      price: 30001900,
      buyerType: 'additionalHome',
      tax: 2000100,
      percent: 6.67,
    },
    {
      price: 31000000,
      buyerType: 'additionalHome',
      tax: 2100000,
      percent: 6.77,
    },
    {
      price: 40001200,
      buyerType: 'additionalHome',
      tax: 3000100,
      percent: 7.5,
    },
    {
      price: 49000000,
      buyerType: 'additionalHome',
      tax: 3900000,
      percent: 7.96,
    },
    {
      price: 51000000,
      buyerType: 'additionalHome',
      tax: 4100000,
      percent: 8.04,
    },
    {
      price: 93700000,
      buyerType: 'additionalHome',
      tax: 8430000,
      percent: 9.0,
    },
    {
      price: 98888200,
      buyerType: 'additionalHome',
      tax: 9208200,
      percent: 9.31,
    },
    {
      price: 210000000,
      buyerType: 'additionalHome',
      tax: 27075000,
      percent: 12.89,
    },
    {
      price: 3900000,
      buyerType: 'nextHome',
      tax: 0,
      percent: 0,
    },
    {
      price: 4000000,
      buyerType: 'nextHome',
      tax: 0,
      percent: 0,
    },
    {
      price: 12500000,
      buyerType: 'nextHome',
      tax: 0,
      percent: 0,
    },
    {
      price: 18500000,
      buyerType: 'nextHome',
      tax: 120000,
      percent: 0.65,
    },
    {
      price: 27500000,
      buyerType: 'nextHome',
      tax: 375000,
      percent: 1.36,
    },
    {
      price: 30001900,
      buyerType: 'nextHome',
      tax: 500000,
      percent: 1.67,
    },
    {
      price: 31000000,
      buyerType: 'nextHome',
      tax: 550000,
      percent: 1.77,
    },
    {
      price: 40001200,
      buyerType: 'nextHome',
      tax: 1000000,
      percent: 2.5,
    },
    {
      price: 49000000,
      buyerType: 'nextHome',
      tax: 1450000,
      percent: 2.96,
    },
    {
      price: 51000000,
      buyerType: 'nextHome',
      tax: 1550000,
      percent: 3.04,
    },
    {
      price: 93700000,
      buyerType: 'nextHome',
      tax: 3745000,
      percent: 4.0,
    },
    {
      price: 98888200,
      buyerType: 'nextHome',
      tax: 4263800,
      percent: 4.31,
    },
    {
      price: 210000000,
      buyerType: 'nextHome',
      tax: 16575000,
      percent: 7.89,
    },
    {
      price: 0,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 3900000,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 4000000,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 12500000,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 18500000,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 27500000,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 30001900,
      buyerType: 'firstTimeBuyer',
      tax: 0,
      percent: 0,
    },
    {
      price: 31000000,
      buyerType: 'firstTimeBuyer',
      tax: 50000,
      percent: 0.16,
    },
    {
      price: 40001200,
      buyerType: 'firstTimeBuyer',
      tax: 500000,
      percent: 1.25,
    },
    {
      price: 49000000,
      buyerType: 'firstTimeBuyer',
      tax: 950000,
      percent: 1.94,
    },
    {
      price: 51000000,
      buyerType: 'firstTimeBuyer',
      tax: 1550000,
      percent: 3.04,
    },
    {
      price: 93700000,
      buyerType: 'firstTimeBuyer',
      tax: 3745000,
      percent: 4.0,
    },
    {
      price: 98888200,
      buyerType: 'firstTimeBuyer',
      tax: 4263800,
      percent: 4.31,
    },
    {
      price: 210000000,
      buyerType: 'firstTimeBuyer',
      tax: 16575000,
      percent: 7.89,
    },
  ];

  testCases.forEach((testCase) => {
    const { name, fn } = createTaxCalculationTestCase(
      testCase,
      'Stamp Duty',
      calculateStampDuty as any,
    );
    it(name, fn);
  });
});
