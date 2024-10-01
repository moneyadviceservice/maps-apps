import { FormData } from 'data/types';

export const combineSavedAndFormData = (
  savedData: string,
  formData: FormData,
  resultData?: string,
) => {
  const savedDataParsed: FormData = savedData ? JSON.parse(savedData) : {};
  const resultDataParsed: FormData = resultData ? JSON.parse(resultData) : {};
  return {
    ...savedDataParsed,
    ...resultDataParsed,
    ...formData,
  };
};
