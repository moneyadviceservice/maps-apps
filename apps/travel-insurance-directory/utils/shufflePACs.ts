/**
 * Order is stable for a time window (e.g. same hour) and rotates over time
 * so no firm consistently appears in the top position.
 */

import { getDayOfYear, getHours, getYear } from 'date-fns';

/**
 * Time-based seed: same value for the same hour, changes each hour.
 * Matches PACs generateSeed() so order is stable per hour and rotates over time.
 */
export function generateSeed(date: Date = new Date()): number {
  return getYear(date) * 8760 + getDayOfYear(date) * 24 + getHours(date);
  // Multiply to avoid collisions (year dominates, then day, then hour)
}

/**
 * Deterministic "random" in [0, 1) for a given seed.
 * Uses a better hash function than sin() for improved distribution.
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.abs(x - Math.floor(x));
}

/**
 * Fisher–Yates shuffle using seeded random. Does not mutate the input.
 * Same seed (e.g. same hour) => same order for the same array length/content.
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  if (array.length <= 1) return array.slice(); // Early return for trivial cases

  const result = array.slice();
  let currentSeed = seed;

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(currentSeed) * (i + 1));
    currentSeed += 1; // Increment seed for next iteration

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Shuffle array using current time-based seed (PACs pattern).
 * Order is stable within the same hour and rotates each hour.
 */
export function shufflePACs<T>(array: T[], date?: Date): T[] {
  return shuffleWithSeed(array, generateSeed(date));
}
