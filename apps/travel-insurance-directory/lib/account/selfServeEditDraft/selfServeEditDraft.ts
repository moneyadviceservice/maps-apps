import type {
  Office,
  ServiceDetails,
  TravelInsuranceFirmDocument,
  TripCover,
} from 'types/travel-insurance-firm';

import {
  applyPathUpdates,
  buildClearDraftSlicesPatch,
  buildPromoteDraftSlicesPatch,
  COVER_SERVICE_DRAFT_KEYS,
  CUSTOMER_CONTACT_DRAFT_KEYS,
  seedDraftSlices,
  wrapDraftPatch,
} from './draftSliceHelpers';

/** View model for summary + form prefill (live fields overridden by draft slices). */
export function mergeFirmWithSelfServeEditDraft<
  T extends TravelInsuranceFirmDocument,
>(firm: T): T {
  const draft = firm.self_serve_edit_draft;
  if (draft == null) {
    return firm;
  }

  return {
    ...firm,
    trip_covers: draft.trip_covers ?? firm.trip_covers,
    service_details: draft.service_details ?? firm.service_details,
    office: draft.office !== undefined ? draft.office : firm.office,
  };
}

/** Persist full trip_covers into the edit draft (seeds cover slice if needed). */
export function buildDraftTripCoversPatch(
  firm: TravelInsuranceFirmDocument,
  tripCovers: TripCover[],
): Record<string, unknown> {
  const draft = seedDraftSlices(firm, COVER_SERVICE_DRAFT_KEYS);
  draft.trip_covers = tripCovers;
  return wrapDraftPatch(draft);
}

/**
 * Apply service_details/* dotted patches onto a seeded draft service_details object.
 */
export function buildDraftServiceDetailsPatch(
  firm: TravelInsuranceFirmDocument,
  serviceDetailsPatch: Record<string, unknown>,
): Record<string, unknown> {
  const draft = seedDraftSlices(firm, COVER_SERVICE_DRAFT_KEYS);
  draft.service_details = applyPathUpdates(
    draft.service_details as ServiceDetails,
    serviceDetailsPatch,
    'service_details',
  );
  return wrapDraftPatch(draft);
}

/**
 * Seed draft.office if missing, then apply office/* paths under the draft.
 */
export function buildDraftOfficeUpdatePatch(
  firm: TravelInsuranceFirmDocument,
  officeUpdateRecord: Record<string, unknown>,
): Record<string, unknown> {
  const draft = seedDraftSlices(firm, CUSTOMER_CONTACT_DRAFT_KEYS);
  const office = (draft.office ?? {}) as Office;
  draft.office = applyPathUpdates(office, officeUpdateRecord, 'office');
  return wrapDraftPatch(draft);
}

/** Drop cover/service draft slices without promoting (fresh journey from account). */
export function buildClearCoverServiceDraftPatch(
  firm: TravelInsuranceFirmDocument,
): Record<string, unknown> | null {
  return buildClearDraftSlicesPatch(firm, COVER_SERVICE_DRAFT_KEYS);
}

/** Drop office draft without promoting (fresh journey from account). */
export function buildClearCustomerContactDraftPatch(
  firm: TravelInsuranceFirmDocument,
): Record<string, unknown> | null {
  return buildClearDraftSlicesPatch(firm, CUSTOMER_CONTACT_DRAFT_KEYS);
}

/** Promote cover/service draft slices to live and set confirmation timestamp. */
export function buildPromoteCoverServiceConfirmPatch(
  firm: TravelInsuranceFirmDocument,
  confirmedAt: string,
): Record<string, unknown> {
  return buildPromoteDraftSlicesPatch(
    firm,
    'cover_service_confirmed_at',
    confirmedAt,
    COVER_SERVICE_DRAFT_KEYS,
  );
}

/** Promote office draft to live and set confirmation timestamp. */
export function buildPromoteCustomerContactConfirmPatch(
  firm: TravelInsuranceFirmDocument,
  confirmedAt: string,
): Record<string, unknown> {
  return buildPromoteDraftSlicesPatch(
    firm,
    'customer_contact_confirmed_at',
    confirmedAt,
    CUSTOMER_CONTACT_DRAFT_KEYS,
  );
}
