export const buildPageHref = (
  query: Record<string, string | string[] | undefined>,
  value: string,
): string => {
  const newQuery: Record<string, string | string[] | undefined> = {
    ...query,
    p: value,
  };
  const queryString = Object.keys(newQuery)
    .map((key) => `${key}=${newQuery[key]}`)
    .join('&');

  return `?${queryString}`;
};
