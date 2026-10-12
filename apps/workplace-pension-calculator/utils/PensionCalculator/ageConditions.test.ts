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

  it.each([
    {
      age: 16,
      expected: { minRequired: false, maxRequired: false, optIn: true },
      label: 'should return optin as true for min age 16',
    },
    {
      age: 21,
      expected: { minRequired: false, maxRequired: false, optIn: true },
      label: 'should return optin true for age 21',
    },
    {
      age: 22,
      expected: { minRequired: false, maxRequired: false, optIn: false },
      label: 'should return all conditions as false for age 22',
    },
    {
      age: 65,
      expected: { minRequired: false, maxRequired: false, optIn: false },
      label: 'should return all conditions as false for age 65',
    },
  ])('$label', ({ age, expected }) => {
    const ageCondition = ageConditions(age);

    expect(ageCondition).toEqual(expected);
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
