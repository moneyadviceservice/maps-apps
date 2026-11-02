/**
 * Utilities for form data handling
 */

import { QueryParams } from '../query/queryHelpers';

/**
 * Convert FormData to query params object
 * Handles array values correctly
 */
export function convertFormDataToObject(formData: FormData): QueryParams {
  const result: Record<string, string | string[]> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      if (key in result) {
        // If key already exists, convert to array
        const existing = result[key];
        result[key] = Array.isArray(existing)
          ? [...existing, value]
          : [existing, value];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Build form data object from query params
 * Useful for populating form defaults
 */
export function buildFormDataFromQuery(
  query: QueryParams,
): Record<string, string> {
  const formData: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      formData[key] = value;
    } else if (Array.isArray(value)) {
      // For array values, use the first value or join with comma
      formData[key] = value[0] || '';
    }
  }

  return formData;
}
