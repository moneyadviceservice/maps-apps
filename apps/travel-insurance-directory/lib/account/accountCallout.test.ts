import { addMonths } from 'date-fns';
import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { emptySpecificConditions } from 'lib/firms/firmDefaults';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import { getAccountCalloutState } from './accountCallout';

describe('accountCallout', () => {
  it('shows re-registration banner when pending', () => {
    const firm = createMockFirm({
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
    });

    const state = getAccountCalloutState({}, firm);

    expect(state.showReregistrationBanner).toBe(true);
    expect(state.resumeRegistrationHref).toBe('/register/firm/step1');
    // Outside the 30-day window: resume path, not the start API.
    expect(state.reregistrationCtaHref).toBe('/register/firm/step1');
    expect(state.reregistrationExpirationLabel).toBeNull();
  });

  it('uses Resume CTA and draft resume href when renewal_draft exists', () => {
    const base = createMockFirm({
      approved_at: '2025-01-15T12:00:00.000Z',
      reregister_approved_at: null,
    });
    const firm = createMockFirm({
      approved_at: base.approved_at,
      reregistered_at: '2025-12-20T00:00:00.000Z',
      reregister_approved_at: null,
      renewal_draft: buildRenewalDraftFromFirm(base),
      renewal_resume_href: '/register/scenario/step5',
    });

    const now = addMonths(new Date('2025-01-15T12:00:00.000Z'), 11);
    now.setDate(now.getDate() + 5);

    const state = getAccountCalloutState({}, firm, now);

    expect(state.showReregistrationBanner).toBe(true);
    expect(state.hasRenewalDraft).toBe(true);
    expect(state.reregistrationCtaHref).toBe('/register/scenario/step5');
    expect(state.reregistrationExpirationLabel).toContain('2026');
  });

  it('omits expiration label for admin-triggered draft outside the 30-day window', () => {
    const firm = createMockFirm({
      approved_at: '2024-01-15T12:00:00.000Z',
      reregistered_at: '2024-06-01T00:00:00.000Z',
      reregister_approved_at: null,
      renewal_draft: buildRenewalDraftFromFirm(createMockFirm()),
      renewal_resume_href: '/register/firm/step2',
    });

    const state = getAccountCalloutState(
      {},
      firm,
      new Date('2024-06-15T00:00:00.000Z'),
    );

    expect(state.showReregistrationBanner).toBe(true);
    expect(state.reregistrationExpirationLabel).toBeNull();
    expect(state.reregistrationCtaHref).toBe('/register/firm/step2');
  });

  it('shows registration resume callout when not pre-approved', () => {
    const firm = createMockFirm({
      approved_at: null,
      medical_coverage: {
        ...createMockFirm().medical_coverage,
        specific_conditions: emptySpecificConditions(),
      },
    });

    const state = getAccountCalloutState(
      { savedProgressLink: '/register/scenario/step2' },
      firm,
    );

    expect(state.showRegistrationResumeCallout).toBe(true);
    expect(state.registrationIncomplete).toBe(true);
    expect(state.resumeRegistrationHref).toBe('/register/scenario/step2');
  });

  it('does not show registration resume callout when approved_at is set', () => {
    const firm = createMockFirm({
      approved_at: '2024-10-16T09:21:00Z',
      medical_coverage: {
        ...createMockFirm().medical_coverage,
        specific_conditions: emptySpecificConditions(),
      },
    });

    const state = getAccountCalloutState({}, firm);

    expect(state.showRegistrationResumeCallout).toBe(false);
  });

  it('shows only re-registration banner when re-reg is pending and approved_at is set', () => {
    const firm = createMockFirm({
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        ...createMockFirm().medical_coverage,
        specific_conditions: emptySpecificConditions(),
      },
    });

    const state = getAccountCalloutState(
      { savedProgressLink: '/register/firm/step3' },
      firm,
    );

    expect(state.showReregistrationBanner).toBe(true);
    expect(state.showRegistrationResumeCallout).toBe(false);
    expect(state.resumeRegistrationHref).toBe('/register/firm/step3');
  });

  it('starts re-registration at firm step 1 when saved link is confirm-details', () => {
    const firm = createMockFirm({
      approved_at: '2024-10-16T09:21:00Z',
      reregistered_at: '2024-11-21T10:18:00Z',
      reregister_approved_at: null,
      medical_coverage: {
        ...createMockFirm().medical_coverage,
        specific_conditions: emptySpecificConditions(),
      },
    });

    const state = getAccountCalloutState(
      { savedProgressLink: '/register/confirm-details' },
      firm,
    );

    expect(state.showReregistrationBanner).toBe(true);
    expect(state.resumeRegistrationHref).toBe('/register/firm/step1');
  });
});
