import {
  REQUIRED_HIGH_RISK_TRUE_COUNT,
  REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT,
  getAnsweredMedicalConditionsCount,
  getRegistrationFlowEntryHref,
  getTrueMedicalConditionsCount,
  isRegistrationIncomplete,
  isRegistrationPreApproved,
  shouldShowRegistrationResumeCallout,
} from './registrationCompletion';

import {
  emptySpecificConditions,
  SPECIFIC_CONDITION_KEYS,
} from 'lib/firms/firmDefaults';

import type {
  MainTravelInsuranceFirmDocument,
  SpecificConditions,
} from 'types/travel-insurance-firm';

function asFirm(partial: unknown): MainTravelInsuranceFirmDocument {
  return partial as MainTravelInsuranceFirmDocument;
}

function firmWithAnsweredConditions(
  answeredCount: number,
  answer: 'true' | 'false' = 'true',
): MainTravelInsuranceFirmDocument {
  const specific_conditions = { ...emptySpecificConditions() };
  SPECIFIC_CONDITION_KEYS.slice(0, answeredCount).forEach((key) => {
    specific_conditions[key] = answer;
  });
  return asFirm({
    type: 'main',
    medical_coverage: { specific_conditions },
  });
}

describe('registrationCompletion', () => {
  describe('getAnsweredMedicalConditionsCount', () => {
    it('returns 0 when medical_coverage is missing', () => {
      expect(getAnsweredMedicalConditionsCount(asFirm({ type: 'main' }))).toBe(
        0,
      );
    });

    it('returns 0 when specific_conditions is missing', () => {
      expect(
        getAnsweredMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: {},
          }),
        ),
      ).toBe(0);
    });

    it('returns 0 when specific_conditions is not an object', () => {
      expect(
        getAnsweredMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: {
              specific_conditions: null as unknown as SpecificConditions,
            },
          }),
        ),
      ).toBe(0);
    });

    it('returns 0 when all 19 keys exist but values are null', () => {
      expect(
        getAnsweredMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: {
              specific_conditions: emptySpecificConditions(),
            },
          }),
        ),
      ).toBe(0);
    });

    it('counts only canonical keys answered with true or false', () => {
      const specific_conditions = emptySpecificConditions();
      specific_conditions.metastatic_breast_cancer = 'true';
      specific_conditions.hiv = 'false';

      expect(
        getAnsweredMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(2);
    });

    it('does not count stray keys outside the canonical 19', () => {
      expect(
        getAnsweredMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: {
              specific_conditions: {
                ...emptySpecificConditions(),
                extra_key: 'true',
              } as unknown as SpecificConditions,
            },
          }),
        ),
      ).toBe(0);
    });
  });

  describe('isRegistrationIncomplete', () => {
    it('is true when fewer than 19 canonical conditions are answered', () => {
      expect(
        isRegistrationIncomplete(
          firmWithAnsweredConditions(
            REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT - 1,
          ),
        ),
      ).toBe(true);
    });

    it('is false when all 19 canonical conditions are true or false', () => {
      expect(
        isRegistrationIncomplete(
          firmWithAnsweredConditions(REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT),
        ),
      ).toBe(false);
    });

    it('is false when all 19 are answered with a mix of true and false', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] = index % 2 === 0 ? 'true' : 'false';
      });

      expect(
        isRegistrationIncomplete(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(false);
    });

    it('is true when firm has no medical_coverage', () => {
      expect(isRegistrationIncomplete(asFirm({ type: 'main' }))).toBe(true);
    });

    it('is true when all 19 keys exist but every value is null', () => {
      expect(
        isRegistrationIncomplete(
          asFirm({
            type: 'main',
            medical_coverage: {
              specific_conditions: emptySpecificConditions(),
            },
          }),
        ),
      ).toBe(true);
    });
  });

  describe('getTrueMedicalConditionsCount', () => {
    it('returns 0 when specific_conditions is missing', () => {
      expect(getTrueMedicalConditionsCount(asFirm({ type: 'main' }))).toBe(0);
    });

    it('counts only canonical keys with value true', () => {
      const specific_conditions = emptySpecificConditions();
      specific_conditions.metastatic_breast_cancer = 'true';
      specific_conditions.hiv = 'false';

      expect(
        getTrueMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(1);
    });

    it('does not count stray keys outside the canonical 19', () => {
      expect(
        getTrueMedicalConditionsCount(
          asFirm({
            type: 'main',
            medical_coverage: {
              specific_conditions: {
                ...emptySpecificConditions(),
                extra_key: 'true',
              } as unknown as SpecificConditions,
            },
          }),
        ),
      ).toBe(0);
    });
  });

  describe('isRegistrationPreApproved', () => {
    it('is false when fewer than 19 conditions are answered', () => {
      expect(
        isRegistrationPreApproved(
          firmWithAnsweredConditions(
            REQUIRED_SPECIFIC_CONDITION_ANSWER_COUNT - 1,
            'true',
          ),
        ),
      ).toBe(false);
    });

    it('is false when all 19 answered with only 14 true', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] = index < 14 ? 'true' : 'false';
      });

      expect(
        isRegistrationPreApproved(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(false);
    });

    it('is true when all 19 are answered and at least 15 are true', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] =
          index < REQUIRED_HIGH_RISK_TRUE_COUNT ? 'true' : 'false';
      });

      expect(
        isRegistrationPreApproved(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(true);
    });
  });

  describe('getRegistrationFlowEntryHref', () => {
    it('resumes saved progress when re-registration is pending', () => {
      const firm = asFirm({
        type: 'main',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(
        getRegistrationFlowEntryHref(
          { savedProgressLink: '/register/firm/step3' },
          firm,
        ),
      ).toBe('/register/firm/step3');
    });

    it('defaults to firm step 1 when re-registration is pending with no saved progress', () => {
      const firm = asFirm({
        type: 'main',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(getRegistrationFlowEntryHref({}, firm)).toBe(
        '/register/firm/step1',
      );
    });

    it('defaults to firm step 1 when re-registration is pending with stale confirm-details link', () => {
      const firm = asFirm({
        type: 'main',
        approved_at: '2024-10-16T09:21:00Z',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
      });

      expect(
        getRegistrationFlowEntryHref(
          { savedProgressLink: '/register/confirm-details' },
          firm,
        ),
      ).toBe('/register/firm/step1');
    });

    it('defaults to firm step 1 when re-registration is pending with complete medical answers and no saved link', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] =
          index < REQUIRED_HIGH_RISK_TRUE_COUNT ? 'true' : 'false';
      });
      const firm = asFirm({
        type: 'main',
        approved_at: '2024-10-16T09:21:00Z',
        reregistered_at: '2024-11-21T10:18:00Z',
        reregister_approved_at: null,
        medical_coverage: { specific_conditions },
      });

      expect(getRegistrationFlowEntryHref({}, firm)).toBe(
        '/register/firm/step1',
      );
    });

    it('returns saved progress link when registration is incomplete', () => {
      const firm = firmWithAnsweredConditions(5, 'true');

      expect(
        getRegistrationFlowEntryHref(
          { savedProgressLink: '/register/scenario/step2' },
          firm,
        ),
      ).toBe('/register/scenario/step2');
    });

    it('falls back to firm step1 when registration is incomplete and no saved link', () => {
      const firm = firmWithAnsweredConditions(5, 'true');

      expect(getRegistrationFlowEntryHref({}, firm)).toBe(
        '/register/firm/step1',
      );
    });

    it('returns confirm-details when registration questions are complete', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] =
          index < REQUIRED_HIGH_RISK_TRUE_COUNT ? 'true' : 'false';
      });
      const firm = asFirm({
        type: 'main',
        medical_coverage: { specific_conditions },
      });

      expect(
        getRegistrationFlowEntryHref(
          { savedProgressLink: '/register/scenario/step2' },
          firm,
        ),
      ).toBe('/register/confirm-details');
    });
  });

  describe('shouldShowRegistrationResumeCallout', () => {
    it('is true when registration is incomplete', () => {
      expect(
        shouldShowRegistrationResumeCallout(
          firmWithAnsweredConditions(5, 'true'),
        ),
      ).toBe(true);
    });

    it('is true when all 19 answered but not pre-approved', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] = index < 14 ? 'true' : 'false';
      });

      expect(
        shouldShowRegistrationResumeCallout(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(true);
    });

    it('is false when pre-approved', () => {
      const specific_conditions = emptySpecificConditions();
      SPECIFIC_CONDITION_KEYS.forEach((key, index) => {
        specific_conditions[key] =
          index < REQUIRED_HIGH_RISK_TRUE_COUNT ? 'true' : 'false';
      });

      expect(
        shouldShowRegistrationResumeCallout(
          asFirm({
            type: 'main',
            medical_coverage: { specific_conditions },
          }),
        ),
      ).toBe(false);
    });

    it('is false when approved_at is set', () => {
      expect(
        shouldShowRegistrationResumeCallout(
          asFirm({
            type: 'main',
            approved_at: '2024-10-16T09:21:00Z',
            medical_coverage: {
              specific_conditions: emptySpecificConditions(),
            },
          }),
        ),
      ).toBe(false);
    });
  });
});
