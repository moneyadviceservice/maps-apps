import { EmploymentMembershipPeriod } from '../../types';

export const getLatestEmployment = (
  employmentMembershipPeriods: EmploymentMembershipPeriod[] | undefined,
) => {
  if (
    !employmentMembershipPeriods ||
    employmentMembershipPeriods.length === 0
  ) {
    return null;
  }

  return employmentMembershipPeriods.reduce<EmploymentMembershipPeriod>(
    (latest, current) =>
      new Date(current.membershipStartDate) >
      new Date(latest.membershipStartDate)
        ? current
        : latest,
    employmentMembershipPeriods[0],
  );
};
