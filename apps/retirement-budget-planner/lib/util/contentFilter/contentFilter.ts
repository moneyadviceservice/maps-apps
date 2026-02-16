import { DEFAULT_PREFIX } from 'lib/constants/constants';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';

import {
  RetirementFieldTypes,
  RetirementGroupFieldType,
} from 'lib/types/page.type';

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
 * @param field
 * @returns
 */
export const generateMultipleItems = (
  itemsToAdd: number[],
  field: string,
  isDynamic: boolean,
  label?: string,
  defaultFrequency?: FREQUNCY_KEYS,
): RetirementGroupFieldType[] | [] => {
  if (!field) return [];
  return itemsToAdd?.map((s) => {
    const inputLabel = isDynamic
      ? null
      : {
          inputLabelName: `${DEFAULT_PREFIX}${field}Label${s}`,
        };

    const labelText = label ? { labelText: label } : null;

    return {
      index: s,
      ...inputLabel,
      moneyInputName: `${DEFAULT_PREFIX}${field}${s}`,
      frequencyName: `${DEFAULT_PREFIX}${field}Frequency${s}`,
      defaultFrequency: defaultFrequency ?? FREQUNCY_KEYS.MONTH,
      enableRemove: isDynamic,
      ...labelText,
    };
  });
};

const filterFieldsBySectionName = (
  fields: RetirementFieldTypes[],
  sectionName: string,
): RetirementFieldTypes | undefined =>
  fields.find((field) => field.sectionName === sectionName);

/**
 * Create new money-input frequency group of fields
 * @param pageContent
 * @param index
 * @returns the inputs and select names
 */
export const createNewFieldsDataGroup = (
  sections: RetirementFieldTypes[],
  sectionName: string,
  fieldName: string,
  isDynamic: boolean,
  maxIndex: number,
): RetirementFieldTypes[] | null => {
  const fieldsInSection = filterFieldsBySectionName(sections, sectionName);

  //return null if section details are not returned
  if (!fieldsInSection || Object.keys(fieldsInSection).length === 0)
    return null;

  const label = (fieldsInSection.fields[0].items[0] as RetirementGroupFieldType)
    .labelText;
  const newItem = generateMultipleItems(
    [maxIndex + 1],
    fieldName,
    isDynamic,
    label,
  )[0];

  return sections.map((section) => {
    if (section.sectionName === sectionName) {
      const updateFields = section.fields.map((f) => {
        const { items, field, ...rest } = f;
        if (field === fieldName)
          return {
            ...rest,
            field: field,
            items: [...items, newItem],
          };

        return f;
      });
      return {
        sectionName: section.sectionName,
        fields: updateFields,
      };
    }
    return section;
  });
};

/**
 * Remove the group fields specified by index number from the content
 * @param pageContent
 * @param sectionIndex
 * @param itemIndex
 * @returns the updated content
 */
export const removeFieldDataGroup = (
  sections: RetirementFieldTypes[],
  sectionName: string,
  fieldName: string,
  itemIndex: number,
) => {
  if (!sections || sections.length === 0 || !sectionName || !fieldName)
    return sections;

  return sections?.map((section) => {
    if (section.sectionName === sectionName) {
      section.fields.forEach((field) => {
        if (field.field === fieldName) {
          const index = field.items.findIndex((t) => t.index === itemIndex);

          field.items.splice(index, 1);
        }
        return field;
      });
    }
    return section;
  });
};

/**
 * Create the moneyinput-frequency names group object based on the saved additional fields
 * @param initialContent
 * @param addedContent
 * @returns
 */
export const createContentFromCache = (
  initialContent: RetirementFieldTypes[],
  addedContent: Record<string, Record<string, number[]>> | undefined,
) => {
  if (!addedContent) return initialContent;
  return initialContent.map((section) => {
    const additionalBySection = addedContent[section.sectionName];

    if (!additionalBySection) {
      return section;
    }

    return {
      ...section,
      fields: section.fields.map((field) => {
        const additionalByFields = additionalBySection[field.field];

        if (!additionalByFields) {
          return field;
        }
        const label = (field.items[0] as RetirementGroupFieldType).labelText;
        const items = generateMultipleItems(
          additionalByFields,
          field.field,
          true,
          label,
        );

        if (validateDynamicItems(items, field.items)) {
          return field;
        }

        return {
          ...field,
          items: [...field.items, ...items],
        };
      }),
    };
  });
};

/**
 *
 * @param newItems
 * @param existing
 * @returns true if at least one item has the same index in the existing and the new items
 */
const validateDynamicItems = (
  newItems: RetirementGroupFieldType[],
  existing: RetirementGroupFieldType[],
) => {
  return newItems.some((val) => existing.some((t) => val.index === t.index));
};

/**
 *
 * @param content
 * @param sectionName
 * @returns the length of the items passed as first parameter
 */
export const getFieldItemsLength = (
  content: RetirementFieldTypes[],
  sectionName: string,
  fieldName: string,
) =>
  content
    .find((t) => {
      return t.sectionName === sectionName;
    })
    ?.fields.find(({ field }) => field === fieldName)?.items.length;

/**
 * Save data added on focus out of money input and frequency dropdown fields
 * @param e
 * @param sectionName
 * @param tabName
 * @param sessionId
 */
export const saveDataToMemoryOnFocusOut = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  sectionName: string,
  tabName: string,
  sessionId: string,
) => {
  const property = e.target.name;

  if (property && property.length > 0) {
    const params = new URLSearchParams({
      sectionName: sectionName,
      sessionId: sessionId,
    });
    try {
      await fetch(`/api/cache-to-memory?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabName: tabName,
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
