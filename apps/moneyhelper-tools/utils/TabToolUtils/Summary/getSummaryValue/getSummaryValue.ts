import { calculateCurrencyPerMonth } from '../calculateCurrencyPerMonth';
import { FormField, FormData, DefaultValues } from 'data/types';

export const processFieldValue = (
  field: FormField,
  formData: FormData,
  defaultValues: DefaultValues,
): number => {
  const { key, type, defaultSelectValue, connectField } = field;
  let dKey = key;

  if (type === 'input-currency-with-select') {
    dKey = `${key}-i`;
  }

  if (dKey && formData[dKey] !== undefined) {
    let value = formData[dKey] as string;

    if (typeof value === 'string') {
      value = value.replace(/,/g, '');
    }

    if (type === 'input-currency-with-select') {
      const months = connectField
        ? Number(formData[connectField] || defaultValues[connectField] || 1)
        : 1;

      value = calculateCurrencyPerMonth(
        dKey,
        formData,
        value,
        months,
        defaultSelectValue,
      );
    }

    return Number(value);
  } else if (type === 'select' && defaultSelectValue) {
    return Number(defaultSelectValue);
  }

  return 0;
};

export const getSummaryValue = (
  fields: FormField[],
  formData: FormData,
  defaultValues: DefaultValues,
) => {
  return fields.reduce((sum, field) => {
    return sum + processFieldValue(field, formData, defaultValues);
  }, 0);
};
