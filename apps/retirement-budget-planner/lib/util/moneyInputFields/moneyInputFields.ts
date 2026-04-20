import type {
  BasicGroupFieldType,
  DataProps,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';
import { parseNumberFromString } from 'lib/util/parseNumberFromString/parseNumberFromString';

/**
 * Check if a money input field has a value greater than 0
 */
export const doesMoneyInputFieldHaveValue = ({
  field,
  data,
}: {
  field: BasicGroupFieldType;
  data: DataProps;
}) => {
  if (!(field.moneyInputName in data)) {
    return false;
  }

  return parseNumberFromString(data[`${field.moneyInputName}`]) > 0;
};

/**
 * Check if at least one money input field in an array contains a value greater
 * than 0
 */
export const doesMoneyInputFieldArrayHaveValue = ({
  fields,
  data,
}: {
  fields: BasicGroupFieldType[] | RetirementGroupFieldType[];
  data: DataProps;
}) => {
  return fields.some((field) => doesMoneyInputFieldHaveValue({ field, data }));
};

/**
 * Check if a section contains at least one money input field with a value
 * greater than 0
 */
export const doesMoneyInputFieldSectionHaveValue = ({
  fieldSection,
  data,
}: {
  fieldSection: RetirementFieldTypes;
  data: DataProps;
}) => {
  return fieldSection.fields.some((fieldGroup) =>
    doesMoneyInputFieldArrayHaveValue({ fields: fieldGroup.items, data }),
  );
};

/**
 * Check if at least one section in an array contains an input field with a
 * value greater than 0
 */
export const doesMoneyInputFieldSectionsHaveValue = ({
  fieldSections,
  data,
}: {
  fieldSections: RetirementFieldTypes[];
  data: DataProps;
}) => {
  return fieldSections.some((fieldSection) =>
    doesMoneyInputFieldSectionHaveValue({ fieldSection, data }),
  );
};
