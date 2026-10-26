import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';
import type { RenewalDraft } from 'types/travel-insurance-firm';

import {
  getRegistrationAnswersSource,
  getRegistrationScenarioAnswers,
} from './registrationAnswersSource';

describe('getRegistrationAnswersSource', () => {
  it('returns the live firm when there is no pending re-registration', () => {
    const firm = createMockFirm({
      reregistered_at: null,
      renewal_draft: null,
    });

    expect(getRegistrationAnswersSource(firm)).toBe(firm);
  });

  it('overlays a complete renewal draft', () => {
    const live = createMockFirm({
      covered_by_ombudsman_question: 'false',
    });
    const draft = buildRenewalDraftFromFirm(
      createMockFirm({
        covered_by_ombudsman_question: 'true',
      }),
    );
    const firm = createMockFirm({
      ...live,
      reregistered_at: '2025-12-01T00:00:00Z',
      renewal_draft: draft,
    });

    const source = getRegistrationAnswersSource(firm);

    expect(source.covered_by_ombudsman_question).toBe('true');
    expect(
      source.service_details.supplies_documentation_when_needed_question,
    ).toBe(draft.service_details.supplies_documentation_when_needed_question);
  });

  it('does not throw when renewal_draft is missing service_details', () => {
    const live = createMockFirm();
    const sparseDraft = {
      covered_by_ombudsman_question: 'true',
      medical_coverage: {
        risk_profile_approach_question: 'questionaire',
        specific_conditions: {},
      },
    } as RenewalDraft;

    const firm = createMockFirm({
      reregistered_at: '2025-12-01T00:00:00Z',
      renewal_draft: sparseDraft,
    });

    const source = getRegistrationAnswersSource(firm);

    expect(source.covered_by_ombudsman_question).toBe('true');
    expect(
      source.service_details.supplies_documentation_when_needed_question,
    ).toBe(live.service_details.supplies_documentation_when_needed_question);
  });
});

describe('getRegistrationScenarioAnswers', () => {
  it('reads specific_conditions from a sparse draft without throwing', () => {
    const firm = createMockFirm({
      reregistered_at: '2025-12-01T00:00:00Z',
      renewal_draft: {
        covered_by_ombudsman_question: null,
      } as RenewalDraft,
    });

    expect(getRegistrationScenarioAnswers(firm)).toEqual(
      firm.medical_coverage.specific_conditions,
    );
  });
});
