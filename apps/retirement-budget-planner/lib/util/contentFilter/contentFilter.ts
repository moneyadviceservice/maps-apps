import { PAGES_NAMES } from 'lib/constants/pageConstants';
import {
  RetirementIncomeFieldTypes,
  RetirementIncomeGroupFieldType,
} from 'lib/types/page.type';

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
  fields: RetirementIncomeFieldTypes[],
  sectionName: string,
) => fields.filter((field) => field.sectionName === sectionName);

/**
 * Create new money-input frequency group of fields
 * @param pageContent
 * @param index
 * @returns the inputs and select names
 */
export const createNewMoneyInputFrequencyItem = (
  fields: RetirementIncomeFieldTypes[],
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
  fields: RetirementIncomeFieldTypes[],
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
  initialContent: RetirementIncomeFieldTypes[],
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
  newItems: RetirementIncomeGroupFieldType[],
  existing: RetirementIncomeGroupFieldType[],
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
  content: RetirementIncomeFieldTypes[],
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
  content: RetirementIncomeFieldTypes[],
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
