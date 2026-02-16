const baseIdMap = {
  grossIncome: 'inputGrossIncome',
  grossIncomeFrequency: 'selectGrossIncomeFrequency',
  isScottishResident: 'checkboxIsScottish',
  hoursPerWeek: 'inputHoursPerWeek',
  daysPerWeek: 'inputDaysPerWeek',
  taxCode: 'inputTaxCode',
  pensionPercent: 'pensionPercent',
  pensionFixed: 'pensionFixed',
  isBlindPerson: 'blind-persons-yes',
  isOverStatePensionAge: 'state-pension-yes',
  plan1: 'checkboxplan1',
  plan2: 'checkboxplan2',
  plan4: 'checkboxplan4',
  plan5: 'checkboxplan5',
  planPostGrad: 'checkboxplanPostGrad',
  calculationType: 'single-desktop',
};

const salary2IdMap = Object.fromEntries(
  Object.entries(baseIdMap).map(([key, value]) => [
    `salary2_${key}`,
    `salary2_${value}`,
  ]),
);

export const idMap: Record<string, string> = {
  ...baseIdMap,
  ...salary2IdMap,
};
