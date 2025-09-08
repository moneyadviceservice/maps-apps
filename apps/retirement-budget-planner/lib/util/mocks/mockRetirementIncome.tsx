import { RetirmentIncomeContentType } from 'lib/types/page.type';

export const generateMockContent = (arr: Record<string, string>[]) => {
  const content: RetirmentIncomeContentType[] = [];
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
  return fields.map((field, index) => ({
    sectionName: field,
    ...(index === 1 ? { enableRemove: true } : { enableRemove: false }),
    maxItems: 0,
    items: [
      {
        index: 0,
        inputLabelName: index === 0 ? '' : `${field}Label`,
        moneyInputName: field,
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
  }));
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
