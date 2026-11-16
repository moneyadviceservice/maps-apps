import {
  SERVICE_DETAILS_FIELDS,
  SERVICE_DETAILS_REQUIRED_MESSAGES,
} from './service-details';

describe('service-details', () => {
  it('returns GDS-aligned required messages for every service details field', () => {
    for (const field of SERVICE_DETAILS_FIELDS) {
      expect(SERVICE_DETAILS_REQUIRED_MESSAGES[field.key]).toMatch(/^Select /);
      expect(SERVICE_DETAILS_REQUIRED_MESSAGES[field.key]).not.toMatch(
        /please/i,
      );
    }

    expect(SERVICE_DETAILS_REQUIRED_MESSAGES.offers_telephone_quote).toBe(
      'Select whether you offer a telephone quote service',
    );
    expect(SERVICE_DETAILS_REQUIRED_MESSAGES.medical_screening_company).toBe(
      'Select your medical screening provider',
    );
    expect(
      SERVICE_DETAILS_REQUIRED_MESSAGES.how_far_in_advance_trip_cover,
    ).toBe('Select how far in advance you provide cover');
  });
});
