import { DataFromQuery } from '@maps-react/utils/pageFilter';

export const filterQueryData = (
  queryData: DataFromQuery,
  keyName: string,
  fallback: string | null = null,
) => {
  const checkValue = (value: string) => (value === '0' ? '' : value);

  return {
    ...queryData,
    [`update${keyName}`]: queryData[`update${keyName}`]
      ? checkValue(queryData[`update${keyName}`])
      : fallback ?? queryData[keyName.toLocaleLowerCase()],
  };
};
