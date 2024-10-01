import { processFieldValue } from '../Summary/getSummaryValue';
import {
  FormValidationObj,
  FormData,
  Summary,
  DefaultValues,
  FormField,
  GroupedFieldItem,
  ConditionalFields,
} from 'data/types';
import { SummaryItem } from 'components/TabSummaryWidget';
import { Errors } from 'pages/[language]/baby-cost-calculator';
import { addEmbedQuery } from 'utils/addEmbedQuery';

export type AcdlFieldError = Record<
  string,
  {
    error: { label: string; message: string };
  }
>;

export interface FieldAccumulatorType {
  acdlErrors: AcdlFieldError;
  validation: FormValidationObj;
  defaultValues: DefaultValues;
  summaryItem: SummaryItem;
  groupedFieldSum: GroupedFieldItem[];
  conditionalFields: ConditionalFields;
}

const defaultValues: DefaultValues = {};

const fieldHasFormData = (
  { key, type }: FormField,
  formData: FormData,
): boolean => {
  const dKey = type === 'input-currency-with-select' ? `${key}-i` : key;
  return formData[dKey] !== undefined;
};

const handleAcdlErrors = (
  field: FormField,
  acdlErrors: Errors | undefined,
  acc: FieldAccumulatorType,
) => {
  const { key, acdlLabel, label } = field;
  if (acdlErrors?.[key]) {
    acc.acdlErrors[key] = {
      error: {
        label: acdlLabel ?? label,
        message: acdlErrors[key][0],
      },
    };
  }
};

const updateSummaryItem = (
  summary: Summary,
  combinedValue: number,
  tabHasUserData: boolean,
  acc: FieldAccumulatorType,
) => {
  acc.summaryItem = {
    label: summary.label,
    value: combinedValue,
    unit: summary.unit,
    calc: summary.calc,
    hasUserData: tabHasUserData,
  };
};

type HandleGroupedFieldSum = {
  field: FormField;
  summary: Summary;
  combinedGroupValue: { [key: string]: number };
  formData: FormData;
  acc: FieldAccumulatorType;
  urlPath: string;
  linkText: string;
  isEmbed: boolean;
};

const handleGroupedFieldSum = ({
  field,
  summary,
  combinedGroupValue,
  formData,
  acc,
  urlPath,
  linkText,
  isEmbed,
}: HandleGroupedFieldSum) => {
  if (summary.unit === 'pounds' && summary.calc === 'sub') {
    const group = field.group ?? {
      key: linkText.replace(' ', '-'),
      label: linkText,
    };

    if (!combinedGroupValue[group.key]) {
      combinedGroupValue[group.key] = 0;
    }

    combinedGroupValue[group.key] += processFieldValue(
      field,
      formData,
      defaultValues,
    );

    const existingGroup = acc.groupedFieldSum.find(
      (g) => g.name === group.label,
    );
    if (existingGroup) {
      existingGroup.value = combinedGroupValue[group.key];
    } else {
      acc.groupedFieldSum.push({
        name: group.label,
        value: combinedGroupValue[group.key],
        url: `${urlPath}${addEmbedQuery(!!isEmbed, '&')}#${group.key}`,
      });
    }
  }
};

export const generateFieldData = (
  fields: FormField[],
  formData: FormData,
  urlPath: string,
  summary?: Summary,
  linkText = '',
  isEmbed?: boolean,
  acdlErrors?: Errors,
): FieldAccumulatorType => {
  const combinedGroupValue: { [key: string]: number } = {};
  let combinedValue = 0;
  let tabHasUserData = false;

  return fields.reduce<FieldAccumulatorType>(
    (acc, field) => {
      const { key, validation, defaultSelectValue, fieldCondition } = field;

      combinedValue += processFieldValue(field, formData, defaultValues);
      tabHasUserData = tabHasUserData || fieldHasFormData(field, formData);

      handleAcdlErrors(field, acdlErrors, acc);

      if (validation) acc.validation[key] = validation;
      if (defaultSelectValue !== undefined) {
        defaultValues[key] = defaultSelectValue;
        acc.defaultValues[key] = defaultSelectValue;
      }

      if (fieldCondition) {
        acc.conditionalFields.add(fieldCondition.field);
      }

      if (summary) {
        updateSummaryItem(summary, combinedValue, tabHasUserData, acc);
        handleGroupedFieldSum({
          field,
          summary,
          combinedGroupValue,
          formData,
          acc,
          urlPath,
          linkText,
          isEmbed: !!isEmbed,
        });
      }

      return acc;
    },
    {
      acdlErrors: {},
      validation: {},
      defaultValues: {},
      summaryItem: <SummaryItem>{},
      groupedFieldSum: [],
      conditionalFields: new Set<string>(),
    },
  );
};
