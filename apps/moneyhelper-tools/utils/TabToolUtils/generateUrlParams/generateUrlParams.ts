import { FormData } from 'data/types';

import { addObjectKeyPrefix } from '../addObjectKeyPrefix';

export const generateUrlParams = (formData: FormData) => {
  const parsedData = JSON.stringify(addObjectKeyPrefix(formData, 'q-')) || '';
  const savedDataParsed = formData ? JSON.parse(parsedData) : {};
  const query = new URLSearchParams({
    ...savedDataParsed,
  }).toString();

  return query;
};
