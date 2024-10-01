import { ParsedUrlQuery } from 'querystring';
import { FormData } from 'data/types';

export const addObjectKeyPrefix = (
  formData: ParsedUrlQuery | null,
  prefix: string,
) => {
  const prefixData: FormData = {};

  for (const key in formData) {
    prefixData[`${prefix}${key}`] = formData[key];
  }

  return prefixData;
};
