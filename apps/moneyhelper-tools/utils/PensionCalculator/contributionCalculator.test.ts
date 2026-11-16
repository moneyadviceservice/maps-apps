import {
  contributionCalculator,
  ContributionType,
  SalaryFrequency,
} from './contributionCalculator';

describe('contributionCalculator', () => {
  it('should return for annual part salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 50000,
      frequency: SalaryFrequency.YEAR,
      contributionType: ContributionType.PART,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '2188.00',
      taxRelief: '437.60',
      employerContribution: '1312.80',
      totalContribution: '3500.80',
    });
  });

  it('should return for annual part salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 50000,
      frequency: SalaryFrequency.YEAR,
      contributionType: ContributionType.PART,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '2188.00',
      taxRelief: '437.60',
      employerContribution: '1312.80',
      totalContribution: '3500.80',
    });
  });

  it('should return for MONTH part salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 50000,
      frequency: 12,
      contributionType: ContributionType.PART,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '182.33',
      taxRelief: '36.47',
      employerContribution: '109.40',
      totalContribution: '291.73',
    });
  });

  it('should return for year full salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 100000,
      frequency: 1,
      contributionType: ContributionType.FULL,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '5000.00',
      taxRelief: '1000.00',
      employerContribution: '3000.00',
      totalContribution: '8000.00',
    });
  });

  it('should return for year part salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 100000,
      frequency: 1,
      contributionType: ContributionType.PART,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '2201.50',
      taxRelief: '440.30',
      employerContribution: '1320.90',
      totalContribution: '3522.40',
    });
  });

  it('should return for year part salary with tax relief message ', () => {
    const salaryCondition = contributionCalculator({
      salary: 100000,
      frequency: 1,
      contributionType: ContributionType.PART,
      employeeContribution: 80.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '35224.00',
      taxRelief: '7044.80',
      employerContribution: '1320.90',
      totalContribution: '36544.90',
    });
  });

  it('should return for year FULL salary with tax relief MAX message ', () => {
    const defaults = {
      salary: 180000,
      frequency: SalaryFrequency.YEAR,
      contributionType: ContributionType.FULL,
      employeeContribution: 80.0,
      employerContribution: 3.0,
    };
    const salaryConditionYear = contributionCalculator(defaults);
    const salaryConditionMonth = contributionCalculator({
      ...defaults,
      frequency: SalaryFrequency.MONTH,
    });
    const salaryConditionFourWeeks = contributionCalculator({
      ...defaults,
      frequency: SalaryFrequency.FOURWEEKS,
    });
    const salaryConditionWeek = contributionCalculator({
      ...defaults,
      frequency: SalaryFrequency.WEEK,
    });

    expect(salaryConditionYear).toEqual({
      yourContribution: '144000.00',
      taxRelief: '12000.00',
      employerContribution: '5400.00',
      totalContribution: '149400.00',
    });

    expect(salaryConditionMonth).toEqual({
      yourContribution: '12000.00',
      taxRelief: '1000.00',
      employerContribution: '450.00',
      totalContribution: '12450.00',
    });

    expect(salaryConditionFourWeeks).toEqual({
      yourContribution: '11076.92',
      taxRelief: '923.00',
      employerContribution: '415.38',
      totalContribution: '11492.30',
    });

    expect(salaryConditionWeek).toEqual({
      yourContribution: '2769.23',
      taxRelief: '230.70',
      employerContribution: '103.85',
      totalContribution: '2873.08',
    });
  });

  it('should return for MONTH full salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 6210,
      frequency: SalaryFrequency.MONTH,
      contributionType: ContributionType.FULL,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '25.88',
      taxRelief: '5.18',
      employerContribution: '15.52',
      totalContribution: '41.40',
    });
  });

  it('should return for 4 weeks full salary ', () => {
    const salaryCondition = contributionCalculator({
      salary: 6210,
      frequency: SalaryFrequency.FOURWEEKS,
      contributionType: ContributionType.FULL,
      employeeContribution: 5.0,
      employerContribution: 3.0,
    });

    expect(salaryCondition).toEqual({
      yourContribution: '23.88',
      taxRelief: '4.78',
      employerContribution: '14.33',
      totalContribution: '38.21',
    });
  });
});
