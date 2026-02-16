import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';
import {
  RetirementFieldTypes,
  RetirementGroupFieldType,
  RetirmentContentType,
} from 'lib/types/page.type';

export const generateMockContent = (arr: Record<string, string>[]) => {
  const content: RetirmentContentType[] = [];
  arr.forEach((val, index) => {
    const addButton =
      index === 1 ? { addButtonLabel: 'Add pension pot' } : null;

    content.push({
      sectionName: val.key,
      sectionTitle: `${val.content} title`,
      sectionDescription: <p>{val.content} description</p>,
      ...addButton,
    });
  });
  return content;
};

export const mockContent = {
  step: 2,
  content: generateMockContent([
    { key: 'statePension', content: 'State pension' },
    { key: 'workplace', content: 'Benefits pension' },
  ]),
};

type ItemParamaterType = {
  name: string;
  label?: string;
};

export const mockItems = (
  items: ItemParamaterType[],
  isDynamic: boolean,
): RetirementGroupFieldType[] =>
  items.map(({ name, label }, index) => {
    const fieldIdx = index > 0 ? index : '';
    const labelText = label
      ? { labelText: label }
      : { inputLabelName: `${name}Label${fieldIdx}` };

    return {
      index: index,
      moneyInputName: `${name}${fieldIdx}`,
      frequencyName: `${name}Frequency${fieldIdx}`,
      defaultFrequency: FREQUNCY_KEYS.MONTH,
      enableRemove: !!isDynamic,
      ...labelText,
    };
  });

export const mockFieldNames = (
  fields: {
    field: string;
    isDynamic: boolean;
    items: ItemParamaterType[];
  }[],
): RetirementFieldTypes[] => {
  const fls = fields.map(({ field, items, isDynamic }) => {
    const itm = mockItems(items, isDynamic);

    return {
      field: field,
      maxItems: itm.length,
      isDynamic: isDynamic,
      items: itm,
    };
  });

  return [
    {
      sectionName: 'workplace',
      fields: fls,
    },
  ];
};

export const defaultContentModelData = mockFieldNames([
  { field: 'state', isDynamic: false, items: [{ name: 'statePension' }] },
  {
    field: 'benefitPension',
    isDynamic: true,
    items: [{ name: 'benefitPension', label: 'Benefit 1' }],
  },
]);

export const mockSubmittedData = {
  formstatePension: '200',
  formstatePensionLabel: 'state',
  formstatePensionFrequency: 'month',
  formbenefitPension: '300',
  formbenefitPensionLabel: 'Benefit 1',
  formbenefitPensionFrequency: 'year',
  formbenefitPension1: '50',
  formbenefitPensionLabel1: 'Benefit 2',
  formbenefitPensionFrequency1: 'week',
};
