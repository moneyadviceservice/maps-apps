import { salaryConditions, SalaryFrequency } from './salaryConditions';

describe('salary conditions', () => {
  it('should return manualOptInRequired true', () => {
    const salaryCondition = salaryConditions(10000, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: false,
      manualOptInRequired: true,
      nearPensionThreshold: false,
      nearAutoEnrollThreshold: true,
    });
  });
  it('should return manualOptInRequired true', () => {
    const salaryCondition = salaryConditions(8000, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: false,
      manualOptInRequired: true,
      nearPensionThreshold: false,
      nearAutoEnrollThreshold: false,
    });
  });

  it('should return belowManualOptIn & nearPensionThreshold', () => {
    const salaryCondition = salaryConditions(6230, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: true,
      manualOptInRequired: false,
      nearPensionThreshold: true,
      nearAutoEnrollThreshold: false,
    });
  });
});
