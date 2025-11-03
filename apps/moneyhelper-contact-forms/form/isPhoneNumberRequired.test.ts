import { isPhoneNumberRequired } from './isPhoneNumberRequired';

jest.mock('../lib/constants', () => ({
  FLOWS_WITH_REQUIRED_PHONE_NUMBER: ['mock-flow'],
}));

describe('isPhoneNumberRequired', () => {
  it('returns false if flow is not provided', () => {
    const data = {};
    expect(isPhoneNumberRequired(data)).toBe(false);
  });
  it('returns true if flow does NOT require phone number', () => {
    const data = { flow: 'not-required-flow' };
    expect(isPhoneNumberRequired(data)).toBe(true);
  });

  it('returns true if flow requires phone number and it is provided', () => {
    const data = { flow: 'mock-flow', 'phone-number': '0123456789' };
    expect(isPhoneNumberRequired(data)).toBe(true);
  });

  it('returns false if flow requires phone number and it is missing', () => {
    const data = { flow: 'mock-flow' };
    expect(isPhoneNumberRequired(data)).toBe(false);
  });

  it('returns false if flow requires phone number and it is empty', () => {
    const data = { flow: 'mock-flow', 'phone-number': '   ' };
    expect(isPhoneNumberRequired(data)).toBe(false);
  });
});
