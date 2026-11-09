import { it, describe, beforeAll } from '@jest/globals';
import { calculateStampDuty } from './calculateStampDuty';
import type { BuyerType } from '../../data/rates/SDLTRates';
import {
  setupToBeWithinRange,
  createTaxCalculationTestCase,
} from '../testHelpers';

describe('calculateStampDuty', () => {
  beforeAll(() => {
    setupToBeWithinRange();
  });

  describe('buyer-type specific rate selection', () => {
    describe('nextHome buyer', () => {
      it('should use past rates for period 06/04/2023 to 31/03/2025', () => {
        const result = calculateStampDuty(
          50000000,
          'nextHome',
          '15-6-2024', // Date within the past period
        );
        expect(result.tax).toBeWithinRange(1250000, 1250000);
        expect(result.percentage).toBeWithinRange(2.5, 2.5);
      });

      it('should use future rates from 01/04/2025 onwards', () => {
        const result = calculateStampDuty(
          50000000,
          'nextHome',
          '1-4-2025', // Start of future period
        );
        expect(result.tax).toBeWithinRange(1500000, 1500000);
        expect(result.percentage).toBeWithinRange(3, 3);
      });
    });

    describe('firstTimeBuyer', () => {
      it('should use favorable rates when below threshold in past period', () => {
        const result = calculateStampDuty(
          50000000, // £500,000 - below £625,000 threshold
          'firstTimeBuyer',
          '15-6-2024',
        );
        expect(result.tax).toBe(375000);
        expect(result.percentage).toBeWithinRange(0.75, 0.75);
      });

      it('should use standard rates when above threshold in past period', () => {
        const result = calculateStampDuty(
          70000000,
          'firstTimeBuyer',
          '15-6-2024',
        );
        expect(result.tax).toBeWithinRange(2250000, 2250000);
        expect(result.percentage).toBeWithinRange(3.21, 3.22);
      });

      it('should use favorable rates when below threshold in future period', () => {
        const result = calculateStampDuty(
          50000000,
          'firstTimeBuyer',
          '1-4-2025',
        );
        expect(result.tax).toBeWithinRange(1000000, 1000000);
        expect(result.percentage).toBeWithinRange(2, 2);
      });
    });

    describe('additionalHome buyer', () => {
      it('should apply surcharge when above minimum threshold', () => {
        const result = calculateStampDuty(
          50000000,
          'additionalHome',
          '15-6-2024',
        );
        expect(result.tax).toBeWithinRange(2750000, 2750000);
        expect(result.percentage).toBeWithinRange(5.5, 5.5);
      });

      it('should not apply surcharge when below minimum threshold', () => {
        const result = calculateStampDuty(
          3000000, // £30,000 - below £40,000 minimum
          'additionalHome',
          '15-6-2024',
        );
        // No surcharge applies
        expect(result.tax).toBeWithinRange(0, 0);
        expect(result.percentage).toBeWithinRange(0, 0);
      });
    });

    it('should handle missing date parameter gracefully', () => {
      const result = calculateStampDuty(50000000, 'nextHome');
      // Should use current date and select appropriate configuration
      expect(result.tax).toBeGreaterThan(0);
      expect(result.percentage).toBeGreaterThan(0);
    });
  });

  // Test cases for SDLT rates for period 01/04/2023 to 30/10/2024
  describe('SDLT rates for period 01/04/2023 to 30/10/2024', () => {
    const testDate = '15-6-2023';

    const runTaxCalculationTests = (
      buyerType: BuyerType,
      testCases: Array<{
        price: number;
        tax: number;
        percent: number;
        label: string;
      }>,
    ) => {
      for (const testCase of testCases) {
        it(`should calculate £${(testCase.tax / 100).toFixed(2)} tax on ${
          testCase.label
        }`, () => {
          const result = calculateStampDuty(
            testCase.price,
            buyerType,
            testDate,
          );
          expect(result.tax).toBe(testCase.tax);
          if (Number.isInteger(testCase.percent)) {
            expect(result.percentage).toBeWithinRange(
              testCase.percent,
              testCase.percent,
            );
          } else {
            expect(result.percentage).toBeCloseTo(testCase.percent, 2);
          }
        });
      }
    };

    const runZeroTaxTests = (
      buyerType: BuyerType,
      testCases: Array<{ price: number; label: string }>,
    ) => {
      for (const testCase of testCases) {
        it(`should calculate £0 tax on ${testCase.label}`, () => {
          const result = calculateStampDuty(
            testCase.price,
            buyerType,
            testDate,
          );
          expect(result.tax).toBeWithinRange(0, 0);
          expect(result.percentage).toBeWithinRange(0, 0);
        });
      }
    };

    describe('firstTimeBuyer', () => {
      runZeroTaxTests('firstTimeBuyer', [
        { price: 0, label: '£0' },
        { price: 3900000, label: '£390' },
        { price: 4000000, label: '£400' },
        { price: 12500000, label: '£1,250' },
        { price: 18500000, label: '£1,850' },
        { price: 27500000, label: '£2,750' },
        { price: 30001900, label: '£3,000.19' },
        { price: 31000000, label: '£3,100' },
        { price: 40001200, label: '£4,000.12' },
      ]);

      runTaxCalculationTests('firstTimeBuyer', [
        { price: 49000000, tax: 325000, percent: 0.66, label: '£4,900' },
        { price: 51000000, tax: 425000, percent: 0.83, label: '£5,100' },
        { price: 93700000, tax: 3495000, percent: 3.73, label: '£9,370' },
        { price: 98888200, tax: 4013800, percent: 4.06, label: '£9,888.82' },
        { price: 210000000, tax: 16325000, percent: 7.77, label: '£21,000' },
      ]);
    });

    describe('nextHome', () => {
      runZeroTaxTests('nextHome', [
        { price: 3900000, label: '£390' },
        { price: 4000000, label: '£400' },
        { price: 12500000, label: '£1,250' },
        { price: 18500000, label: '£1,850' },
      ]);

      runTaxCalculationTests('nextHome', [
        { price: 27500000, tax: 125000, percent: 0.45, label: '£2,750' },
        { price: 30001900, tax: 250000, percent: 0.83, label: '£3,000.19' },
        { price: 31000000, tax: 300000, percent: 0.97, label: '£3,100' },
        { price: 40001200, tax: 750000, percent: 1.87, label: '£4,000.12' },
        { price: 49000000, tax: 1200000, percent: 2.45, label: '£4,900' },
        { price: 51000000, tax: 1300000, percent: 2.55, label: '£5,100' },
        { price: 93700000, tax: 3495000, percent: 3.73, label: '£9,370' },
        { price: 98888200, tax: 4013800, percent: 4.06, label: '£9,888.82' },
        { price: 210000000, tax: 16325000, percent: 7.77, label: '£21,000' },
      ]);
    });

    describe('additionalHome', () => {
      runZeroTaxTests('additionalHome', [
        { price: 0, label: '£0' },
        { price: 3900000, label: '£390' },
      ]);

      runTaxCalculationTests('additionalHome', [
        { price: 4000000, tax: 120000, percent: 3, label: '£400' },
        { price: 12500000, tax: 375000, percent: 3, label: '£1,250' },
        { price: 18500000, tax: 555000, percent: 3, label: '£1,850' },
        { price: 27500000, tax: 950000, percent: 3.45, label: '£2,750' },
        { price: 30001900, tax: 1150100, percent: 3.83, label: '£3,000.19' },
        { price: 31000000, tax: 1230000, percent: 3.97, label: '£3,100' },
        { price: 40001200, tax: 1950100, percent: 4.88, label: '£4,000.12' },
        { price: 49000000, tax: 2670000, percent: 5.45, label: '£4,900' },
        { price: 51000000, tax: 2830000, percent: 5.55, label: '£5,100' },
        { price: 93700000, tax: 6306000, percent: 6.73, label: '£9,370' },
        { price: 98888200, tax: 6980400, percent: 7.06, label: '£9,888.82' },
        { price: 210000000, tax: 22625000, percent: 10.77, label: '£21,000' },
      ]);
    });
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
      percent: 5,
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
      tax: 2000200,
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
      percent: 9,
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
      tax: 500100,
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
      percent: 4,
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
      percent: 4,
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

  for (const testCase of testCases) {
    const { name, fn } = createTaxCalculationTestCase(
      testCase,
      'Stamp Duty',
      calculateStampDuty as any,
    );
    it(name, fn);
  }
});
