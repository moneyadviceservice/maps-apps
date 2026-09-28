import { EntryData } from '@maps-react/mhf/types';

import { ContactFlowConfigMap } from '../lib/types';
import { flowConfig } from '../routes/flowConfig';
import { validatePhoneNumberRequirement } from './validatePhoneNumberRequirement';

jest.mock('../routes/flowConfig', () => ({
  flowConfig: new Map() as ContactFlowConfigMap,
}));

describe('validatePhoneNumberRequirement', () => {
  let data: EntryData;

  beforeEach(() => {
    data = {} as EntryData;
    flowConfig.clear();
  });

  it('returns false if flow is not provided', () => {
    expect(validatePhoneNumberRequirement(data)).toBe(false);
  });

  it('returns true if flow does NOT require phone number', () => {
    data = { ...data, flow: 'phone-not-required-flow' };
    // Mock the flowConfig to indicate phone number is not required
    flowConfig.set('phone-not-required-flow', {
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
    // Mock the flowConfig to indicate phone number is required
    flowConfig.set('phone-required-flow', {
      phoneNumberRequired: true,
    });
    expect(validatePhoneNumberRequirement(data)).toBe(false);
  });
});
