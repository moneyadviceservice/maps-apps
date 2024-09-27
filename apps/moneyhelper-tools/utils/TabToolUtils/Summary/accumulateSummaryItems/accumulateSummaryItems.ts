import { getSummaryValue } from '../getSummaryValue';
import { SummaryItem } from 'components/TabSummaryWidget';
import { FormData, FormField, DefaultValues, Summary } from 'data/types';

const hasFormData = (fields: FormField[], formData: FormData) => {
  return fields.some((field) => {
    if (field.type === 'input-currency-with-select') {
      return (
        formData[field.key + '-i'] !== undefined &&
        formData[field.key + '-s'] !== undefined
      );
    }
    return field.key && formData[field.key] !== undefined;
  });
};

export const accumulateSummaryItems = (
  acc: SummaryItem[],
  summary: Summary,
  fields: FormField[],
  formData: FormData,
  defaultValues: DefaultValues,
  displayEmptyStep?: boolean,
): SummaryItem[] => {
  const { label, unit, calc } = summary;
  return hasFormData(fields, formData) || displayEmptyStep
    ? [
        ...acc,
        {
          label: label,
          value: getSummaryValue(fields, formData, defaultValues),
          unit: unit,
          calc: calc,
          hasUserData: true,
        },
      ]
    : acc;
};
