import {
  confirmDetailsPath,
  customerContactDetailsPath,
  firmDetailsBackLink,
  openingHoursPath,
  principlePlaceOfBusinessPath,
} from './firmDetailsRoutes';

describe('firmDetailsRoutes', () => {
  const firmId = 'firm-abc-123';

  it('customerContactDetailsPath includes firmId', () => {
    expect(customerContactDetailsPath(firmId)).toBe(
      '/account/firm-details/customer-contact-details/firm-abc-123',
    );
  });

  it('principlePlaceOfBusinessPath includes firmId', () => {
    expect(principlePlaceOfBusinessPath(firmId)).toBe(
      '/account/firm-details/principle-place-of-business/firm-abc-123',
    );
  });

  it('openingHoursPath includes firmId', () => {
    expect(openingHoursPath(firmId)).toBe(
      '/account/firm-details/opening-hours/firm-abc-123',
    );
  });

  it('confirmDetailsPath includes firmId', () => {
    expect(confirmDetailsPath(firmId)).toBe(
      '/account/firm-details/confirm-details/firm-abc-123',
    );
  });

  describe('firmDetailsBackLink', () => {
    it('returns confirm path when change answer is true', () => {
      expect(
        firmDetailsBackLink(firmId, 'true', customerContactDetailsPath(firmId)),
      ).toBe('/account/firm-details/confirm-details/firm-abc-123');
    });

    it('returns linear back link otherwise', () => {
      expect(firmDetailsBackLink(firmId, null, '/account')).toBe('/account');
      expect(firmDetailsBackLink(firmId, undefined, '/account')).toBe(
        '/account',
      );
      expect(firmDetailsBackLink(firmId, 'false', '/account')).toBe('/account');
    });
  });
});
