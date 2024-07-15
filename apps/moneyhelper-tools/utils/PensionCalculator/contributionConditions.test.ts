import {
  SalaryFrequency,
  contributionConditions,
} from './contributionConditions';

describe('contributionConditions', () => {
  it('should return for max tax relief as true above 40,000 limit ', () => {
    const salaryCondition = contributionConditions({
      salary: 100000,
      frequency: SalaryFrequency.YEAR,
      employeeContribution: 5,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      salary: 100000,
      requiredMinimum: false,
      employerMinimum: false,
      maxTaxRelief: false,
    });
  });
});
