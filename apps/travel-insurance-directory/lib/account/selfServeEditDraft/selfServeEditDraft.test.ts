import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { emptyServiceDetails } from 'lib/firms/firmDefaults';
import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import {
  buildClearCoverServiceDraftPatch,
  buildClearCustomerContactDraftPatch,
  buildDraftOfficeUpdatePatch,
  buildDraftServiceDetailsPatch,
  buildDraftTripCoversPatch,
  buildPromoteCoverServiceConfirmPatch,
  buildPromoteCustomerContactConfirmPatch,
  mergeFirmWithSelfServeEditDraft,
} from './selfServeEditDraft';

describe('selfServeEditDraft', () => {
  const tripCover = tripCoverWithAgeLimits({
    up_to_30_days: { land: 70, cruise: 1000 },
    up_to_90_days: { land: 1000, cruise: 1000 },
    over_90_days: { land: 1000, cruise: 1000 },
  });

  it('mergeFirmWithSelfServeEditDraft overlays draft slices on live', () => {
    const firm = createMockFirm({
      trip_covers: [tripCover],
      self_serve_edit_draft: {
        service_details: {
          ...emptyServiceDetails(),
          offers_telephone_quote: false,
          will_cover_specialist_equipment: true,
          how_far_in_advance_trip_cover: 'up_to_6_month',
          medical_screening_company: 'other',
        },
      },
    });

    const merged = mergeFirmWithSelfServeEditDraft(firm);

    expect(merged.trip_covers).toEqual(firm.trip_covers);
    expect(merged.service_details.offers_telephone_quote).toBe(false);
    expect(merged.service_details.medical_screening_company).toBe('other');
    expect(merged.office).toEqual(firm.office);
  });

  it('buildDraftTripCoversPatch seeds service_details and stores trip_covers', () => {
    const firm = createMockFirm({ trip_covers: [tripCover] });
    const nextCovers = [
      tripCoverWithAgeLimits(
        {
          up_to_30_days: { land: 65, cruise: 1000 },
          up_to_90_days: { land: 1000, cruise: 1000 },
          over_90_days: { land: 1000, cruise: 1000 },
        },
        { cover_area: 'worldwide_including_us_canada' },
      ),
    ];

    const patch = buildDraftTripCoversPatch(firm, nextCovers);

    expect(patch).toEqual({
      self_serve_edit_draft: {
        trip_covers: nextCovers,
        service_details: firm.service_details,
      },
    });
  });

  it('buildDraftServiceDetailsPatch applies dotted paths onto seeded draft', () => {
    const firm = createMockFirm({ trip_covers: [tripCover] });
    const patch = buildDraftServiceDetailsPatch(firm, {
      'service_details/offers_telephone_quote': false,
    });

    const draft = patch.self_serve_edit_draft as {
      trip_covers: unknown;
      service_details: { offers_telephone_quote: boolean };
    };

    expect(draft.trip_covers).toEqual(firm.trip_covers);
    expect(draft.service_details.offers_telephone_quote).toBe(false);
  });

  it('buildDraftOfficeUpdatePatch seeds office and applies office paths', () => {
    const firm = createMockFirm();
    const patch = buildDraftOfficeUpdatePatch(firm, {
      'office/contact/email_address': 'new@example.com',
    });

    const draft = patch.self_serve_edit_draft as {
      office: { contact: { email_address: string } };
    };

    expect(draft.office.contact.email_address).toBe('new@example.com');
    expect(draft.office).toMatchObject({
      address: firm.office?.address,
    });
  });

  it('buildPromoteCoverServiceConfirmPatch promotes cover slices and clears them', () => {
    const office = createMockFirm().office;
    const firm = createMockFirm({
      trip_covers: [],
      self_serve_edit_draft: {
        trip_covers: [tripCover],
        service_details: {
          ...emptyServiceDetails(),
          offers_telephone_quote: true,
          will_cover_specialist_equipment: true,
          how_far_in_advance_trip_cover: 'up_to_12_month',
          medical_screening_company: 'verisk',
        },
        office,
      },
    });

    const patch = buildPromoteCoverServiceConfirmPatch(
      firm,
      '2026-07-21T12:00:00.000Z',
    );

    expect(patch.cover_service_confirmed_at).toBe('2026-07-21T12:00:00.000Z');
    expect(patch.trip_covers).toEqual([tripCover]);
    expect(patch.self_serve_edit_draft).toEqual({ office });
  });

  it('buildPromoteCustomerContactConfirmPatch promotes office and clears it', () => {
    const liveOffice = createMockFirm().office;
    if (!liveOffice) {
      throw new Error('expected mock firm office');
    }
    const draftOffice = {
      ...liveOffice,
      contact: {
        ...liveOffice.contact,
        email_address: 'draft@example.com',
      },
    };
    const firm = createMockFirm({
      self_serve_edit_draft: {
        trip_covers: [tripCover],
        office: draftOffice,
      },
    });

    const patch = buildPromoteCustomerContactConfirmPatch(
      firm,
      '2026-07-21T12:00:00.000Z',
    );

    expect(patch.customer_contact_confirmed_at).toBe(
      '2026-07-21T12:00:00.000Z',
    );
    expect(patch.office).toEqual(draftOffice);
    expect(patch.self_serve_edit_draft).toEqual({
      trip_covers: [tripCover],
    });
  });

  it('buildPromoteCoverServiceConfirmPatch with no draft only sets confirmed_at', () => {
    const firm = createMockFirm();
    const patch = buildPromoteCoverServiceConfirmPatch(
      firm,
      '2026-07-21T12:00:00.000Z',
    );

    expect(patch).toEqual({
      cover_service_confirmed_at: '2026-07-21T12:00:00.000Z',
      self_serve_edit_draft: null,
    });
  });

  it('buildClearCoverServiceDraftPatch removes cover slices and keeps office draft', () => {
    const office = createMockFirm().office;
    const firm = createMockFirm({
      self_serve_edit_draft: {
        trip_covers: [tripCover],
        office,
      },
    });

    expect(buildClearCoverServiceDraftPatch(firm)).toEqual({
      self_serve_edit_draft: { office },
    });
  });

  it('buildClearCoverServiceDraftPatch returns null when there is no cover draft', () => {
    expect(buildClearCoverServiceDraftPatch(createMockFirm())).toBeNull();
  });

  it('buildClearCustomerContactDraftPatch removes office and keeps cover draft', () => {
    const firm = createMockFirm({
      self_serve_edit_draft: {
        trip_covers: [tripCover],
        office: createMockFirm().office,
      },
    });

    expect(buildClearCustomerContactDraftPatch(firm)).toEqual({
      self_serve_edit_draft: { trip_covers: [tripCover] },
    });
  });
});
