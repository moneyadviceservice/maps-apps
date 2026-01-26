import { RetirmentContentType } from 'lib/types/page.type';

export const generateMockContent = (arr: Record<string, string>[]) => {
  const content: RetirmentContentType[] = [];
  arr.forEach((val, index) => {
    content.push({
      sectionName: val.key,
      sectionTitle: `${val.content} title`,
      sectionDescription: <p>{val.content} description</p>,
      ...(index === 1 && { addButtonLabel: 'Add pension pot' }),
    });
  });
  return content;
};

export const mockContent = {
  step: 2,
  partnerName: 'Partner 1',
  content: generateMockContent([
    { key: 'statePension', content: 'State pension' },
    { key: 'benefitPension', content: 'Benefits pension' },
  ]),
};

export const mockFieldNames = (fields: string[]) => {
  return fields.map((field, index) => {
    return {
      sectionName: field,
      ...(index === 1 ? { enableRemove: true } : { enableRemove: false }),
      maxItems: 0,
      items: [
        {
          index: 0,
          inputLabelName: index === 0 ? '' : `${field}Label`,
          moneyInputName: `${field}`,
          frequencyName: `${field}Frequency`,
        },
        ...(index === 1
          ? [
              {
                index: 1,
                inputLabelName: `${field}Label1`,
                moneyInputName: `${field}1`,
                frequencyName: `${field}Frequency1`,
              },
            ]
          : []),
      ],
    };
  });
};

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
