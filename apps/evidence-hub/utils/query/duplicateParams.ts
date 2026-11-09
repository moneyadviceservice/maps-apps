import { Redirect } from 'next';

/**
 * Redirect to the same URL with duplicate query params removed,
 * keeping the first value, to prevent HTTP Parameter Pollution.
 */
export function getDuplicateParamRedirect(
  resolvedUrl: string,
): Redirect | null {
  const [pathname, queryString] = resolvedUrl.split('?');
  const params = new URLSearchParams(queryString);
  const firstValues = new URLSearchParams();

  params.forEach((value, key) => {
    if (!firstValues.has(key)) firstValues.set(key, value);
  });

  if (firstValues.toString() === params.toString()) return null;

  return { destination: `${pathname}?${firstValues}`, permanent: false };
}
