import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { getValueByPath } from './getValueByPath';

describe('getValueByPath', () => {
  const mockFirm = {
    id: 'firm_123',
    registered_name: 'Global Shield Ltd',
    office: {
      contact: {
        email_address: 'support@globalshield.com',
        phone_number: 5551234,
      },
    },
    metadata: null,
  } as unknown as TravelInsuranceFirmDocument;

  it('should successfully retrieve a deeply nested string value', () => {
    const result = getValueByPath(mockFirm, 'office/contact/email_address');
    expect(result).toBe('support@globalshield.com');
  });

  it('should successfully retrieve a top-level string value', () => {
    const result = getValueByPath(mockFirm, 'registered_name');
    expect(result).toBe('Global Shield Ltd');
  });

  it('should return an empty string if the path does not exist in the object', () => {
    const result = getValueByPath(mockFirm, 'office/contact/postal_code');
    expect(result).toBeNull();
  });

  it('should return an empty string if the target value is found but is not a string', () => {
    expect(getValueByPath(mockFirm, 'office/contact')).toBeNull();

    expect(getValueByPath(mockFirm, 'office/contact/phone_number')).toBeNull();
  });

  it('should safely short-circuit and return an empty string if an intermediate path is null or undefined', () => {
    const result = getValueByPath(mockFirm, 'metadata/tier/level');
    expect(result).toBeNull();
  });

  it('should return an empty string if data is null or undefined', () => {
    const result = getValueByPath(null, 'registered_name');
    expect(result).toBeNull();
  });
});
