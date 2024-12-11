import { FormData } from 'data/types';
import { ParsedUrlQuery } from 'querystring';

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
