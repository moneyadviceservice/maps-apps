/**
 * Utility function to extract existing query parameters from a resolved URL, excluding specified parameters.
 * This is used to preserve other query parameters when redirecting or modifying the URL.
 * @param resolvedUrl - The resolved URL from which to extract query parameters.
 * @param excludedParams - An array of query parameter names to exclude from the result.
 * @returns A string representing the remaining query parameters.
 */
export function getExistingParams(
  resolvedUrl: string | undefined,
  excludedParams: string[] = [],
): string {
  const excluded = new Set(excludedParams);
  const [, search = ''] = (resolvedUrl ?? '').split('?');
  const params = new URLSearchParams(search);

  excluded.forEach((key) => {
    params.delete(key);
  });

  return params.toString();
}
