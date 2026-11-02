/**
 * Predefined view‑option combinations used for testing pagination and sorting
 * behaviour in the results UI.
 *
 * @description
 * Each entry represents a user‑selectable configuration that determines:
 * - How many items should be displayed per page (`perPage`)
 * - Which field the results should be sorted by (`sortBy`)
 *
 * These combinations help ensure consistent behaviour across different
 * pagination and sorting scenarios.
 *
 * @typedef {Object} ViewOptions
 * @property {string} perPage
 *   The number of results to display per page (as a string for UI parity).
 *
 * @property {string} sortBy
 *   The field used to sort the results (e.g., "price", "distance", "name").
 */

export const viewOptionsCombinations = [
  { perPage: '3', sortBy: 'price' },
  { perPage: '10', sortBy: 'distance' },
  { perPage: '20', sortBy: 'name' },
] as const;
