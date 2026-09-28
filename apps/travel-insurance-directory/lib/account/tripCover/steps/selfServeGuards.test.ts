import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  emptyMedicalSpecialisms,
  emptyServiceDetails,
} from 'lib/firms/firmDefaults';
import {
  tripCoverWithAgeLimits,
  tripCoverWithSavedAgeLimits,
} from 'lib/firms/testing/tripCoverFixtures';

import {
  getSelfServeApiRedirectIfIncomplete,
  getSelfServeRedirectIfIncomplete,
  SELF_SERVE_GUARD_PAGE,
} from './selfServeGuards';
import {
  confirmPath,
  medicalSpecialismPath,
  serviceDetailsPath,
} from './tripCoverRoutes';

describe('getSelfServeRedirectIfIncomplete', () => {
  const firmId = 'firm-123';
  const incompleteTripCover = tripCoverWithAgeLimits(
    {},
    { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
  );
  const completeTripCover = tripCoverWithSavedAgeLimits({
    cover_area: 'uk_and_europe',
    trip_type: 'single_trip',
  });
  const incompleteTripCoverPath =
    '/account/trip-cover/firm-123/uk_and_europe/single_trip';

  describe('confirm page', () => {
    it('redirects to the first incomplete trip cover step', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [incompleteTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.confirm },
        ),
      ).toBe(incompleteTripCoverPath);
    });

    it('returns null when trip covers are incomplete but have no step path', () => {
      expect(
        getSelfServeRedirectIfIncomplete(firmId, createMockFirm(), {
          page: SELF_SERVE_GUARD_PAGE.confirm,
        }),
      ).toBeNull();
    });

    it('redirects to medical specialism when trip covers are complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({
            trip_covers: [completeTripCover],
            medical_specialisms: emptyMedicalSpecialisms(),
          }),
          { page: SELF_SERVE_GUARD_PAGE.confirm },
        ),
      ).toBe(medicalSpecialismPath(firmId));
    });

    it('redirects to service details when earlier sections are complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({
            trip_covers: [completeTripCover],
            service_details: emptyServiceDetails(),
          }),
          { page: SELF_SERVE_GUARD_PAGE.confirm },
        ),
      ).toBe(serviceDetailsPath(firmId));
    });

    it('returns null when every section is complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [completeTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.confirm },
        ),
      ).toBeNull();
    });
  });

  describe('confirm API', () => {
    it('redirects to confirm when any section is incomplete', () => {
      expect(
        getSelfServeApiRedirectIfIncomplete(firmId, createMockFirm()),
      ).toBe(confirmPath(firmId));
    });

    it('returns null when every section is complete', () => {
      expect(
        getSelfServeApiRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [completeTripCover] }),
        ),
      ).toBeNull();
    });
  });

  describe('medical specialism', () => {
    it('returns null when changing an answer', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [incompleteTripCover] }),
          {
            page: SELF_SERVE_GUARD_PAGE.medicalSpecialism,
            isChangeAnswer: true,
          },
        ),
      ).toBeNull();
    });

    it('redirects to the first incomplete trip cover step', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [incompleteTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.medicalSpecialism },
        ),
      ).toBe(incompleteTripCoverPath);
    });

    it('returns null when trip covers are complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [completeTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.medicalSpecialism },
        ),
      ).toBeNull();
    });
  });

  describe('service details', () => {
    it('returns null when changing an answer', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({
            trip_covers: [incompleteTripCover],
            medical_specialisms: emptyMedicalSpecialisms(),
          }),
          {
            page: SELF_SERVE_GUARD_PAGE.serviceDetails,
            isChangeAnswer: true,
          },
        ),
      ).toBeNull();
    });

    it('redirects to the first incomplete trip cover step', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [incompleteTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.serviceDetails },
        ),
      ).toBe(incompleteTripCoverPath);
    });

    it('redirects to medical specialism when trip covers are complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({
            trip_covers: [completeTripCover],
            medical_specialisms: emptyMedicalSpecialisms(),
          }),
          { page: SELF_SERVE_GUARD_PAGE.serviceDetails },
        ),
      ).toBe(medicalSpecialismPath(firmId));
    });

    it('redirects to medical specialism when trip covers are empty', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({
            medical_specialisms: emptyMedicalSpecialisms(),
          }),
          { page: SELF_SERVE_GUARD_PAGE.serviceDetails },
        ),
      ).toBe(medicalSpecialismPath(firmId));
    });

    it('returns null when prior sections are complete', () => {
      expect(
        getSelfServeRedirectIfIncomplete(
          firmId,
          createMockFirm({ trip_covers: [completeTripCover] }),
          { page: SELF_SERVE_GUARD_PAGE.serviceDetails },
        ),
      ).toBeNull();
    });
  });
});
