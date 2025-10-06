import { ageConditions } from './ageConditions';

describe('ageConditions', () => {
  it('should return min required for min age 15', () => {
    const ageCondition = ageConditions(15);

    expect(ageCondition).toEqual({
      minRequired: true,
      maxRequired: false,
      optIn: false,
    });
  });

  it('should return optin as true for min age 16', () => {
    const ageCondition = ageConditions(16);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: true,
    });
  });

  it('should return optin true for age 21', () => {
    const ageCondition = ageConditions(21);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: true,
    });
  });

  it('should return all conditions as false for age 22', () => {
    const ageCondition = ageConditions(22);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: false,
    });
  });

  it('should return all conditions as false for age 65', () => {
    const ageCondition = ageConditions(65);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: false,
    });
  });

  it('should return optin true for age 66', () => {
    const ageCondition = ageConditions(66);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: true,
    });
  });

  it('should return optin true for age 74', () => {
    const ageCondition = ageConditions(74);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: false,
      optIn: true,
    });
  });

  it('should return maxRequired for age 75', () => {
    const ageCondition = ageConditions(75);

    expect(ageCondition).toEqual({
      minRequired: false,
      maxRequired: true,
      optIn: false,
    });
  });
});
