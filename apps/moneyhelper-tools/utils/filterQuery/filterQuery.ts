import { ParsedUrlQuery } from 'querystring';

export const filterQuery = (
  query: ParsedUrlQuery,
  filter: string[],
): ParsedUrlQuery => {
  const filteredQuery = { ...query };

  filter.forEach((param) => {
    delete filteredQuery[param];
  });

  return filteredQuery;
};
