enum ContributionAge {
  MIN_LIMIT = 16,
  MIN_REQUIRED = 22,
  MAX_LIMIT = 66,
  MAX_REQUIRED = 75,
}

export type AgeConditionsResults = {
  minRequired: boolean;
  maxRequired: boolean;
  optIn: boolean;
};

export const ageConditions = (age: number): AgeConditionsResults => {
  const numberValid = age > 0;
  const minRequired = age < ContributionAge.MIN_LIMIT;
  const maxRequired = age >= ContributionAge.MAX_REQUIRED;
  const optIn =
    (age >= ContributionAge.MIN_LIMIT && age < ContributionAge.MIN_REQUIRED) ||
    (age >= ContributionAge.MAX_LIMIT && age < ContributionAge.MAX_REQUIRED);

  return {
    minRequired: numberValid && minRequired,
    maxRequired: numberValid && maxRequired,
    optIn: numberValid && optIn,
  };
};
