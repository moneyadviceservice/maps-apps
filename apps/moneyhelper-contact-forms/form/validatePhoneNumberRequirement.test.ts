import { EntryData } from '@maps-react/mhf/types';

import { routeFlow } from '../routes/routeFlow';
import { validatePhoneNumberRequirement } from './validatePhoneNumberRequirement';

jest.mock('../routes/routeFlow', () => ({
  routeFlow: new Map(),
}));

describe('validatePhoneNumberRequirement', () => {
  let data: EntryData;

  beforeEach(() => {
    data = {} as EntryData;
    (routeFlow as Map<string, unknown>).clear();
  });

  it('returns false if flow is not provided', () => {
    expect(validatePhoneNumberRequirement(data)).toBe(false);
  });

  it('returns true if flow does NOT require phone number', () => {
    data = { ...data, flow: 'some-flow' };
    // Mock the routeFlow to indicate phone number is not required
    routeFlow.set('some-flow', {
      steps: ['step1'],
      phoneNumberRequired: false,
    });
    expect(validatePhoneNumberRequirement(data)).toBe(true);
  });

  it('returns false if flow requires phone number but it is empty string', () => {
    data = {
      ...data,
      flow: 'phone-required-flow',
      'phone-number': '',
    };
    // Mock the routeFlow to indicate phone number is required
    routeFlow.set('phone-required-flow', {
      steps: ['step1'],
      phoneNumberRequired: true,
    });
    expect(validatePhoneNumberRequirement(data)).toBe(false);
  });
});
