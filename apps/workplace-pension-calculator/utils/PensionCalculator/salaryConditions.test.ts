import { salaryConditions, SalaryFrequency } from './salaryConditions';

describe('salary conditions', () => {
  it('should return manualOptInRequired for £10,000 annual salary', () => {
    const salaryCondition = salaryConditions(10000, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: false,
      manualOptInRequired: true,
      nearPensionThreshold: false,
      nearAutoEnrollThreshold: true,
      belowTaxReliefThreshold: true,
    });
  });
  it('should return manualOptInRequired & nearAutoEnrollThreshold for £8,000 annual salary', () => {
    const salaryCondition = salaryConditions(8000, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: false,
      manualOptInRequired: true,
      nearPensionThreshold: false,
      nearAutoEnrollThreshold: false,
      belowTaxReliefThreshold: true,
    });
  });

  it('should return belowManualOptIn & nearPensionThreshold for £6,230 annual salary', () => {
    const salaryCondition = salaryConditions(6230, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: true,
      manualOptInRequired: false,
      nearPensionThreshold: true,
      nearAutoEnrollThreshold: false,
      belowTaxReliefThreshold: true,
    });
  });

  it('should return belowTaxReliefThreshold false for £30,000 annual salary', () => {
    const salaryCondition = salaryConditions(30000, SalaryFrequency.YEAR);
    expect(salaryCondition).toEqual({
      belowManualOptIn: false,
      manualOptInRequired: false,
      nearPensionThreshold: false,
      nearAutoEnrollThreshold: false,
      belowTaxReliefThreshold: false,
    });
  });
});
