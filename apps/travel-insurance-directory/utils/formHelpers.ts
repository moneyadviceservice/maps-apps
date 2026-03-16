/**
 * Form helpers for travel insurance directory filters.
 * Converts form data to query params for URL (aligned with Firm Cosmos keys).
 * Shared by client (FormData) and server (POST body).
 */

/**
 * Normalize a single form value and optionally skip empty for certain keys.
 */
function normalizeEntry(key: string, value: string | string[], result: any) {
  const trim = (s: string) => s.trim();
  const values = Array.isArray(value)
    ? value.map(trim).filter(Boolean)
    : [trim(String(value))].filter(Boolean);
  if (!values.length) return;

  const isArrayKey = key.endsWith('[]');
  if (key in result) {
    const existing = result[key];
    const combined = [
      ...(Array.isArray(existing) ? existing : [existing as string]),
      ...values,
    ].filter(Boolean);
    result[key] = isArrayKey ? combined : combined[0];
  } else {
    result[key] = isArrayKey ? values : values[0];
  }
}

/**
 * Convert FormData to query params object (handles array fields like trip_type[]).
 * Used client-side when applying filters via JS.
 */
export function convertFormDataToObject(formData: FormData): any {
  const result: any = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== 'string') continue;
    normalizeEntry(key, value, result);
  }
  return result;
}

/**
 * Convert POST body (e.g. urlencoded) to query params object.
 * Same shape as convertFormDataToObject so server and client share logic.
 * Used server-side in listings apply API route.
 */
export function parseListingsRequestBody(
  body: Record<string, string | string[] | undefined>,
): any {
  const result: any = {};
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;
    const arr = Array.isArray(value) ? value : [value];
    normalizeEntry(key, arr, result);
  }
  return result;
}

export { buildListingsSearchParams } from './listingsPageFilters';
