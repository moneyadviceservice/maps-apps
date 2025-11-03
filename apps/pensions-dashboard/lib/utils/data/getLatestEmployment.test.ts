import { EmployerStatus } from '../../constants';
import { EmploymentMembershipPeriod } from '../../types';
import { getLatestEmployment } from './getLatestEmployment';

const mockData = [
  {
    membershipStartDate: '2022-01-01',
    employerName: 'Employer 1',
    employerStatus: EmployerStatus.C,
    membershipEndDate: '',
  },
  {
    membershipStartDate: '2021-01-01',
    employerName: 'Employer 1',
    employerStatus: EmployerStatus.H,
    membershipEndDate: '2021-12-31',
  },
  {
    membershipStartDate: '2020-01-01',
    employerName: 'Employer 1',
    employerStatus: EmployerStatus.H,
    membershipEndDate: '2020-12-31',
  },
] as EmploymentMembershipPeriod[];

describe('getLatestEmployment', () => {
  it('should return null if no data is available', () => {
    expect(getLatestEmployment([])).toBeNull();
    expect(getLatestEmployment(undefined)).toBeNull();
  });

  it('should return the only employment period if only one is provided', () => {
    const data = [mockData[0]];
    expect(getLatestEmployment(data)).toEqual(data[0]);
  });

  it('should return the latest employment period', () => {
    expect(getLatestEmployment(mockData)).toEqual(mockData[0]);
  });

  it('should handle employment periods with the same start date', () => {
    const periods = [mockData[0], mockData[0]];
    expect(getLatestEmployment(periods)).toEqual(periods[0]);
  });
});
