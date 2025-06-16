import { ParsedUrlQuery } from 'querystring';

import { FormData } from '../../../types/forms';

export const tabQueryTransformer = (
  query: ParsedUrlQuery,
  dataPrefix: RegExp,
  dataReplace: RegExp,
) => {
  return Object.keys(query)
    .filter((d) => dataPrefix.test(d))
    .reduce((acc, d) => {
      const key = d.replace(dataReplace, '');
      let value = query[d];
      if (typeof value === 'string') {
        value = value.replace(/,/g, '');
      } else if (Array.isArray(value)) {
        value = value.map((v) => v.replace(/,/g, ''));
      }
      acc[key] = value;
      return acc;
    }, {} as FormData);
};
