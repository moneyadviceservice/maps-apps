import {
  createMockFirm,
  createMockTradingFirm,
} from 'components/FirmSummary/mockFirm';
import { NOT_OFFERED_VALUE } from 'data/pages/account/tripCover/tripCoverConfig';
import {
  emptyServiceDetails,
  emptyTripCoverAgeLimits,
} from 'lib/firms/firmDefaults';
import {
  tripCoverWithAgeLimits,
  tripCoverWithSavedAgeLimits,
} from 'lib/firms/testing/tripCoverFixtures';
import { Office } from 'types/travel-insurance-firm';

import {
  areTripCoversComplete,
  coverAndServiceAccountHref,
  customerContactAccountHref,
  getCoverAndServiceSectionStatus,
  getCustomerContactSectionStatus,
  getFirmSectionStatuses,
  isCustomerContactComplete,
  isServiceDetailsComplete,
} from './firmSectionStatus';

describe('firmSectionStatus', () => {
  describe('getCoverAndServiceSectionStatus', () => {
    it('returns not_started when service_details are empty and trip_covers is empty', () => {
      expect(
        getCoverAndServiceSectionStatus(
          createMockFirm({
            service_details: emptyServiceDetails(),
            trip_covers: [],
          }),
        ),
      ).toBe('not_started');
    });

    it('returns not_started when service_details are complete but trip_covers is empty', () => {
      expect(getCoverAndServiceSectionStatus(createMockFirm())).toBe(
        'not_started',
      );
    });

    it('returns in_progress when trip_covers has entries without saved age limits', () => {
      expect(
        getCoverAndServiceSectionStatus(
          createMockFirm({
            service_details: emptyServiceDetails(),
            trip_covers: [
              {
                trip_type: 'single_trip',
                cover_area: 'uk_and_europe',
                age_limits: emptyTripCoverAgeLimits(),
                created_at: '',
                updated_at: '',
              },
            ],
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns in_progress when data is complete but cover service is not confirmed', () => {
      expect(
        getCoverAndServiceSectionStatus(
          createMockFirm({
            trip_covers: [
              tripCoverWithAgeLimits({
                up_to_30_days: { land: 70, cruise: 1000 },
                up_to_90_days: { land: 1000, cruise: 1000 },
                over_90_days: { land: 1000, cruise: 1000 },
              }),
            ],
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns completed when data is complete and cover_service_confirmed_at is set', () => {
      expect(
        getCoverAndServiceSectionStatus(
          createMockFirm({
            cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
            service_details: {
              ...emptyServiceDetails(),
              offers_telephone_quote: true,
              will_cover_specialist_equipment: false,
              how_far_in_advance_trip_cover: 'up_to_12_month',
              medical_screening_company: 'verisk',
            },
            trip_covers: [
              tripCoverWithAgeLimits({
                up_to_30_days: { land: 70, cruise: 1000 },
                up_to_90_days: { land: 1000, cruise: 1000 },
                over_90_days: { land: 1000, cruise: 1000 },
              }),
            ],
          }),
        ),
      ).toBe('completed');
    });
  });

  describe('getCustomerContactSectionStatus', () => {
    // --- NOT STARTED CASES ---

    it('returns not_started when office object is null', () => {
      expect(
        getCustomerContactSectionStatus(createMockFirm({ office: null })),
      ).toBe('not_started');
    });

    it('returns not_started when office object is empty', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({ office: {} as unknown as Office }),
        ),
      ).toBe('not_started');
    });

    it('returns not_started when office object contains fields that are not displayable values', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            office: {
              address: {
                line_one: '',
                line_two: null,
                town: undefined,
                county: '',
                postcode: '',
              },
              contact: {
                email_address: null,
                telephone_number: '',
                website: null,
              },
              location: { latitude: null, longitude: undefined },
              opening_times: {},
            } as unknown as Office,
          }),
        ),
      ).toBe('not_started');
    });

    // --- IN PROGRESS CASES ---

    it('returns in_progress when only a single deeply nested field is populated', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            office: {
              address: {
                line_one: '123 Main Street', // Only one valid string value here
                line_two: null,
                town: '',
                county: '',
                postcode: '',
              },
              contact: {
                email_address: null,
                telephone_number: '',
                website: null,
              },
              location: { latitude: null, longitude: null },
              opening_times: {},
            } as unknown as Office,
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns in_progress when office has phone number but other blocks are empty', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            office: {
              address: {
                line_one: '',
                line_two: null,
                town: '',
                county: '',
                postcode: '',
              },
              contact: {
                email_address: null,
                telephone_number: '020 1234 5678', // Isolated value
                website: null,
              },
              location: { latitude: null, longitude: null },
              opening_times: {},
            } as unknown as Office,
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns in_progress when numeric coordinate fields are 0', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            office: {
              address: {
                line_one: '',
                line_two: null,
                town: '',
                county: '',
                postcode: '',
              },
              contact: {
                email_address: null,
                telephone_number: '',
                website: null,
              },
              location: {
                latitude: 0,
                longitude: 0,
              },
              opening_times: {},
            } as unknown as Office,
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns in_progress when data is complete but contact is not confirmed', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            office: {
              ...createMockFirm().office,
              contact: {
                ...createMockFirm().office?.contact,
                website: 'https://office.example.com',
              },
            } as Office,
          }),
        ),
      ).toBe('in_progress');
    });

    it('returns completed when data is complete and customer_contact_confirmed_at is set', () => {
      expect(
        getCustomerContactSectionStatus(
          createMockFirm({
            customer_contact_confirmed_at: '2026-07-21T12:00:00.000Z',
            office: {
              ...createMockFirm().office,
              address: {
                line_one: '123 Test Street',
                line_two: '',
                town: 'London',
                county: '',
                postcode: 'SW1A 1AA',
                country: 'England',
              },
            } as Office,
          }),
        ),
      ).toBe('completed');
    });
  });

  describe('isCustomerContactComplete', () => {
    const baseOffice = createMockFirm().office!;

    it('returns true when county is populated', () => {
      expect(
        isCustomerContactComplete(
          createMockFirm({
            office: {
              ...baseOffice,
              address: {
                ...baseOffice.address,
                county: 'Kent',
                country: null,
              },
            },
          }),
        ),
      ).toBe(true);
    });

    it('returns true when country is populated instead of county', () => {
      expect(
        isCustomerContactComplete(
          createMockFirm({
            office: {
              ...baseOffice,
              address: {
                ...baseOffice.address,
                county: '',
                country: 'England',
              },
            },
          }),
        ),
      ).toBe(true);
    });

    it('returns false when neither county nor country is populated', () => {
      expect(
        isCustomerContactComplete(
          createMockFirm({
            office: {
              ...baseOffice,
              address: {
                ...baseOffice.address,
                county: '',
                country: '',
              },
            },
          }),
        ),
      ).toBe(false);
    });
  });

  describe('getFirmSectionStatuses', () => {
    it('evaluates main and trading documents independently', () => {
      const main = createMockFirm({
        customer_contact_confirmed_at: '2026-07-21T12:00:00.000Z',
      });
      const trading = createMockTradingFirm({
        main_firm_id: main.id,
        service_details: emptyServiceDetails(),
        trip_covers: [],
        office: null,
        website_address: null,
      });

      expect(getFirmSectionStatuses(main).coverAndService).toBe('not_started');
      expect(getFirmSectionStatuses(main).customerContactDetails).toBe(
        'completed',
      );
      expect(getFirmSectionStatuses(trading).coverAndService).toBe(
        'not_started',
      );
      expect(getFirmSectionStatuses(trading).customerContactDetails).toBe(
        'not_started',
      );
    });
  });

  describe('isServiceDetailsComplete', () => {
    const requiredOnly = {
      ...emptyServiceDetails(),
      offers_telephone_quote: true,
      will_cover_specialist_equipment: false,
      how_far_in_advance_trip_cover: 'up_to_12_month' as const,
      medical_screening_company: 'verisk',
    };

    it('is true when all four required fields are set', () => {
      expect(isServiceDetailsComplete(requiredOnly)).toBe(true);
    });

    it('is false when any one required field is missing', () => {
      expect(
        isServiceDetailsComplete({
          ...emptyServiceDetails(),
          offers_telephone_quote: true,
          will_cover_specialist_equipment: false,
          medical_screening_company: 'verisk',
        }),
      ).toBe(false);
    });

    it('is false when offers_telephone_quote is null', () => {
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          offers_telephone_quote: null,
        }),
      ).toBe(false);
    });

    it('is false when will_cover_specialist_equipment is null', () => {
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          will_cover_specialist_equipment: null,
        }),
      ).toBe(false);
    });

    it('is false when how_far_in_advance_trip_cover is null', () => {
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          how_far_in_advance_trip_cover: null,
        }),
      ).toBe(false);
    });

    it('is false when medical_screening_company is null, empty, or whitespace', () => {
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          medical_screening_company: null,
        }),
      ).toBe(false);
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          medical_screening_company: '',
        }),
      ).toBe(false);
      expect(
        isServiceDetailsComplete({
          ...requiredOnly,
          medical_screening_company: '   ',
        }),
      ).toBe(false);
    });
  });

  describe('areTripCoversComplete', () => {
    it('is false when array is empty', () => {
      expect(areTripCoversComplete([])).toBe(false);
    });

    it('is true when all limits are saved as not offered', () => {
      expect(
        areTripCoversComplete([
          tripCoverWithAgeLimits({
            up_to_30_days: {
              land: NOT_OFFERED_VALUE,
              cruise: NOT_OFFERED_VALUE,
            },
            up_to_90_days: {
              land: NOT_OFFERED_VALUE,
              cruise: NOT_OFFERED_VALUE,
            },
            over_90_days: {
              land: NOT_OFFERED_VALUE,
              cruise: NOT_OFFERED_VALUE,
            },
          }),
        ]),
      ).toBe(true);
    });
  });

  describe('coverAndServiceAccountHref', () => {
    const firmId = 'firm-123';

    it('returns regions path without resetDraft when not confirmed', () => {
      expect(
        coverAndServiceAccountHref(
          firmId,
          createMockFirm({
            trip_covers: [],
            service_details: emptyServiceDetails(),
          }),
        ),
      ).toBe('/account/trip-cover/regions/firm-123');
    });

    it('returns regions path without resetDraft when data is complete but not confirmed', () => {
      expect(
        coverAndServiceAccountHref(
          firmId,
          createMockFirm({
            trip_covers: [tripCoverWithSavedAgeLimits()],
          }),
        ),
      ).toBe('/account/trip-cover/regions/firm-123');
    });

    it('returns confirm path with resetDraft when confirmed', () => {
      expect(
        coverAndServiceAccountHref(
          firmId,
          createMockFirm({
            trip_covers: [tripCoverWithSavedAgeLimits()],
            cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
          }),
        ),
      ).toBe('/account/trip-cover/confirm/firm-123?resetDraft=true');
    });
  });

  describe('customerContactAccountHref', () => {
    const firmId = 'firm-123';

    it('returns contact start path without resetDraft when not confirmed', () => {
      expect(
        customerContactAccountHref(firmId, createMockFirm({ office: null })),
      ).toBe('/account/firm-details/customer-contact-details/firm-123');
    });

    it('returns contact start path without resetDraft when data is complete but not confirmed', () => {
      expect(customerContactAccountHref(firmId, createMockFirm())).toBe(
        '/account/firm-details/customer-contact-details/firm-123',
      );
    });

    it('returns confirm path with resetDraft when confirmed', () => {
      expect(
        customerContactAccountHref(
          firmId,
          createMockFirm({
            customer_contact_confirmed_at: '2026-07-21T12:00:00.000Z',
          }),
        ),
      ).toBe('/account/firm-details/confirm-details/firm-123?resetDraft=true');
    });
  });
});
