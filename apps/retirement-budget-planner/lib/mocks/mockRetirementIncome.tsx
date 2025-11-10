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

export const mockFieldNames = (fields: string[], prefix?: string) => {
  return fields.map((field, index) => {
    const prtn = prefix ? `${prefix}${index + 1}` : '';
    return {
      sectionName: field,
      ...(index === 1 ? { enableRemove: true } : { enableRemove: false }),
      maxItems: 0,
      items: [
        {
          index: 0,
          inputLabelName: index === 0 ? '' : `${prtn}${field}Label`,
          moneyInputName: `${prtn}${field}`,
          frequencyName: `${prtn}${field}Frequency`,
        },
        ...(index === 1
          ? [
              {
                index: 1,
                inputLabelName: `${prtn}${field}Label1`,
                moneyInputName: `${prtn}${field}1`,
                frequencyName: `${prtn}${field}Frequency1`,
              },
            ]
          : []),
      ],
    };
  });
};

export const mockSubmittedData = {
  p1statePension: '200',
  p1statePensionLabel: 'state',
  p1statePensionFrequency: 'month',
  p1benefitPension: '300',
  p1benefitPensionLabel: 'Benefit 1',
  p1benefitPensionFrequency: 'year',
  p1benefitPension1: '50',
  p1benefitPensionLabel1: 'Benefit 2',
  p1benefitPensionFrequency1: 'week',
};
