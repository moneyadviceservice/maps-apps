import { DEFAULT_PREFIX } from 'lib/constants/constants';
import {
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

import useTranslation from '@maps-react/hooks/useTranslation';

/**
 * Generate dynamically the input names for MoneyInput-Frequency groups
 * with structure
 * {
 *    index: {sequencial number}
 *    inputLabelName: {default prefix for all fields in income/essential tabs}{secionName}Label{Sequencial number}
 *    moneyInputName: {default prefix for all fields in income/essential tabs}{secionName}{Sequencial number}
 *    frequencyName: {default prefix for all fields in income/essential tabs}{secionName}Frequency{Sequencial number}
 * }
 * @param itemsToAdd
 * @param section
 * @returns
 */
export const generateMultipleItems = (
  itemsToAdd: number[],
  section: string,
) => {
  if (!section) return [];
  return itemsToAdd?.map((s) => {
    return {
      index: s,
      inputLabelName: `${DEFAULT_PREFIX}${section}Label${s}`,
      moneyInputName: `${DEFAULT_PREFIX}${section}${s}`,
      frequencyName: `${DEFAULT_PREFIX}${section}Frequency${s}`,
    };
  });
};

const filterFieldsBySectionName = (
  fields: RetirementFieldTypes[],
  sectionName: string,
) => fields.filter((field) => field.sectionName === sectionName);

/**
 * Create new money-input frequency group of fields
 * @param pageContent
 * @param index
 * @returns the inputs and select names
 */
export const createNewMoneyInputFrequencyItem = (
  fields: RetirementFieldTypes[],
  sectionName: string,
) => {
  const fieldsInSection = filterFieldsBySectionName(fields, sectionName);
  if (fieldsInSection.length === 0) return null;
  const maxIndex = fieldsInSection[0].items.reduce((acc, item) => {
    return Math.max(acc, item.index);
  }, 0);
  const newItem = generateMultipleItems([maxIndex + 1], sectionName)[0];
  return fields.map((field) => {
    if (field.sectionName === sectionName)
      return {
        ...field,
        items: field.items.concat(newItem),
      };
    return field;
  });
};

/**
 * Remove the group fields specified by index number from the content
 * @param pageContent
 * @param sectionIndex
 * @param itemIndex
 * @returns the updated content
 */
export const removeMoneyInputFrequencyItem = (
  fields: RetirementFieldTypes[],
  sectionName: string,
  itemIndex: number,
) => {
  return fields.map((field) => {
    if (field.sectionName === sectionName) {
      const index = field.items.findIndex((t) => t.index === itemIndex);
      field.items.splice(index, 1);
    }
    return field;
  });
};

/**
 * Create the moneyinput-frequency names group object based on the saved additional fields
 * @param initialContent
 * @param addedContent
 * @returns
 */
export const createDynamicContent = (
  initialContent: RetirementFieldTypes[],
  addedContent: Record<string, number[]>,
) => {
  if (!addedContent) return initialContent;
  return initialContent.map((values) => {
    const additional = addedContent[values.sectionName];

    if (additional) {
      const items = generateMultipleItems(additional, `${values.sectionName}`);

      if (validateDynamicItems(items, values.items)) return values;
      return {
        ...values,
        items: values.items.concat(items),
      };
    }
    return values;
  });
};
/**
 *
 * @param newItems
 * @param existing
 * @returns true if at least one item has the same index in the esisting and the new items
 */
const validateDynamicItems = (
  newItems: RetirementGroupFieldType[],
  existing: RetirementGroupFieldType[],
) => {
  return newItems.some((val) => existing.some((t) => val.index === t.index));
};

/**
 * Generate unique new id (index) when a new moneyinput-frequency group is added
 * @param tabName
 * @param content
 * @param partnerIndex
 * @param sectionName
 * @returns the new id
 */
export const generateNewId = (
  additionalData: Record<string, number[]>,
  content: RetirementFieldTypes[],
  sectionName: string,
) => {
  const additional = additionalData ? additionalData[sectionName] : null;
  const currentItems = getItemsLenght(content, sectionName);
  if (typeof currentItems !== 'number' || isNaN(currentItems)) return 0;
  if (!additional) return currentItems;

  return additional.length > 0 ? additional[additional.length - 1] + 1 : 1;
};

/**
 *
 * @param content
 * @param sectionName
 * @returns the length of the items passed as first parameter
 */
export const getItemsLenght = (
  content: RetirementFieldTypes[],
  sectionName: string,
) =>
  content.find((t) => {
    return t.sectionName === sectionName;
  })?.items.length;

/**
 *
 * @param fieldNames
 * @param t
 * @param partners
 * @param dynamicFields
 * @returns static and dynamic field data concatenated
 */
export const concatStaticDynamicFields = (
  fieldNames: (
    t: ReturnType<typeof useTranslation>['t'],
  ) => RetirementFieldTypes,
  t: ReturnType<typeof useTranslation>['t'],
  dynamicFields: RetirementFieldTypes[],
) => {
  const fields = fieldNames(t);

  if (fields && dynamicFields?.length > 0) {
    return [fields, ...dynamicFields];
  } else if (fields) {
    return [fields];
  } else return [...dynamicFields];
};

export const saveDataToMemoryOnFocusOut = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  sectionName: string,
  tabName: string,
  sessionId: string,
) => {
  const property = e.target.name;

  if (property && property.length > 0) {
    try {
      await fetch(`/api/save-to-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabName: tabName,
          sectionName: sectionName,
          sessionId: sessionId,
          [property]: e.target.value,
        }),
      });
    } catch (e) {
      console.warn('Failed to save the data to Redis: ', e);
    }
  }
};

/**
 * Validate that input fields from Retirement income or essential outgoings pages
 * have at least one non zero value
 * @param formData form data type Record<string, FormEntryValue>
 * @returns
 */
export const validateFormInputNames = (
  formData: Record<string, FormDataEntryValue>,
) => {
  return Object.keys(formData).some(
    (key) =>
      key.startsWith(DEFAULT_PREFIX) &&
      !key.includes('Frequency') &&
      !key.includes('Label') &&
      Number(formData[key]) !== 0,
  );
};
