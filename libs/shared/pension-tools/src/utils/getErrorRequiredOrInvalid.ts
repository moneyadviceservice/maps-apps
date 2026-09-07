import { ErrorObject } from '@maps-react/form/types';

export const getErrorRequiredOrInvalid = <
  T extends Record<string, string | undefined>,
>(
  values: T,
) => {
  return Object.keys(values)
    .filter((v) => {
      return values[v as keyof T] !== undefined;
    })
    .reduce((acc, key) => {
      const value = values[key as keyof T];
      if (value?.length === 0) {
        acc[key] = {
          field: key,
          type: 'required',
        };
      }

      const hasValue = value && value?.length > 0;
      const isInvalid = hasValue && isNaN(Number(value.replaceAll(',', '')));

      if (isInvalid) {
        acc[key] = {
          field: key,
          type: 'invalid',
        };
      }

      if (!isInvalid && hasValue && Number(value.replaceAll(',', '')) < 1) {
        acc[key] = {
          field: key,
          type: 'min',
        };
      }

      return acc;
    }, {} as ErrorObject);
};
