import { PAGES_NAMES } from 'lib/constants/pageConstants';
import {
  PageContentType,
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getDataFromMemory } from '../cache/cache';

/**
 * Generate dynamically the input names for MoneyInput-Frequency groups
 * with structure
 * {
 *    index: {sequencial number}
 *    inputLabelName: {secionName}Label{Sequencial number}
 *    moneyInputName: {secionName}{Sequencial number}
 *    frequencyName: {secionName}Frequency{Sequencial number}
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
      inputLabelName: `${section}Label${s}`,
      moneyInputName: `${section}${s}`,
      frequencyName: `${section}Frequency${s}`,
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
      const items = generateMultipleItems(additional, values.sectionName);
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
 * @returns the partner names entered in ABOU_YOU tab or default names
 */
export const getPartnersNames = () => {
  const memory = getDataFromMemory();
  let partners = ['Partner 1', 'Partner 2'];
  if (memory && memory[PAGES_NAMES.ABOUTYOU])
    partners = memory[PAGES_NAMES.ABOUTYOU]['name'];
  return partners;
};

/**
 * Create content for one or two partners for retirement income
 * @param t
 * @param partners
 * @returns
 */
export const getPageContent = (
  content: (
    partnerSuffix: string,
    t: ReturnType<typeof useTranslation>['t'],
    name: string,
  ) => PageContentType,
  t: ReturnType<typeof useTranslation>['t'],
  partners: string[],
) => {
  if (!partners || partners.length === 0)
    return [content(`p1`, t, 'Partner 1')];
  return Object.keys(partners).map((key, index) =>
    content(`p${index + 1}`, t, partners[index]),
  );
};

/**
 * Create field objects for one or two partners for retirement income
 * @param partners
 * @returns
 */
export const getGroupFieldConfigs = (
  fieldNames: (prefix: string) => RetirementFieldTypes[],
  partners: string[],
): RetirementFieldTypes[] => {
  let val: RetirementFieldTypes[] = [];
  Object.keys(partners).forEach((key, index) => {
    val = val.concat(fieldNames(`p${index + 1}`));
  });
  return val;
};

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
    prefix: string,
    t: ReturnType<typeof useTranslation>['t'],
  ) => RetirementFieldTypes[],
  t: ReturnType<typeof useTranslation>['t'],
  partners: string[],
  dynamicFields: RetirementFieldTypes[],
) => {
  const fields = partners.flatMap((_, index) => fieldNames(`p${index + 1}`, t));

  if (fields?.length > 0 && dynamicFields?.length > 0)
    return fields.concat(dynamicFields);
  if (fields?.length > 0) return fields;
  return dynamicFields || [];
};
