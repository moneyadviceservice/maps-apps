import { DataProps } from 'lib/types/page.type';

const SECTIONS = ['housing', 'utilities', 'travel', 'additional'];
const ITEMS = [
  ['mortgage', 'rent', 'service'],
  ['coucilTax', 'tv'],
  ['transport', 'tickets'],
  ['additionalInput1', 'additionalInput2'],
];

export const mockPageContent = () => {
  return {
    step: 3,
    partnerName: '',
    content: SECTIONS.map((section) => ({
      sectionName: section,
      sectionTitle: `${section.charAt(0).toUpperCase()}${section.substring(0)}`,
    })),
  };
};

export const mockFielsNames = () => {
  return SECTIONS.map((section, index) => ({
    sectionName: section,
    enableRemove: false,
    maxItems: 0,
    items: ITEMS[index].map((item, idx) => ({
      index: idx,
      moneyInputName: item,
      frequencyName: `${item}Frequency`,
      labelText: item,
      moreInfo: `More info about ${item}`,
      ...(index === 3 && { inputLabelName: `${item}Label` }),
    })),
  }));
};

export const mockPageData = (): DataProps => {
  const items = ITEMS.flat();
  let idx = 1;
  return items.reduce((acc, t) => {
    acc[t] = ((idx + 1) * 20).toString();
    idx++;
    return acc;
  }, {} as DataProps);
};
