import { EmploymentMembershipPeriod } from '../../types';

/**
 * Filters out empty employment membership periods (objects with no properties)
 * @param periods - Array of employment membership periods that may contain empty objects
 * @returns Array of valid employment periods with actual data, or undefined if input is undefined
 */
export const filterValidEmploymentPeriods = (
  periods: EmploymentMembershipPeriod[] | undefined,
): EmploymentMembershipPeriod[] | undefined => {
  return periods?.filter((period) => Object.keys(period).length > 0);
};
