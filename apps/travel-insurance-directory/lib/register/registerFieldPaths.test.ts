import { createMockFirm } from 'components/FirmSummary/mockFirm';

import {
  getRegistrationFieldValue,
  buildRegistrationUpdate,
  prefixRegistrationUpdateForRenewalDraft,
  buildRenewalDraftFromFirm,
  buildPromoteRenewalDraftPatch,
} from './registerFieldPaths';

describe('getRegistrationFieldValue', () => {
  const firmSource = {
    type: 'main',
    covered_by_ombudsman_question: 'true',
    medical_coverage: {
      risk_profile_approach_question: 'bespoke',
    },
    service_details: {
      supplies_documentation_when_needed_question: true,
    },
  };

  it('reads top-level firm field', () => {
    expect(
      getRegistrationFieldValue(
        firmSource,
        'covered_by_ombudsman_question',
        '/register/firm',
      ),
    ).toBe('true');
  });

  it('reads nested risk_profile_approach_question', () => {
    expect(
      getRegistrationFieldValue(
        firmSource,
        'risk_profile_approach_question',
        '/register/firm',
      ),
    ).toBe('bespoke');
  });

  it('maps supplies_document boolean to radio string', () => {
    expect(
      getRegistrationFieldValue(
        firmSource,
        'supplies_document_when_needed_question',
        '/register/firm',
      ),
    ).toBe('true');

    expect(
      getRegistrationFieldValue(
        {
          ...firmSource,
          service_details: {
            supplies_documentation_when_needed_question: false,
          },
        },
        'supplies_document_when_needed_question',
        '/register/firm',
      ),
    ).toBe('false');
  });

  it('reads flat scenario specific_conditions keys', () => {
    const scenarioSource = {
      metastatic_breast_cancer: 'true',
      hiv: 'false',
    };

    expect(
      getRegistrationFieldValue(
        scenarioSource,
        'metastatic_breast_cancer',
        '/register/scenario',
      ),
    ).toBe('true');
  });

  it('returns empty string when source or value is missing', () => {
    expect(
      getRegistrationFieldValue(
        null,
        'risk_profile_approach_question',
        '/register/firm',
      ),
    ).toBe('');
    expect(getRegistrationFieldValue(firmSource, '', '/register/firm')).toBe(
      '',
    );
  });
});

describe('buildRegistrationUpdate', () => {
  it('maps firm risk field to nested cosmos path', () => {
    expect(
      buildRegistrationUpdate(
        '/register/firm',
        'risk_profile_approach_question',
        'bespoke',
      ),
    ).toEqual({
      'medical_coverage/risk_profile_approach_question': 'bespoke',
    });
  });
});

describe('renewal draft helpers', () => {
  it('prefixRegistrationUpdateForRenewalDraft nests paths under renewal_draft/', () => {
    expect(
      prefixRegistrationUpdateForRenewalDraft({
        'medical_coverage/risk_profile_approach_question': 'bespoke',
        covered_by_ombudsman_question: 'true',
      }),
    ).toEqual({
      'renewal_draft/medical_coverage/risk_profile_approach_question':
        'bespoke',
      'renewal_draft/covered_by_ombudsman_question': 'true',
    });
  });

  it('buildRenewalDraftFromFirm copies registration-captured fields', () => {
    const firm = createMockFirm({
      covered_by_ombudsman_question: 'true',
    });
    const draft = buildRenewalDraftFromFirm(firm);

    expect(draft.covered_by_ombudsman_question).toBe('true');
    expect(draft.medical_coverage.risk_profile_approach_question).toBe(
      firm.medical_coverage.risk_profile_approach_question,
    );
    expect(
      draft.service_details.supplies_documentation_when_needed_question,
    ).toBe(firm.service_details.supplies_documentation_when_needed_question);
    expect(draft.medical_coverage.specific_conditions.hiv).toBe(
      firm.medical_coverage.specific_conditions.hiv,
    );
  });

  it('buildPromoteRenewalDraftPatch maps draft back to live paths', () => {
    const draft = buildRenewalDraftFromFirm(createMockFirm());
    const patch = buildPromoteRenewalDraftPatch(draft);

    expect(patch.covered_by_ombudsman_question).toBe(
      draft.covered_by_ombudsman_question,
    );
    expect(patch['medical_coverage/risk_profile_approach_question']).toBe(
      draft.medical_coverage.risk_profile_approach_question,
    );
    expect(
      patch['service_details/supplies_documentation_when_needed_question'],
    ).toBe(draft.service_details.supplies_documentation_when_needed_question);
    expect(patch['medical_coverage/specific_conditions/hiv']).toBe(
      draft.medical_coverage.specific_conditions.hiv,
    );
  });
});
