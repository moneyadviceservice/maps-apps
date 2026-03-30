import {
  generateSeed,
  seededRandom,
  shufflePACs,
  shuffleWithSeed,
} from './shufflePACs';

describe('shufflePACs', () => {
  describe('generateSeed', () => {
    it('returns consistent seed for same date-time', () => {
      const date = new Date('2024-03-15T14:30:00Z');
      expect(generateSeed(date)).toBe(generateSeed(date));
    });

    it('returns different seeds for different hours', () => {
      const date1 = new Date('2024-03-15T14:00:00Z');
      const date2 = new Date('2024-03-15T15:00:00Z');
      expect(generateSeed(date1)).not.toBe(generateSeed(date2));
    });

    it('returns same seed for times within same hour', () => {
      const date1 = new Date('2024-03-15T14:10:00Z');
      const date2 = new Date('2024-03-15T14:50:00Z');
      expect(generateSeed(date1)).toBe(generateSeed(date2));
    });

    it('returns different seeds for different days', () => {
      const date1 = new Date('2024-03-15T14:00:00Z');
      const date2 = new Date('2024-03-16T14:00:00Z');
      expect(generateSeed(date1)).not.toBe(generateSeed(date2));
    });

    it('returns different seeds for different years', () => {
      const date1 = new Date('2024-03-15T14:00:00Z');
      const date2 = new Date('2025-03-15T14:00:00Z');
      expect(generateSeed(date1)).not.toBe(generateSeed(date2));
    });

    it('works without parameters (uses current time)', () => {
      expect(typeof generateSeed()).toBe('number');
      expect(generateSeed()).toBeGreaterThan(0);
    });
  });

  describe('seededRandom', () => {
    it('returns same value for same seed', () => {
      const seed = 42;
      expect(seededRandom(seed)).toBe(seededRandom(seed));
    });

    it('returns value in [0, 1)', () => {
      for (let s = 0; s < 100; s++) {
        const v = seededRandom(s);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });

    it('produces different values for different seeds', () => {
      const values = new Set<number>();
      for (let s = 0; s < 50; s++) {
        values.add(seededRandom(s));
      }
      expect(values.size).toBeGreaterThan(40); // High entropy expected
    });

    it('handles negative seeds', () => {
      const v = seededRandom(-123);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });

    it('handles large seeds', () => {
      const v = seededRandom(999999999);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    });
  });

  describe('shuffleWithSeed', () => {
    it('does not mutate input', () => {
      const input = [1, 2, 3];
      const inputCopy = [...input];
      shuffleWithSeed(input, 123);
      expect(input).toEqual(inputCopy);
    });

    it('same seed produces same order', () => {
      const input = [1, 2, 3, 4, 5];
      const result1 = shuffleWithSeed(input, 10);
      const result2 = shuffleWithSeed(input, 10);
      expect(result1).toEqual(result2);
    });

    it('different seeds produce different orders', () => {
      const input = [1, 2, 3, 4, 5];
      const orderings = new Set<string>();

      for (let seed = 0; seed < 50; seed++) {
        const result = shuffleWithSeed(input, seed);
        orderings.add(JSON.stringify(result));
      }

      expect(orderings.size).toBeGreaterThan(10); // Many distinct orderings
    });

    it('preserves all elements', () => {
      const input = ['a', 'b', 'c', 'd', 'e'];
      const result = shuffleWithSeed(input, 999);
      const sorted = [...result];
      sorted.sort((a, b) => a.localeCompare(b));
      expect(sorted).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('handles empty array', () => {
      expect(shuffleWithSeed([], 1)).toEqual([]);
    });

    it('handles single-element array', () => {
      expect(shuffleWithSeed([1], 1)).toEqual([1]);
    });

    it('handles two-element array', () => {
      const input = [1, 2];
      const result = shuffleWithSeed(input, 5);
      const sorted = [...result];
      sorted.sort((a, b) => a - b);
      expect(sorted).toEqual([1, 2]);
      expect(result.length).toBe(2);
    });

    it('works with objects', () => {
      const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = shuffleWithSeed(input, 42);

      expect(result.length).toBe(3);
      const ids = result.map((x) => x.id);
      ids.sort((a, b) => a - b);
      expect(ids).toEqual([1, 2, 3]);
      expect(result[0]).toBe(input.find((x) => x.id === result[0].id));
    });

    it('produces uniform-ish distribution across positions', () => {
      const input = [1, 2, 3, 4, 5];
      const positionCounts = Array.from({ length: 5 }, () =>
        new Array(5).fill(0),
      );

      // Run 100 shuffles with different seeds
      for (let seed = 0; seed < 100; seed++) {
        const result = shuffleWithSeed(input, seed);
        result.forEach((value, position) => {
          positionCounts[value - 1][position]++;
        });
      }

      // Each element should appear in each position at least a few times
      positionCounts.forEach((counts) => {
        counts.forEach((count) => {
          expect(count).toBeGreaterThan(5); // Roughly 20 ± some variance
        });
      });
    });
  });

  describe('shufflePACs', () => {
    it('returns array of same length with same elements', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shufflePACs(input);
      expect(result).toHaveLength(input.length);
      const sortedResult = [...result];
      sortedResult.sort((a, b) => a - b);
      const sortedInput = [...input];
      sortedInput.sort((a, b) => a - b);
      expect(sortedResult).toEqual(sortedInput);
    });

    it('does not mutate input', () => {
      const input = [1, 2, 3];
      const inputCopy = [...input];
      shufflePACs(input);
      expect(input).toEqual(inputCopy);
    });

    it('returns consistent results within same hour', () => {
      const input = ['a', 'b', 'c', 'd'];
      const date = new Date('2024-03-15T14:30:00Z');

      const result1 = shufflePACs(input, date);
      const result2 = shufflePACs(input, date);

      expect(result1).toEqual(result2);
    });

    it('returns different results for different hours', () => {
      const input = ['a', 'b', 'c', 'd'];
      const date1 = new Date('2024-03-15T14:00:00Z');
      const date2 = new Date('2024-03-15T15:00:00Z');

      const result1 = shufflePACs(input, date1);
      const result2 = shufflePACs(input, date2);

      // High probability they differ (not guaranteed but very likely)
      expect(result1).not.toEqual(result2);
    });

    it('handles empty array', () => {
      expect(shufflePACs([])).toEqual([]);
    });

    it('rotates firms over time (integration test)', () => {
      const firms = ['FirmA', 'FirmB', 'FirmC', 'FirmD'];
      const firstPositions = new Set<string>();

      // Check first position across 24 different hours
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(
          `2024-03-15T${hour.toString().padStart(2, '0')}:00:00Z`,
        );
        const result = shufflePACs(firms, date);
        firstPositions.add(result[0]);
      }

      // Multiple firms should appear in first position
      expect(firstPositions.size).toBeGreaterThan(1);
    });
  });
});
