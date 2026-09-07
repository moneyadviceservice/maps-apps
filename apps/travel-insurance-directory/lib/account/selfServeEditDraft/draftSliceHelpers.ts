import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import type {
  SelfServeEditDraft,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export const SELF_SERVE_EDIT_DRAFT_KEY = 'self_serve_edit_draft';

export const COVER_SERVICE_DRAFT_KEYS = [
  'trip_covers',
  'service_details',
] as const;

export const CUSTOMER_CONTACT_DRAFT_KEYS = ['office'] as const;

export const ALL_DRAFT_SLICE_KEYS = [
  ...COVER_SERVICE_DRAFT_KEYS,
  ...CUSTOMER_CONTACT_DRAFT_KEYS,
] as const;

export type DraftSliceKey = keyof SelfServeEditDraft;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/** Normalize form/API paths like `/office/contact/email` → `contact.email`. */
export function normalizeRelativePath(
  path: string,
  rootSegment: string,
): string {
  return path
    .replace(/^\/+/, '')
    .replaceAll('/', '.')
    .replace(new RegExp(String.raw`^${escapeRegExp(rootSegment)}\.`), '');
}

export function applyPathUpdates<T extends object>(
  target: T,
  updates: Record<string, unknown>,
  rootSegment: string,
): T {
  const next = cloneDeep(target);

  for (const [path, value] of Object.entries(updates)) {
    set(next, normalizeRelativePath(path, rootSegment), value);
  }

  return next;
}

function getDraft(firm: TravelInsuranceFirmDocument): SelfServeEditDraft {
  return firm.self_serve_edit_draft ? { ...firm.self_serve_edit_draft } : {};
}

export function draftHasAnySlice(
  draft: SelfServeEditDraft | null | undefined,
  keys: readonly DraftSliceKey[],
): boolean {
  if (draft == null) {
    return false;
  }

  return keys.some((key) => draft[key] !== undefined);
}

/** Copy live firm fields into missing draft slices. */
export function seedDraftSlices(
  firm: TravelInsuranceFirmDocument,
  keys: readonly DraftSliceKey[],
): SelfServeEditDraft {
  const draft = getDraft(firm);

  for (const key of keys) {
    if (key === 'trip_covers') {
      draft.trip_covers ??= cloneDeep(firm.trip_covers ?? []);
    } else if (key === 'service_details') {
      draft.service_details ??= cloneDeep(firm.service_details);
    } else if (key === 'office') {
      draft.office ??= cloneDeep(firm.office);
    }
  }

  return draft;
}

function omitDraftSlices(
  draft: SelfServeEditDraft | null | undefined,
  keysToOmit: readonly DraftSliceKey[],
): SelfServeEditDraft | null {
  if (draft == null) {
    return null;
  }

  const remaining: SelfServeEditDraft = { ...draft };
  for (const key of keysToOmit) {
    delete remaining[key];
  }

  return draftHasAnySlice(remaining, ALL_DRAFT_SLICE_KEYS) ? remaining : null;
}

export function wrapDraftPatch(
  draft: SelfServeEditDraft | null,
): Record<string, unknown> {
  return { [SELF_SERVE_EDIT_DRAFT_KEY]: draft };
}

/**
 * Promote selected draft slices to live fields, clear those slices, and set a
 * confirmation timestamp.
 */
export function buildPromoteDraftSlicesPatch(
  firm: TravelInsuranceFirmDocument,
  confirmedAtField: string,
  confirmedAt: string,
  sliceKeys: readonly DraftSliceKey[],
): Record<string, unknown> {
  const draft = firm.self_serve_edit_draft;
  const patch: Record<string, unknown> = {
    [confirmedAtField]: confirmedAt,
    ...wrapDraftPatch(omitDraftSlices(draft, sliceKeys)),
  };

  for (const key of sliceKeys) {
    if (draft?.[key] !== undefined) {
      patch[key] = draft[key];
    }
  }

  return patch;
}

/** Drop selected draft slices without promoting. */
export function buildClearDraftSlicesPatch(
  firm: TravelInsuranceFirmDocument,
  sliceKeys: readonly DraftSliceKey[],
): Record<string, unknown> | null {
  if (!draftHasAnySlice(firm.self_serve_edit_draft, sliceKeys)) {
    return null;
  }

  return wrapDraftPatch(omitDraftSlices(firm.self_serve_edit_draft, sliceKeys));
}
