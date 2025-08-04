import { expect, it, describe } from '@jest/globals';

import { roundToNearestHundred, sum } from './mathUtils';

describe('mathHelpers', () => {
  describe('roundToNearestHundred', () => {
    const testCases = [
      { input: 0, expected: 0, description: 'zero' },
      { input: 50, expected: 0, description: 'less than 100' },
      { input: 99, expected: 0, description: 'just under 100' },
      { input: 100, expected: 100, description: 'exactly 100' },
      { input: 150, expected: 100, description: 'between 100 and 200' },
      { input: 199, expected: 100, description: 'just under 200' },
      { input: 200, expected: 200, description: 'exactly 200' },
      { input: 250, expected: 200, description: 'between 200 and 300' },
      { input: 999, expected: 900, description: 'just under 1000' },
      { input: 1000, expected: 1000, description: 'exactly 1000' },
      { input: 1234, expected: 1200, description: 'four digit number' },
      { input: 12345, expected: 12300, description: 'five digit number' },
      { input: 123456, expected: 123400, description: 'six digit number' },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`rounds ${description} (${input}) to ${expected}`, () => {
        expect(roundToNearestHundred(input)).toBe(expected);
      });
    });

    // Test with negative numbers (JavaScript modulo behavior)
    it('handles negative numbers correctly', () => {
      expect(roundToNearestHundred(-50)).toBe(0);
      expect(roundToNearestHundred(-150)).toBe(-100);
      expect(roundToNearestHundred(-100)).toBe(-100);
      expect(roundToNearestHundred(-199)).toBe(-100);
    });

    // Test with decimal numbers
    it('handles decimal numbers correctly', () => {
      expect(roundToNearestHundred(150.75)).toBe(100);
      expect(roundToNearestHundred(299.99)).toBe(200);
      expect(roundToNearestHundred(100.01)).toBe(100);
    });
  });

  describe('sum', () => {
    const testCases = [
      { input: [], expected: 0, description: 'empty array' },
      { input: [0], expected: 0, description: 'single zero' },
      { input: [5], expected: 5, description: 'single positive number' },
      { input: [-5], expected: -5, description: 'single negative number' },
      {
        input: [1, 2, 3],
        expected: 6,
        description: 'multiple positive numbers',
      },
      {
        input: [-1, -2, -3],
        expected: -6,
        description: 'multiple negative numbers',
      },
      {
        input: [1, -2, 3],
        expected: 2,
        description: 'mixed positive and negative numbers',
      },
      { input: [0, 0, 0], expected: 0, description: 'multiple zeros' },
      { input: [10, 20, 30, 40], expected: 100, description: 'four numbers' },
      { input: [1.5, 2.5, 3.5], expected: 7.5, description: 'decimal numbers' },
      {
        input: [100, -50, 25, -25],
        expected: 50,
        description: 'mixed integers with cancellation',
      },
      {
        input: [0.1, 0.2, 0.3],
        expected: 0.6,
        description: 'small decimal numbers',
      },
    ];

    testCases.forEach(({ input, expected, description }) => {
      it(`calculates sum of ${description}`, () => {
        const result = sum(input);
        if (typeof expected === 'number' && expected % 1 !== 0) {
          // For floating point numbers, use toBeCloseTo for precision
          expect(result).toBeCloseTo(expected, 10);
        } else {
          expect(result).toBe(expected);
        }
      });
    });

    // Test with large arrays
    it('handles large arrays correctly', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1);
      const expected = (1000 * 1001) / 2; // Sum of 1 to 1000
      expect(sum(largeArray)).toBe(expected);
    });

    // Test with very large numbers
    it('handles very large numbers correctly', () => {
      const largeNumbers = [1000000, 2000000, 3000000];
      expect(sum(largeNumbers)).toBe(6000000);
    });
  });
});
