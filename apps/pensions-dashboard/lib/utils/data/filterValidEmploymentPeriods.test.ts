import { EmployerStatus } from '../../constants';
import { EmploymentMembershipPeriod } from '../../types';
import { filterValidEmploymentPeriods } from './filterValidEmploymentPeriods';

describe('filterValidEmploymentPeriods', () => {
  it('should return undefined when input is undefined', () => {
    const result = filterValidEmploymentPeriods(undefined);
    expect(result).toBeUndefined();
  });

  it('should filter out empty objects', () => {
    const periods = [
      {},
      {
        employerName: 'Valid Employer',
        employerStatus: EmployerStatus.C,
        membershipStartDate: '2020-01-01',
        membershipEndDate: '2025-01-01',
      },
      {},
    ] as EmploymentMembershipPeriod[];

    const result = filterValidEmploymentPeriods(periods);
    expect(result).toHaveLength(1);
    expect(result?.[0].employerName).toBe('Valid Employer');
  });

  it('should return empty array when all periods are empty objects', () => {
    const periods = [{}, {}, {}] as EmploymentMembershipPeriod[];
    const result = filterValidEmploymentPeriods(periods);
    expect(result).toHaveLength(0);
  });

  it('should return all periods when none are empty', () => {
    const periods = [
      {
        employerName: 'Employer 1',
        employerStatus: EmployerStatus.C,
        membershipStartDate: '2010-01-01',
        membershipEndDate: '2020-01-01',
      },
      {
        employerName: 'Employer 2',
        employerStatus: EmployerStatus.H,
        membershipStartDate: '2000-01-01',
        membershipEndDate: '2010-01-01',
      },
    ];

    const result = filterValidEmploymentPeriods(periods);
    expect(result).toHaveLength(2);
    expect(result?.[0].employerName).toBe('Employer 1');
    expect(result?.[1].employerName).toBe('Employer 2');
  });

  it('should return empty array when input is empty array', () => {
    const result = filterValidEmploymentPeriods([]);
    expect(result).toHaveLength(0);
  });
});
