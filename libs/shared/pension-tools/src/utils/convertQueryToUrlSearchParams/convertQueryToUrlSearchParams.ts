import { ParsedUrlQuery } from 'querystring';

export const convertQueryToUrlSearchParams = (
  query: ParsedUrlQuery,
): URLSearchParams => {
  const params = new URLSearchParams();

  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }
  params.delete('language');

  return params;
};
